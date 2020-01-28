import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import useEventListener from '../eventListener/eventListener.js';
import { checkInput } from '../../helpers/utils';
import { Wrapper, TextInput, Button } from './styles.js';


function updateRoom(props, value, force=false) {
    props.dispatch({ type: 'LOGIN_UPDATE_ROOM', login_room:value, login_force:force });
}

function roomSetting({ props, event, force }){
    let value;

    if (event){
        value = event.target.value;
    } else {
        value = props.room;
    }

    if ((value && checkInput(value)) || !value){
        updateRoom(props, value, force);
        if (force){
            props.setRoom();
        }
    }
}

const Room = (props) => {

    const handleKeyPress = (event) => {
        if (event.code === 'Enter'){
            roomSetting({props, force:true});
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
                onChange={ event => roomSetting({props, event}) }
            />
            <Button onClick={ () => roomSetting({props, force:true}) }>Validate Room</Button>
        </Wrapper>
    );
}

function mapStateToProps(state) {
    return {
        room    : state.login.room
    };
}

export default connect(mapStateToProps)(Room);