import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import * as loginActions from '../../actions/login';
import * as boardActions from '../../actions/board';

import { Wrapper } from './styles.js';
import { Button } from '../styles.js';

import useEventListener from '../eventListener/eventListener.js';
import utils from '../board/utils.js';


function start(props) {
    props.dispatch(loginActions.start());
}

function backToRoom(props) {
    props.dispatch(loginActions.resetRoom());
}

function optionsChanged(props, e) {
    props.dispatch(boardActions.setHardmode(e.target.checked));
}

const Options = (props) => {

    if (!props.owner){
        return (<span>Current mode - { props.hardmode? 'hard' : 'soft' }</span>);
    }

    return (
        <div>
            <input type="checkbox" checked={ props.hardmode } onChange={ (e) => props.onChange(e) } />
            <span>hardmode</span>
        </div>
    );
};

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

const Start = (props) => {

    if (!props.owner){
        return (<span>Waiting for owner to start</span>);
    }

    return (<Button onClick={ () => props.start() }>Start</Button>);
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

            <Start owner={ props.owner } start={ () => start(props) } />

            <Options owner={ props.owner } hardmode={ props.hardmode } onChange={ (e) => optionsChanged(props, e) } />

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
        hardmode    : state.board.hardmode,
        players     : state.board.players
    };
}

export default connect(mapStateToProps)(Waiting);