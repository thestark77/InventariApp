const { google } = require('googleapis');
const keys = require('./keys.json');
const sheets = google.sheets('v4');

const rangoHojaProductos = 'B3:C3759';
const hacerIngreso = 'Entradas!B6';
const hacerSalida = 'Salidas!B6';

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
    } else {
        console.log("Connected");
        //gsrun(client); //TODO: Clean
    }
});

const gsapi = google.sheets({ version: 'v4', auth: client });

async function gsrun(_client){
    //gsapi = google.sheets({ version: 'v4', auth: _client });
    
    /* const readOptions = { //Options needed only for READING
        spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM', //10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM
        range: 'B3:C7' //rangoHojaProductos
    }; */

    //let data = await gsapi.spreadsheets.values.get(readOptions);
    //let dataArray = data.data.values; //dataArray has all items on JSON

    /* dataArray = dataArray.map(function(row){ //This function ensures that blank cells are filled by an empty string because Google does not do this ¬¬!
        while(row.length < 2){
            row.push('');
        }
        return row;
    }); */
    //console.log(dataArray); //Shows the data on console

    /* let newDataArray = dataArray.map(function(row){ //little example
        row.push(row[0] + '-' + row[1]);
        return row;
    });
    console.log(newDataArray); */

    /* const updateOptions = { //Options needed for UPDATING
        spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',
        range: hacerIngreso,
        valueInputOption: 'USER_ENTERED',
        resource: { values: dataArray} //This information will be written on the Google sheet
    }; */

    //let response = await gsapi.spreadsheets.values.update(updateOptions);

    //console.log(response);
}

async function read(){
    const readOptions = { //Options needed only for READING
        spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM', //10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM
        range: 'B3:C7' //rangoHojaProductos
    };
    let data = await gsapi.spreadsheets.values.get(readOptions);
    let dataArray = data.data.values; //dataArray has all items on JSON

    //console.log(dataArray); //TODO: Clean

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

        resource: {
            "values": [
                [
                    "usuarioEditor",
                    "producto_seleccionado[0]",
                    "producto_seleccionado[1]",
                    "cantidadArticulo",
                    "hora"
                ]
            ]
        }
    };

    let valueRangeBody = data;

    let response = await (await gsapi.spreadsheets.values.append(params, valueRangeBody)).data;

    console.log(response); //TODO: Clean
    //return response;
}

exports.read = read;
exports.update = update;

let datos = {
    "values": [
        [
            "usuarioEditor",
            "producto_seleccionado[0]",
            "producto_seleccionado[1]",
            "cantidadArticulo",
            "hora"
        ]
    ]
};

read();
update(hacerIngreso, datos);
