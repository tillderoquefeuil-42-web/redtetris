import React from 'react';

import { BoardCover, GameOverSpan } from './styles.js';

const GameOver = (props) => {
    return (
        <BoardCover gameOver={ props.gameOver }>
            <GameOverSpan preview={ props.preview } >Game</GameOverSpan>
            <GameOverSpan preview={ props.preview } >Over</GameOverSpan>
        </BoardCover>
    );
}

export default GameOver;