# Gothacked?

## Overview

### Scope
Simple webpage where you can search in a DB if you credentials have been compromised.

### Tech
- Hosting: Firebase cloud
- Front: nodejs express + bootstrap + css
- Backend: Firebase functions
- Authentification : Firebase auth
- Database: GCP bigquery

### Flow
User -> nodejs @firebase -> login via firebase-auth -> search data -> bigquery (GCP)


## Setup

### Setup firebase
- Create a new project in firebase `gothack`, location default (US)
- Activate auth (email + password)


### Bigquery setup
- In firebase, link you project to bigquery: setting>integration
- Go in GCP>your_firebase_project>bigquery and create a dataset in location default (US) with the data (sample or production one): new table from csv `/extra/sample_data/file1.txt`
- to permit local test, create service account in GCP:`bigquery-user-for-local-test` with role: `bigquery data viewer + job user`, download json and run the command on your laptop:

```
export GOOGLE_APPLICATION_CREDENTIALS="/Users/greg/dev/cred/gothacked-99644-cfc5336913dd.json"
```
Then you will be able to deploy locally and test the app with: `firebase serve --debug`


## Deploy

Deploy live on firebase: `firebase deploy --debug`



## Need to fix

- Only logged can call POST
- CI-CD


