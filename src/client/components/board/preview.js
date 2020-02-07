import React from 'react';
import { connect } from 'react-redux';

import GameOver from './gameOver.js';
import { PreviewWrapper, PreviewScore, PreviewName } from './styles.js';
import utils from './utils.js';

const Previews = (props) => {

    if (!props.players || props.players.length === 1 || !props.name){
        return null;
    }

    let players = utils.getOtherPlayers(props.players, props.name);

    let previews = [];
    for (let i in players){
        previews.push(<Preview player={ players[i] } />)
    }

    return (
        <div>
            { previews }
        </div>
    );
};

const Preview = (props) => {

    let blocks = utils.unparseBlocks(props.player.blocks);

    return (
        <PreviewWrapper>
            <PreviewName>{ props.player.name }</PreviewName>
            { utils.blocksToPreview(blocks) }
            <GameOver over={ props.player.over } preview={ true } />
            <PreviewScore>{ props.player.score }</PreviewScore>
        </PreviewWrapper>
    );
};


function mapStateToProps(state) {
    return {
        players     : state.board.players,
        name        : state.login.name
    };
}

export default connect(mapStateToProps)(Previews);