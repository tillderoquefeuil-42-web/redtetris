import React from 'react'

import { Container, Title } from './styles.js';
import Board from '../components/board/board'

const App = () => {
  return (
    <Container>
      <Title>RedTetris</Title>
      <Board />
    </Container>
  )
}

export default App