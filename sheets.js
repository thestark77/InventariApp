const { google } = require('googleapis');
const keys = require('./keys.json');

const RangeProducts = 'B3:C3759';

//https://nodejs.org/es/
//https://developers.google.com/sheets/api/quickstart/nodejs
//console.developers.google.com

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key, 
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function (err,tokens) {
    if (err) {
        console.log(err);
        return;
    }
});

const gsapi = google.sheets({ version: 'v4', auth: client });

async function read(){
    const readOptions = { //Options needed only for READING
        spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM', 
        range: RangeProducts //RangeProducts
    };
    let data = await gsapi.spreadsheets.values.get(readOptions);
    let dataArray = data.data.values; //dataArray has all items on JSON

    console.log(dataArray); //TODO: Clean

    return dataArray;
}

async function update(action, data) {
    let params = {
        // The ID of the spreadsheet to update.
        spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',

        // The A1 notation of a range to search for a logical table of data.
        // Values will be appended after the last row of the table.
        range: action,

        // How the input data should be interpreted.
        valueInputOption: 'USER_ENTERED',

        // How the input data should be inserted.
        insertDataOption: 'INSERT_ROWS',

        //Data you want to add to the sheet
        resource: data
    };

    let valueRangeBody = data;

    let response = await (await gsapi.spreadsheets.values.append(params, valueRangeBody)).data;

    console.log(response); //TODO: Clean
    //return response;
}

exports.read = read;
exports.update = update;

read();
update('Entradas!B6', datos);
