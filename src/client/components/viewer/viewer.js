import React from 'react';
import { connect } from 'react-redux';

import { Container } from './styles.js';

import Previews from '../preview/preview.js';

const Viewer = (props) => {
    return (
        <Container>
            <Previews />
        </Container>
    );
};

function mapStateToProps(state) {
    return {
        // pieces      : state.board.pieces,
        // players     : state.board.players,
        // over_line   : state.board.over_line,
        // blocks      : state.board.blocks,
        // score       : state.board.score,
        // game_over   : state.board.game_over,
        name        : state.login.name
    };
};

export default connect(mapStateToProps)(Viewer);