import React from 'react';
import { Route, Switch } from 'react-router';

import Home from '../components/home/home';
import Board from '../components/board/board'

const routes = (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/board" component={Board} />
        <Route component={Home} />
    </Switch>
);

export default routes