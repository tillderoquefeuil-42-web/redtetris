import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import board from './board';
import login from './login';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    board,
    login
});

export default createRootReducer;