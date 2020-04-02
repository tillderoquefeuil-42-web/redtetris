import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { Wrapper } from './styles.js';
import { Button } from '../styles.js';

import useEventListener from '../eventListener/eventListener.js';
import utils from '../board/utils.js';


function start(props) {
    props.dispatch({ type: 'LOGIN_START' });
}

function backToRoom(props) {
    props.dispatch({ type: 'LOGIN_RESET_ROOM' });
}

const WaitingPlayers = (props) => {

    let players = props.players;

    if (!players || !players.length){
        return null;
    }

    return (
        <div>
            <h4>Online players :</h4>
            <ul>
                { players.map((value, index) => {
                    return <li key={ index } >{ value.name }</li>
                }) }
            </ul>
            <br />
        </div>
    );
};

const Waiting = (props) => {

    const handleKeyPress = (event) => {
        if (event.code === 'Enter'){
            start(props);
        }
    };

    const handler = useCallback(handleKeyPress, [props]);
    useEventListener('keydown', handler);

    let players = utils.getOtherPlayers(props.players, props.login_id);

    return (
        <Wrapper>
            <h2>{ props.name } - { props.room }</h2>

            <WaitingPlayers players={ players } />

            {
                props.owner?
                <Button onClick={ () => start(props) }>Start</Button>
                :
                <span>Waiting for owner to start</span>
            }

            <Button onClick={ () => backToRoom(props) }>Return</Button>
        </Wrapper>
    );
};


function mapStateToProps(state) {
    return {
        name        : state.login.name,
        room        : state.login.room,
        login_id    : state.login.id,
        owner       : state.login.owner,
        players     : state.board.players
    };
}

export default connect(mapStateToProps)(Waiting);