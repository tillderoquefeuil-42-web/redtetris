import io from 'socket.io-client';

import { LOGIN_ACTIONS, getLoginStateCopy } from '../reducers/login';
import { BOARD_ACTIONS, getBoardStateCopy } from '../reducers/board';

const rootURL = 'http://0.0.0.0:3004';
let socket = io(rootURL)


const getAllStateCopy = (store) => {

    let data = {};

    let state = store.getState();

    data.board = getBoardStateCopy(state.board);
    data.login = getLoginStateCopy(state.login)

    return data;
}


export const socketMiddleware = store => next => action => {

    let data = getAllStateCopy(store);

    socket.off('ACTION').on('ACTION', store.dispatch);

    switch (action.type){
        case LOGIN_ACTIONS.UPDATE_NAME:
            if (action.login_force){
                data.login.name = action.login_name;
                socketEmission(action.type, data);
            }
            break;
        case LOGIN_ACTIONS.UPDATE_ROOM:
            if (action.login_force){
                data.login.room = action.login_room;
                socketEmission(action.type, data);
            }
            break;
        case LOGIN_ACTIONS.URL_LOGGING:
            data.login.name = action.data.name;
            data.login.room = action.data.room;
            socketEmission(action.type, data);
            break;
        case LOGIN_ACTIONS.START:
            socketEmission(action.type, data);
            break;
        case BOARD_ACTIONS.NEW_PIECES:
            socketEmission(action.type, data);
            break;
        // case BOARD_ACTIONS.DROP_PIECE:
        //     socketEmission(action.type, action.board);
        //     break;
    }

    return next(action);
}

const socketEmission = (type, data={}) => {
    socket.emit(type, data);
};