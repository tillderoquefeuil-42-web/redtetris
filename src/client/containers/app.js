import React from 'react'
import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { Container, Title } from './styles.js';
import Board from '../components/board/board';
import Login from '../components/login/login';
import Waiting from '../components/login/waiting';

import { parseHash, getHashFromProps } from '../helpers/utils';

function getRoute(props) {

  if (props.logged && props.start){
    return <Board />
  } else if (props.logged){
    return <Waiting />
  }

  return <Login />
}

const App = (props) => {

  let data = parseHash(props.hash);

  if (!props.logged && data.name && data.room){
    props.dispatch({ type: 'LOGIN_URL_LOGGING', data:data });
  }

  let hash = getHashFromProps(props);
  props.dispatch(push(hash));

  return (
    <Container>
      <Title>RedTetris</Title>

      { getRoute(props) }

    </Container>
  );
}

const mapStateToProps = state => ({
  name    : state.login.name,
  room    : state.login.room,
  logged  : state.login.logged,
  start   : state.login.start,
  hash    : state.router.location.hash,
});

export default connect(mapStateToProps)(App);