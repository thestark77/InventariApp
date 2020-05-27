const itemsList = document.getElementById("itemsList");
const searchBar = document.getElementById("searchBar");
const cantidadIngresada = document.getElementById("cantidadIngresada");
const divProductoSeleccionado = document.getElementById("productoSeleccionado");
const opcionesDeBusqueda = document.getElementById("opcionesDeBusqueda");

const limiteItemsEnPantalla = 30;
const hacerIngreso = 'Entradas!A2';
const hacerSalida = 'Salidas!A2';

let Items = [];
let filtereditems;
let searchString;
let producto_seleccionado = null;
let cantidadArticulo = 666; //TODO: asignar campo de texto 
let usuarioEditor = "Username"; //TODO: asignar campo de texto

async function readApiCall() {
  let params = {
    // The spreadsheet to request.
    spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',

    // The ranges to retrieve from the spreadsheet.
    range: 'A2:B3758',  //'A2:B3758' real range

    // True if grid data should be returned.
    // This parameter is ignored if a field mask was set in the request.
    includeGridData: false  // TODO: Update placeholder value.
  };

  let request = gapi.client.sheets.spreadsheets.values.get(params)
  request.then(function (response) {
    Items = response.result.values; //This variable stores the JSON
    displayItems(Items); //Start
  }, function (reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function updateApiCall(accion, datos) {
  let params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: accion,

    // How the input data should be interpreted.
    valueInputOption: 'USER_ENTERED',

    // How the input data should be inserted.
    insertDataOption: 'INSERT_ROWS',
  };

  let valueRangeBody = datos;

  let request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  request.then(function (response) {
    //console.log(response.result);
  }, function (reason) {
    console.error('error: ' + reason.result.error.message);
  });
}

function initClient() {
  let API_KEY = 'AIzaSyAsP0ndw71kxf6olT7Pc-UVJv11MR8t6pc';

  let CLIENT_ID = '392467592952-o5rb6rt619tu3nab74mij029kca7t7pn.apps.googleusercontent.com';

  // Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  let SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(async function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
  readApiCall();
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function ingreso() {  //TODO: crear comprobación para verificar que exista un producto seleccionado y sino que saque una ventana emergente 
  cantidadArticulo = cantidadIngresada.value;
  if (cantidadArticulo > 0 && producto_seleccionado != null){
    let hora = new Date();
    let datos = {
      "values": [
        [
          usuarioEditor,
          producto_seleccionado[0],
          producto_seleccionado[1],
          cantidadArticulo,
          hora
        ]
      ]
    };
    updateApiCall(hacerIngreso, datos);
  } else { //TODO: Condicional para que cantidadArticulo sea mayor que 0
    console.log(cantidadArticulo);
    console.log(producto_seleccionado);
  }
}

function salida() {  //TODO: crear comprobación para verificar que exista un producto seleccionado y sino que saque una ventana emergente 
  cantidadArticulo = cantidadIngresada.value;
  if (cantidadArticulo > 0 && producto_seleccionado != null) {
    let hora = new Date();
    let datos = {
      "values": [
        [
          usuarioEditor,
          producto_seleccionado[0],
          producto_seleccionado[1],
          cantidadArticulo,
          hora
        ]
      ]
    };
    updateApiCall(hacerSalida, datos);
  } else { //TODO: Condicional para que cantidadArticulo sea mayor que 0
    console.log(cantidadArticulo);
    console.log(producto_seleccionado);
  }
}

function movimiento(tipo) {  //TODO: crear comprobación para verificar que exista un producto seleccionado y sino que saque una ventana emergente 
  cantidadArticulo = cantidadIngresada.value;
  if (cantidadArticulo > 0 && producto_seleccionado != null) {
    let hora = new Date();
    let datos = {
      "values": [
        [
          usuarioEditor,
          producto_seleccionado[0],
          producto_seleccionado[1],
          cantidadArticulo,
          hora
        ]
      ]
    };
    updateApiCall(tipo, datos);
  } else { //TODO: Condicional para que cantidadArticulo sea mayor que 0
    console.log(cantidadArticulo);
    console.log(producto_seleccionado);
  }
}



//====================================================================================================



function seleccionarProducto(plu, nombre) {
  producto_seleccionado = [plu, nombre];
  cantidadArticulo = 0;
  cantidadIngresada.value = "";
  actualizarSeleccionado();
}

function actualizarSeleccionado(){
  const htmlString = `
    <div class="item">
      <h2 class="no-seleccionable">
        ${producto_seleccionado[0]}
      </h2>
      <p>
        ${producto_seleccionado[1]}
      </p>
    </div>
  `;
  divProductoSeleccionado.innerHTML = htmlString;
}

function limpiar(){
  producto_seleccionado = null;
  cantidadArticulo = 0;
  cantidadIngresada.value = "";
  const htmlString = `
    <div class="item">
      <h2 class="no-seleccionable" style="opacity:0;">
        .
      </h2>
      <p class="no-seleccionable" style="opacity:0;">
        .
      </p>
    </div>
  `;
  divProductoSeleccionado.innerHTML = htmlString;
}

function criterioDeBusqueda(){
  const opcionesDeBusqueda = document.getElementById("opcionesDeBusqueda").value;
  return opcionesDeBusqueda;
}

function filtrar (e){
  displayItems(Items);
  let buscarPor = criterioDeBusqueda();
  searchString = e.target.value.toLowerCase();
  

  if (buscarPor == "nombre") {
    filtereditems = Items.filter((item) => {
      return item[1].toLowerCase().includes(searchString);
    });
  } else {
    filtereditems = Items.filter((item) => {
      return item[0].includes(searchString);
    });
  }
  displayItems(filtereditems);
}

function filterOptionChanged() {
  if (searchBar.value != ""){
    let buscarPor = criterioDeBusqueda();
    if (buscarPor == "nombre") {
      filtereditems = Items.filter((item) => {
        return item[1].toLowerCase().includes(searchString);
      });
    } else {
      filtereditems = Items.filter((item) => {
        return item[0].includes(searchString);
      });
    }
    displayItems(filtereditems);
  }
}

opcionesDeBusqueda.addEventListener("change", (e) => {
  filterOptionChanged();
});

searchBar.addEventListener("keyup", (e) => {
  filtrar(e);
});

const displayItems = (items) => {
  if (items.length > limiteItemsEnPantalla){
    const firstItems = items.slice(0, limiteItemsEnPantalla);

    const htmlString = firstItems
      .map((item) => {
        return `
            <li class="item" onclick="seleccionarProducto('${item[0]}', '${item[1]}')">
                <h2>${ item[0]}</h2>
                <p>${ item[1]}</p>
            </li>
        `;
      })
      .join("");
    itemsList.innerHTML = htmlString;
  } else{
    const htmlString = items
      .map((item) => {
        return `
            <li class="item" onclick="seleccionarProducto('${item[0]}', '${item[1]}')">
                <h2>${ item[0]}</h2>
                <p>${ item[1]}</p>
            </li>
        `;
      })
      .join("");
    itemsList.innerHTML = htmlString;
  }
};
