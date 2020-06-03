/*= ===================================================================================================
								IMPORTS
====================================================================================================== */
const info = `<script
			src="https://apis.google.com/js/api.js"
			onload="handleClientLoad()"></script>`;
document.write(info);

import './main.scss';
import { router } from './router/index.routes';
import { funciones } from './controllers/funciones';
/*= ===================================================================================================
                                ELEMENTOS HTML
====================================================================================================== */
const search = document.getElementById('search'); //TODO: poner dentro de htmElements
const opcionesDeBusqueda = document.getElementById('opcionesDeBusqueda');
const addButton = document.getElementById('addButton');
const removeButton = document.getElementById('removeButton');
const cleanButton = document.getElementById('cleanButton');
const cleanSearchBar = document.getElementById('cleanSearchBar');
const signInButton = document.getElementById('signin-button');
const signOutButton = document.getElementById('signout-button');
const itemsList = document.getElementById('itemsList');
const cantidadIngresada = document.getElementById('cantidadIngresada');
const divProductoSeleccionado = document.getElementById('productoSeleccionado');
window.handleClientLoad = handleClientLoad;
window.seleccionarProducto = seleccionarProducto;

let usuarioEditor;

const htlmElements = {
	search: search,
	opcionesDeBusqueda: opcionesDeBusqueda,
	itemsList: itemsList,
	cantidadIngresada: cantidadIngresada,
	divProductoSeleccionado: divProductoSeleccionado
};

export { htlmElements };

/*= ===================================================================================================
                                        EVENTOS
====================================================================================================== */
$(document).ready(function () {
	$('select').formSelect();
});

$(document).ready(function () {
	$('.sidenav').sidenav();
});

$(document).ready(function () {
	$('.fixed-action-btn').floatingActionButton();
});

opcionesDeBusqueda.addEventListener('change', () => {
	funciones.filtroCambiado();
});

search.addEventListener('keyup', (e) => {
	funciones.filtrar(e);
});

addButton.addEventListener('click', () => {
	if (usuarioEditor !== undefined) {
		funciones.movimiento(funciones.hacerIngreso, usuarioEditor.Sf.Ut.Eu);
	} else {
		console.log('Primero debe iniciar sesión'); // TODO: convertir en ventana modal
	}
});

removeButton.addEventListener('click', () => {
	if (usuarioEditor !== undefined) {
		funciones.movimiento(funciones.hacerSalida, usuarioEditor.Sf.Ut.Eu);
	}else{
		console.log('Primero debe iniciar sesión'); // TODO: convertir en ventana modal
	}	
});

signInButton.addEventListener('click', () => {
	handleSignInClick();
});

signOutButton.addEventListener('click', () => {
	handleSignOutClick();
});

cleanButton.addEventListener('click', () => {
	funciones.limpiar();
});

cleanSearchBar.addEventListener('click', () => {
	if (search !== '') {
		funciones.limpiarBarraBusqueda();
		funciones.displayItems();
	}
});

/* router(window.location.hash); //TODO:
window.addEventListener('hashchange', () => {
	router(window.location.hash);
}); */

/*= ===================================================================================================
                            API
====================================================================================================== */
const initClient = () => {
	var API_KEY = 'AIzaSyAsP0ndw71kxf6olT7Pc-UVJv11MR8t6pc';

	var CLIENT_ID =
		'392467592952-o5rb6rt619tu3nab74mij029kca7t7pn.apps.googleusercontent.com';
	var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

	gapi.client
		.init({
			apiKey: API_KEY,
			clientId: CLIENT_ID,
			scope: SCOPE,
			discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
		})
		.then(function () {
			gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
			updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		});
};

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

const updateSignInStatus = (isSignedIn) => {
	if (isSignedIn) {
		funciones.read();
	}
};

const handleSignInClick = () => {
	usuarioEditor = gapi.auth2.getAuthInstance().signIn();
	//console.log(usuarioEditor);
};

/* function show(){
	console.log(usuarioEditor.Sf.Ut.Eu);
}
window.show = show; */

const handleSignOutClick = () => {
	gapi.auth2.getAuthInstance().signOut();
};

function seleccionarProducto(plu, nombre) {
	funciones.seleccionarProducto(plu, nombre);
}
