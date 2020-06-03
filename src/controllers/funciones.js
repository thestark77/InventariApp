import { htlmElements } from '../main';

/*= ===================================================================================================
                            CONSTANTES DE LA APP
====================================================================================================== */
const limiteItemsEnPantalla = 30;
const rangoHojaProductos = 'B3:C3759';
const hacerIngreso = 'Entradas!B6';
const hacerSalida = 'Salidas!B6';
let usuarioEditor; // TODO: asignar campo de texto importado desde el log in... cuando lo haga :v ¿Constante o variable?... creo que constante

let Items;
let productoSeleccionado = null;

/*= ===================================================================================================
                            FUNCIONES API
====================================================================================================== */
const readApiCall = () => {
	var params = {
		spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',
		range: funciones.rangoHojaProductos,
		valueRenderOption: 'FORMATTED_VALUE',
	};

	var request = gapi.client.sheets.spreadsheets.values.get(params);
	request.then(
		function (response) {
			// TODO: Change code below to process the `response` object:
			Items = response.result.values; // This variable stores the JSON
			displayItems(); // Start
		},
		function (reason) {
			console.error('error: ' + reason.result.error.message);
		}
	);
};

const updateApiCall = (accion, datos) => {
	var params = {
		spreadsheetId: '10jQrnFy8W7FkIpM1AGGsRTqRfC7odE_9xI8bmwpeRKM',
		range: accion,
		valueInputOption: 'USER_ENTERED',
		insertDataOption: 'INSERT_ROWS',
	};

	var valueRangeBody = datos;

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
};

/*= ===================================================================================================
                                FUNCIONES DE GESTIÓN DE PRODUCTOS
====================================================================================================== */
const movimiento = (tipo, usuario) => {
	// TODO: crear comprobación para verificar que exista un producto seleccionado y sino que saque una ventana emergente
	const cantidadArticulo = cantidadDigitada();
	if (cantidadArticulo !== '' && productoSeleccionado != null) {
		const hora = Date();
		const datos = {
			values: [
				[
					usuario,
					productoSeleccionado[0],
					productoSeleccionado[1],
					cantidadArticulo,
					hora,
				],
			],
		};
		updateApiCall(tipo, datos);
		limpiar();
	} else if (productoSeleccionado === null && cantidadArticulo === '') {
		// TODO: Si no se ha seleccionado el producto o no se ha ingresado la cantidad, resaltar el cuadro respectivo
		console.log('Seleccione un producto y digite la cantidad');
	} else if (productoSeleccionado == null) {
		console.log('Seleccione un producto');
	} else if (cantidadArticulo === '') {
		console.log('Digite la cantidad');
	} else {
		console.log('Error desconocido');
	}
};

const seleccionarProducto = (plu, nombre) => {
	const productoClicado = document.getElementById(plu);

	if (productoSeleccionado != null) {
		if (productoSeleccionado[0] !== plu) {
			const itemAnteriorSeleccionado = document.getElementById(
				productoSeleccionado[0]
			);
			if (itemAnteriorSeleccionado != null) {
				itemAnteriorSeleccionado.className = 'item';
			}
			productoClicado.className = 'itemSeleccionado';
			productoSeleccionado = [plu, nombre];
			actualizarSeleccionado([plu, nombre]);
			limpiarCantidadDigitada();
		}
	} else {
		productoClicado.className = 'itemSeleccionado';
		productoSeleccionado = [plu, nombre];
		actualizarSeleccionado([plu, nombre]);
		limpiarCantidadDigitada();
	}
};

const actualizarSeleccionado = (producto) => {
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
	htlmElements.divProductoSeleccionado.innerHTML = htmlString;
};

const limpiar = () => {
	limpiarCantidadDigitada();

	if (productoSeleccionado != null) {
		const producto = document.getElementById(productoSeleccionado[0]);
		if (producto != null) {
			producto.className = 'item';
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
    </div>`;
	htlmElements.divProductoSeleccionado.innerHTML = htmlString;
};

const cantidadDigitada = () => {
	return htlmElements.cantidadIngresada.value; // TODO:
};

const limpiarCantidadDigitada = () => {
	htlmElements.cantidadIngresada.value = '';
};

const limpiarBarraBusqueda = () => {
	htlmElements.search.value = '';
};

/*= ===================================================================================================
                                    FUNCIONES DE BUSCADOR
====================================================================================================== */

const buscar = (texto) => {
	const buscarPor = criterioDeBusqueda();
	let itemsFiltrados;
	let textoABuscar;

	if (texto === undefined) {
		textoABuscar = htlmElements.search.value;
	} else {
		textoABuscar = texto;
	}

	if (buscarPor === 'todo') {
		itemsFiltrados = Items.filter((item) => {
			return (
				item[0].includes(textoABuscar) ||
				item[1].toLowerCase().includes(textoABuscar)
			);
		});
	} else if (buscarPor === 'nombre') {
		itemsFiltrados = Items.filter((item) => {
			return item[1].toLowerCase().includes(textoABuscar);
		});
	} else if (buscarPor === 'plu') {
		itemsFiltrados = Items.filter((item) => {
			return item[0].includes(textoABuscar);
		});
	}
	displayItems(itemsFiltrados);
};

const filtrar = (e) => {
	displayItems();
	const textoABuscar = e.target.value.toLowerCase();
	buscar(textoABuscar);
};

const criterioDeBusqueda = () => {
	return htlmElements.opcionesDeBusqueda.value;
};

const filtroCambiado = () => {
	if (htlmElements.search.value !== '') {
		buscar();
	}
};

const displayItems = (items = Items) => {
	if (items.length > limiteItemsEnPantalla) {
		const firstItems = items.slice(0, limiteItemsEnPantalla);
		const htmlString = firstItems
			.map((item) => {
				return `
            <li id="${item[0]}" class="item" onclick="seleccionarProducto('${item[0]}', '${item[1]}')">
                <h2>${item[0]}</h2>
                <p>${item[1]}</p>
            </li>
        `;
			})
			.join('');
		htlmElements.itemsList.innerHTML = htmlString;
	} else {
		const htmlString = items
			.map((item) => {
				return `
            <li id="${item[0]}" class="item" onclick="seleccionarProducto('${item[0]}', '${item[1]}')">
                <h2>${item[0]}</h2>
                <p>${item[1]}</p>
            </li>
        `;
			})
			.join('');
		htlmElements.itemsList.innerHTML = htmlString;
	}

	if (productoSeleccionado != null) {
		const selectedItem = document.getElementById(productoSeleccionado[0]);

		if (selectedItem != null) {
			selectedItem.className = 'itemSeleccionado';
		}
	}
};

const funciones = {
	usuarioEditor: usuarioEditor,
	rangoHojaProductos: rangoHojaProductos,
	hacerIngreso: hacerIngreso,
	hacerSalida: hacerSalida,
	read: readApiCall,
	movimiento: movimiento,
	seleccionarProducto: seleccionarProducto,
	actualizarSeleccionado: actualizarSeleccionado,
	limpiar: limpiar,
	limpiarCantidadDigitada: limpiarCantidadDigitada,
	limpiarBarraBusqueda: limpiarBarraBusqueda,
	buscar: buscar,
	filtrar: filtrar,
	criterioDeBusqueda: criterioDeBusqueda,
	filtroCambiado: filtroCambiado,
	displayItems: displayItems,
};

export { funciones };
