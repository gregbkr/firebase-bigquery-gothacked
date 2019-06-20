// FIREBASE
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const express = require('express')
const engines = require('consolidate')
const app = express()

var bodyParser = require('body-parser')
var path = require('path')
var qs = require('querystring')
var fs = require('fs')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extend:true}))
app.use(bodyParser.json())

// BIGQUERY //
// Import the Google Cloud client library
const {BigQuery} = require('@google-cloud/bigquery')

async function mybigquery (search){
    // Create a client
    const bigqueryClient = new BigQuery();

    const query = `
        SELECT * FROM gothacked.passwords_from_torrent
        WHERE username LIKE @search
        LIMIT 100
        `
    const options = {
        query: query,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'US',
        params: {search: '%' + search + '%', min_word_count: 250},
    }

    // Run the query as a job
    const [job] = await bigqueryClient.createQueryJob(options)
    console.log(`Job ${job.id} started.`)

    // Wait for the query to finish
    const [rows] = await job.getQueryResults()

    // Print the results
    rows.forEach(row => console.log(row))
    return rows
};

exports.searchDB = functions.https.onCall((data, context) => {

	// Checking that the user is authenticated.
	if (!context.auth) {
	    // Throwing an HttpsError so that the client gets the error details.
	    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
	      'while authenticated.');
	}

	// Only admin Greg can run the search (because bigquery is expensive!!)
	const email = context.auth.token.email || null

	if (email.indexOf('@finstack') < 0 ) {
		// Throwing an HttpsError so that the client gets the error details.
	    throw new functions.https.HttpsError('failed-precondition', 'Only admins can run the search! Please ask some admin credential.');
	    return {
	    	error: 'Only admins can run the search! Please ask some admin credential'
	    }
	}

    return mybigquery(data.search).then(dbResult => {
        return {
			dbResult
		}
    })	 

})
