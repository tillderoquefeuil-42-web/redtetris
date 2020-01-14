import React from 'react';
import ReactDom from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'

import App from './containers/app';
import reducer from './reducers/reducer';

const initialState = {};
const store = createStore(
  reducer, 
  initialState, 
  applyMiddleware(thunk, createLogger())
);

ReactDom.render(
  <Provider store={store}>
    <App/>
  </Provider>
, document.getElementById('tetris'));