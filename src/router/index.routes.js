import {pages} from '../controllers/index';

let container = document.getElementById('container');

const router = (route) => {
    container.innerHTML = '';
switch (route) {
	case '': {
        return container.appendChild(pages.home());
    }
		break;
	case '#/entradas':
		return console.log('Entradas!!');
		break;
	case '#/salidas':
		return console.log('Salidas!!');
		break;
	case '#/movimientos':
		return console.log('Movimientos!!');
		break;
}
};

export {router};