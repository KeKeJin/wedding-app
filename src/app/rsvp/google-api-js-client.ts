

 // Client ID and API key from the Developer Console
 var CLIENT_ID = '<YOUR_CLIENT_ID>';
 var API_KEY = '<YOUR_API_KEY>';

 // Array of API discovery doc URLs for APIs used by the quickstart
 var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

 // Authorization scopes required by the API; multiple scopes can be
 // included, separated by spaces.
 var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
 
 function start() {
    // Initializes the client with the API key and the Translate API.
    gapi.client.init({     apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    })
}