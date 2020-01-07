# Readme

## Live environment
The live version of the front-end runs on https://vidden.karenbrakband.nl (which has a connection to https://vidden-api.azurewebsites.net)

## Local environment
To build the front-end locally run the following commands:
```
$ yarn install 
$ npm install
$ grunt build
```
From Visual Studio, run the API and change in `store.js` the `apiBaseUrl` to the local instance of the api.

Open `index.html` in your favorite browser.

## Testing
Run the following command to test the application
```
// For output in terminal only
$ npm run test

// For visual testing
$ npm run test:full
```