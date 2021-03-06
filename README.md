# Gothacked?

## Overview
More info: you can find an overview of that setup on my [blog](https://greg.satoshi.tech/firebase-bigquery-to-query-1-billion-leaked-passwords/)

### Scope
Simple webpage where you can search in a DB if your credentials have been compromised.

### Tech
- Hosting: Firebase cloud
- Front: simple html + bootstrap + css in firebase CDN
- Backend: Firebase functions
- Authentification : Firebase auth (email + password + activation link)
- Database: GCP bigquery
- Search log: realtime DB
- Code + CICD: gitlab.com (github is just a mirror)


### Flow
User -> nodejs @firebase -> login via firebase-auth -> search data -> bigquery (GCP)


## Setup

### Setup firebase
- Create a new project in firebase `gothacked`, location default (US)
- Activate auth (email + password)


### Bigquery setup
- In firebase, link you project to bigquery: setting>integration
- Go in GCP>your_firebase_project>bigquery and create a dataset in location default (US) with the data (sample or production one): new table from csv `/extra/sample_data/file1.txt`
- For production, follow the [setup](https://blog.appsecco.com/using-google-cloud-platform-to-store-and-query-1-4-billion-usernames-and-passwords-6cac572f5a29). I used this command to download the torrent: 
```
aria2c --enable-dht=true "magnet:?xt=urn:btih:7ffbcd8cee06aba2ce6561688cf68ce2addca0a3&dn=BreachCompilation&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fglotorrents.pw%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337" -d /home/greg/aria2c/torrents
```
- To permit local test, create service account in GCP:`bigquery-user-for-local-test` with role: `bigquery data viewer + job user + Cloud Filestore Editor (for writing Searchlogs in RealtimeDB)`, download json and run the command on your laptop:

```
export GOOGLE_APPLICATION_CREDENTIALS="/Users/greg/dev/cred/gothacked-dev-c5e73c343d5d.json"
```
Then you will be able to deploy locally and test the app with: `firebase serve --debug`


## Deploy locally

- Locally, always use `gothacked-dev` project and dev service account as doing PROD search in bigquery of 42GB cost 0.2$ each time...
- Setup bigquery service account:
```
export GOOGLE_APPLICATION_CREDENTIALS="/Users/greg/dev/cred/gothacked-dev-c5e73c343d5d.json"
```
- in `index.html`: uncomment line: `firebase.functions().useFunctionsEmulator('http://localhost:5001')`. This permit to run queries against local functions instead of cloud functions (default)
- Deploy live on firebase: `firebase use gothacked-dev`
- Deploy live on firebase: `firebase serve --debug`
- Visit page: http://localhot:5000


## Deploy to firebase cloud hosting
- Deploy live on firebase: `firebase deploy --debug`
- Visit page: https://gothacked.satoshi.tech


## Deploy via CI-CD
- Just push code in master and it will get deployed!
- Setup tuto [here](https://medium.com/@rambabusaravanan/firebase-hosting-deployment-automation-with-gitlab-ci-f3fad9130d62)


Manual CURL
```
curl -d "search=batman&userTemp=curl_test@gmail.com" -H "Content-Type: application/x-www-form-urlencoded" -X POST https://gothacked.satoshi.tech/
```
