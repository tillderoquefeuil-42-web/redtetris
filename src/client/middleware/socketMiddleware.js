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
        case LOGIN_ACTIONS.SET_NAME:
            socketEmission(action.type, data);
            break;
        case LOGIN_ACTIONS.SET_ROOM:
            socketEmission(action.type, data);
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
        case BOARD_ACTIONS.REMOVE_LINE:
            data.board.lines = action.lines;
            socketEmission(action.type, data);
            break;
        case BOARD_ACTIONS.UPDATE:
            data.board.score = action.score;
            data.board.blocks = action.blocks;
            data.board.game_over = action.over? true : false;
            socketEmission(action.type, data);
            break;
    }

    return next(action);
}

const socketEmission = (type, data={}) => {
    socket.emit(type, data);
};