import React from 'react'
import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { Container, Title } from './styles.js';
import Board from '../components/board/board';
import Login from '../components/login/login';

const App = (props) => {

  let hash = '/#' + (props.logged? `${props.room}[${props.name}]` : '');
  props.push(hash);

  return (
    <Container>
      <Title>RedTetris</Title>

      { props.logged ? 
        <Board />
        :
        <Login />
      }

    </Container>
  );
}

const mapStateToProps = state => ({
  name    : state.login.name,
  room    : state.login.room,
  logged  : state.login.logged,
})

export default connect(mapStateToProps, { push })(App);