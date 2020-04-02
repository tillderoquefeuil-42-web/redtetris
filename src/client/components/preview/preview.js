import React from 'react';
import { connect } from 'react-redux';

import GameOver from '../board/gameOver.js';
import { PreviewsContainer, PreviewContainer, PreviewWrapper, PreviewScore, PreviewName } from '../board/styles.js';
import utils from '../board/utils.js';

const Previews = (props) => {

    if (!props.players || props.players.length === 1 || !props.name){
        return null;
    }

    let players = utils.getOtherPlayers(props.players, props.login_id);

    let previews = [];
    for (let i in players){
        previews.push(<Preview player={ players[i] } />)
    }

    return (
        <PreviewsContainer>
            { previews }
        </PreviewsContainer>
    );
};

const Preview = (props) => {

    if (!props.player.blocks){
        return null;
    }

    let blocks = utils.initPreview(props.player.blocks);

    return (
        <PreviewContainer>
            <PreviewName>{ props.player.name }</PreviewName>
            <PreviewWrapper>
                { utils.buildBoard(blocks, true) }
                <GameOver gameOver={ props.player.gameOver } preview={ true } />
                <PreviewScore>{ props.player.score }</PreviewScore>
            </PreviewWrapper>
        </PreviewContainer>
    );
};


function mapStateToProps(state) {
    return {
        players     : state.board.players,
        login_id    : state.login.id,
        name        : state.login.name
    };
}

export default connect(mapStateToProps)(Previews);