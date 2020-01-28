import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import useEventListener from '../eventListener/eventListener.js';

import { Wrapper, TextInput, Button } from './styles.js';


function updateRoom(props, value, force=false) {
    props.dispatch({ type: 'LOGIN_UPDATE_ROOM', login_room:value, login_force:force });
}

const Room = (props) => {

    const setRoom = () => {
        updateRoom(props, props.room, true);
        props.setRoom();
    }

    const handleKeyPress = (event) => {
        if (event.code === 'Enter'){
            setRoom();
        }
    };

    const handler = useCallback(handleKeyPress, [props]);
    useEventListener('keydown', handler);

    return (
        <Wrapper>
            <TextInput
                autoFocus
                type="text"
                value={ props.room }
                placeholder="The room you wanna enter"
                onChange={ event => updateRoom(props, event.target.value) }
            />
            <Button onClick={ setRoom }>Validate Room</Button>
        </Wrapper>
    );
}

function mapStateToProps(state) {
    return {
        room    : state.login.room
    };
}

export default connect(mapStateToProps)(Room);