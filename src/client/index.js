import React from 'react';
import ReactDom from 'react-dom';

import { Provider } from 'react-redux';

import App from './containers/app';
import configureStore, { history } from './configureStore'

const store = configureStore();

ReactDom.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,

  document.getElementById('tetris')
);