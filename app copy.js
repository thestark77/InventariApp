const itemsList = document.getElementById("itemsList");
const searchBar_PLU = document.getElementById("searchBar_PLU");
const searchBar_NAME = document.getElementById("searchBar_NAME");
let Items = [];


async function makeApiCall() {
      let params = {
        // The spreadsheet to request.
        spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',  // TODO: Update placeholder value.

        // The ranges to retrieve from the spreadsheet.
          range: 'A2:B3758',  // TODO: Update placeholder value. 'A2:B3758' real range

        // True if grid data should be returned.
        // This parameter is ignored if a field mask was set in the request.
        includeGridData: false  // TODO: Update placeholder value.
      };

        let request = gapi.client.sheets.spreadsheets.values.get(params)
        request.then(function(response) {
        // TODO: Change code below to process the `response` object:
            Items = response.result.values; //This variable stores the JSON
            displayItems(Items);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
    }

    function initClient() {
      var API_KEY = 'AIzaSyAsP0ndw71kxf6olT7Pc-UVJv11MR8t6pc';  // TODO: Update placeholder with desired API key.

      var CLIENT_ID = '392467592952-o5rb6rt619tu3nab74mij029kca7t7pn.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.

      // TODO: Authorize using one of the following scopes:
      //   'https://www.googleapis.com/auth/drive'
      //   'https://www.googleapis.com/auth/drive.file'
      //   'https://www.googleapis.com/auth/drive.readonly'
      //   'https://www.googleapis.com/auth/spreadsheets'
      //   'https://www.googleapis.com/auth/spreadsheets.readonly'
      var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

      gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      }).then(async function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }

    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    function updateSignInStatus(isSignedIn) {
        makeApiCall();
    }



//====================================================================================================



searchBar_PLU.addEventListener("keyup", (e) => {
    displayItems(Items);
    const searchString = e.target.value.toLowerCase();

    const filtereditems = Items.filter((item) => {
        return item[0].includes(searchString);
    });
    displayItems(filtereditems);
});

searchBar_NAME.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();

    const filtereditems = Items.filter((item) => {
        return item[1].toLowerCase().includes(searchString);
    });
    displayItems(filtereditems);
});

const displayItems = (items) => {
    const htmlString = items
        .map((item) => {
            return `
            <li class="item">
                <h2>${item[0]}</h2>
                <p>${item[1]}</p>
            </li>
        `;
        })
        .join("");
    itemsList.innerHTML = htmlString;
};
