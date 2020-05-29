/*====================================================================================================
                                CONSTANTES HTML
======================================================================================================*/
const itemsList = document.getElementById("itemsList");
const searchBar = document.getElementById("searchBar");
const cantidadIngresada = document.getElementById("cantidadIngresada");
const divProductoSeleccionado = document.getElementById("productoSeleccionado");
const opcionesDeBusqueda = document.getElementById("opcionesDeBusqueda");
const addButton = document.getElementById("addButton");
const removeButton = document.getElementById("removeButton");
const cleanButton = document.getElementById("cleanButton");
const cleanSearchBar = document.getElementById("cleanSearchBar");

/*====================================================================================================
                              CONSTANTES DE LA APP
======================================================================================================*/
const limiteItemsEnPantalla = 30;
const rangoHojaProductos = 'B3:C3759';
const hacerIngreso = 'Entradas!B6';
const hacerSalida = 'Salidas!B6';

let usuarioEditor = "Username"; //TODO: asignar campo de texto importado desde el log in... cuando lo haga :v ¿Constante o variable?... creo que constante
let Items = [];
let productoSeleccionado = null;


async function readApiCall() {
  let params = {
    // The spreadsheet to request.
    spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',

    // The ranges to retrieve from the spreadsheet.
    range: rangoHojaProductos,  //'A2:B3758' real range

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
    console.log(response.result); //TODO: Mensaje de "producto ingresado" en una ventana modal
  }, function (reason) {
      console.error('error: ' + reason.result.error.message); //TODO: Mensaje de error en una ventana modal
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

/*====================================================================================================
                                FUNCIONES DE GESTIÓN DE PRODUCTOS
======================================================================================================*/

function movimiento(tipo) {  //TODO: crear comprobación para verificar que exista un producto seleccionado y sino que saque una ventana emergente 
  cantidadArticulo = cantidadDigitada();
  if (cantidadArticulo != "" && productoSeleccionado != null) {
    let hora = Date();
    let datos = {
      "values": [
        [
          usuarioEditor,
          productoSeleccionado[0],
          productoSeleccionado[1],
          cantidadArticulo,
          hora
        ]
      ]
    };
    updateApiCall(tipo, datos);
    limpiar();
  } else { //TODO: Si no se ha seleccionado el producto o no se ha ingresado la cantidad, resaltar el cuadro respectivo
    if (productoSeleccionado == null && cantidadArticulo == ""){
      console.log("Seleccione un producto y digite la cantidad");
    } else if (productoSeleccionado == null){
      console.log("Seleccione un producto");
    } else if (cantidadArticulo == "") {
      console.log("Digite la cantidad");
    }else{
      console.log("Error desconocido");
    }
  }
}

function seleccionarProducto(plu, nombre) {
  const productoClicado = document.getElementById(plu);

  if (productoSeleccionado != null) {
    if (productoSeleccionado[0] != plu) {
      const itemAnteriorSeleccionado = document.getElementById(productoSeleccionado[0]);
      if (itemAnteriorSeleccionado != null) {
        itemAnteriorSeleccionado.className = "item";
      }
      productoClicado.className = "itemSeleccionado";
      productoSeleccionado = [plu, nombre];
      actualizarSeleccionado([plu, nombre]);
      limpiarCantidadDigitada();
    }
  } else {
    productoClicado.className = "itemSeleccionado";
    productoSeleccionado = [plu, nombre];
    actualizarSeleccionado([plu, nombre]);
    limpiarCantidadDigitada();
  }
}

function actualizarSeleccionado(producto) {
  const htmlString = `
    <div class="primerItem">
      <h2>
        ${producto[0]}
      </h2>
      <p>
        ${producto[1]}
      </p>
    </div>
  `;
  divProductoSeleccionado.innerHTML = htmlString;
}

function limpiar() {
  limpiarCantidadDigitada();

  if (productoSeleccionado != null) {
    const producto = document.getElementById(productoSeleccionado[0]);
    if (producto != null) {
      producto.className = "item";
    }
  }

  productoSeleccionado = null;

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

function cantidadDigitada(){
  return cantidadIngresada.value; //TODO:
}

function limpiarCantidadDigitada(){
  cantidadIngresada.value = "";
}

function limpiarBarraBusqueda(){
  searchBar.value = "";
}

/*====================================================================================================
                                    FUNCIONES DE BUSCADOR
======================================================================================================*/

function buscar(texto) {
  let buscarPor = criterioDeBusqueda();
  let itemsFiltrados;
  let textoABuscar;

  if (texto == undefined) {
    textoABuscar = searchBar.value;
  } else {
    textoABuscar = texto;
  }

  if (buscarPor == "nombre") {
    itemsFiltrados = Items.filter((item) => {
      return item[1].toLowerCase().includes(textoABuscar);
    });
  } else {
    itemsFiltrados = Items.filter((item) => {
      return item[0].includes(textoABuscar);
    });
  }
  displayItems(itemsFiltrados);
}

function filtrar(e) {
  displayItems(Items);
  textoABuscar = e.target.value.toLowerCase();
  buscar(textoABuscar);
}

function criterioDeBusqueda(){
  const opcionesDeBusqueda = document.getElementById("opcionesDeBusqueda").value;
  return opcionesDeBusqueda;
}

function filtroCambiado() {
  if (searchBar.value != ""){
    buscar();
  }
}

const displayItems = (items) => {

  if (items.length > limiteItemsEnPantalla) {
    const firstItems = items.slice(0, limiteItemsEnPantalla);
    
    const htmlString = firstItems
      .map((item) => {
        return `
            <li id="${ item[0]}" class="item" onclick="seleccionarProducto('${item[0]}', '${item[1]}')">
                <h2>${ item[0] }</h2>
                <p>${ item[1] }</p>
            </li>
        `;
      })
      .join("");
    itemsList.innerHTML = htmlString;
  } else {
    const htmlString = items
      .map((item) => {
        return `
            <li id="${ item[0]}" class="item" onclick="seleccionarProducto('${item[0]}', '${item[1]}')">
                <h2>${ item[0]}</h2>
                <p>${ item[1]}</p>
            </li>
        `;
      })
      .join("");
    itemsList.innerHTML = htmlString;
  }
  
  if(productoSeleccionado != null){
    const selectedItem = document.getElementById(productoSeleccionado[0]);

    if (selectedItem != null) {
      selectedItem.className = "itemSeleccionado";
    }
  }
};

/*====================================================================================================
                                        EVENTOS
======================================================================================================*/

opcionesDeBusqueda.addEventListener("change", (e) => {
  filtroCambiado();
});

searchBar.addEventListener("keyup", (e) => {
  filtrar(e);
});

addButton.addEventListener("click", (e) => {
  movimiento(hacerIngreso);
})

removeButton.addEventListener("click", (e) => {
  movimiento(hacerSalida)
})

cleanButton.addEventListener("click", (e) => {
  limpiar();
})

cleanSearchBar.addEventListener("click", (e) => {
  if (searchBar != ""){
    limpiarBarraBusqueda();
    displayItems(Items);
  }
})
