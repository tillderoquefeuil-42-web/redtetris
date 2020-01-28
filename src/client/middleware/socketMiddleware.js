import io from 'socket.io-client';

const rootURL = 'http://0.0.0.0:3004';
let socket = io(rootURL)

export const socketMiddleware = store => next => action => {

    // console.log(action);

    switch (action.type){
        case 'UPDATE_BOARD':
            socketEmission(action.type, action.board);
            break;
        case 'LINES_REMOVED':
            socketEmission(action.type);
            break;
        case 'GET_NEXT_PIECES':
            socketEmission(action.type);
            break;
    }

    return next(action);
}

const socketEmission = (type, data) => {
    socket.emit(type, data);
};