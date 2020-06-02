import './main.scss';
import { router } from './router/index.routes';

$(document).ready(function () {
	$('select').formSelect();
});

$(document).ready(function () {
	$('.sidenav').sidenav();
});

$(document).ready(function () {
	$('.fixed-action-btn').floatingActionButton();
});

router(window.location.hash);
window.addEventListener('hashchange', () => {
	router(window.location.hash);
});

function readApiCall() {
	var params = {
		spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',
		range: 'B3:C7',
		valueRenderOption: 'FORMATTED_VALUE',
	};

	var request = gapi.client.sheets.spreadsheets.values.get(params);
	request.then(
		function (response) {
			// TODO: Change code below to process the `response` object:
			console.log(response.result);
		},
		function (reason) {
			console.error('error: ' + reason.result.error.message);
		}
	);
}

function updateApiCall() {
	var params = {
		spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',
		range: 'Entradas!B6',
		valueInputOption: 'USER_ENTERED',
		insertDataOption: 'INSERT_ROWS',
	};

	var valueRangeBody = {
		values: [
			[
				'usuarioEditor',
				'productoSeleccionado[0]',
				'productoSeleccionado[1]',
				'cantidadArticulo',
				'hora',
			],
		],
	};

	var request = gapi.client.sheets.spreadsheets.values.append(
		params,
		valueRangeBody
	);
	request.then(
		function (response) {
			// TODO: Change code below to process the `response` object:
			console.log(response.result);
		},
		function (reason) {
			console.error('error: ' + reason.result.error.message);
		}
	);
}

function initClient() {
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
}

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

window.handleClientLoad = handleClientLoad;

function updateSignInStatus(isSignedIn) {
	if (isSignedIn) {
		readApiCall();
	}
}

function handleSignInClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}
