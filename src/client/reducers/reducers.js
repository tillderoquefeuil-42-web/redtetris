import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import player from './player';

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    player
});

export default createRootReducer;