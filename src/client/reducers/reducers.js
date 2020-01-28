import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import player from './player';
import login from './login';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    player,
    login
});

export default createRootReducer;