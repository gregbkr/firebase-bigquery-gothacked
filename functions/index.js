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
        LIMIT 50
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

app.get('/', function(req, res) {
    console.log ('#################' + req.session)
      
    res.render('home.ejs', { 
        nbResult: '',
        searchedData: '',
        dbResult: ''
    })
})

app.post('/', async function(req, res) {
    
    // value to log in search-history
    var search = req.body.search
    var user = req.body.userTemp
    var date = new Date(); 
    var timestamp = date.getTime()

    console.log(user + ' | ' + search + ' | ' + timestamp)

    admin.database().ref('/search-history').push().set({
        user: user,
        search: search,
        timestamp: timestamp
    })

    mybigquery(search).then(dbResult => {
        // Render result to html page with vars
        res.render('home.ejs', { 
          nbResult: dbResult.length + ' result(s) [login : password] for user  ',
          searchedData: '"' + search + '"',
          dbResult: dbResult
        })
    })
})

exports.app = functions.https.onRequest(app)


