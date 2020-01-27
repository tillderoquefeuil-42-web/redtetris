import React from 'react'
import { ConnectedRouter } from 'connected-react-router'

import { Container, Title } from './styles.js';
import routes from '../routes/routes';

const App = ({ history }) => {
  return (
    <Container>
      <Title>RedTetris</Title>
      <ConnectedRouter history={history}>
        { routes }
      </ConnectedRouter>
    </Container>
  );
}

export default App;