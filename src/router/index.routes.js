const router = (route) => {
    switch(route){
        case '#/entradas':
            return console.log('Entradas!!!');
            break;
        case '#/salidas':
            return console.log('Salidas!!!');
            break;
        case '#/movimientos':
            return console.log('Movimientos!!!');
            break;
        default:
            return console.log('404!!!');
    }
}

export {router};