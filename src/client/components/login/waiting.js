import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { Wrapper } from './styles.js';
import { Button } from '../styles.js';

import useEventListener from '../eventListener/eventListener.js';


function start(props) {
    props.dispatch({ type: 'LOGIN_START' });
}

function backToRoom(props) {
    props.dispatch({ type: 'LOGIN_UPDATE_ROOM', login_room:'' });
}


const Waiting = (props) => {

    const handleKeyPress = (event) => {
        if (event.code === 'Enter'){
            start(props);
        }
    };

    const handler = useCallback(handleKeyPress, [props]);
    useEventListener('keydown', handler);

    return (
        <Wrapper>
            <h2>{ props.name }</h2>
            <h2>{ props.room }</h2>
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
        name    : state.login.name,
        room    : state.login.room,
        owner   : state.login.owner
    };
}

export default connect(mapStateToProps)(Waiting);