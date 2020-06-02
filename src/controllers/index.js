import Home from './home.controller';
import Entradas from './entradas.controller';
import Salidas from './salidas.controller';
import Movimientos from './movimientos.controller';
import NotFound from './notFound.controller';

const pages = {
    home: Home,
    entradas: Entradas,
    salidas: Salidas,
    movimientos: Movimientos,
    notFound: NotFound
}

export {pages};