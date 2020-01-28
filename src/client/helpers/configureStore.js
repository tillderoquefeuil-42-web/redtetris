import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';

import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

import createRootReducer from '../reducers/reducers';
import { storeStateMiddleWare } from '../middleware/storeStateMiddleWare';
import { socketMiddleware } from '../middleware/socketMiddleware';

export const history = createBrowserHistory();

export default function configureStore(preloadedState) {
    const store = createStore(
        createRootReducer(history),
        preloadedState,
        compose(
            applyMiddleware(
                routerMiddleware(history),
                thunk, 
                storeStateMiddleWare, 
                createLogger(), 
                socketMiddleware
            ),
        ),
    );

    return store;
};