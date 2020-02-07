import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import useEventListener from '../eventListener/eventListener.js';
import { checkInput } from '../../helpers/utils';
import { Wrapper, Span } from './styles.js';
import { Button, TextInput } from '../styles.js';

function updateRoom(props, value, force=false) {
    props.dispatch({ type: 'LOGIN_UPDATE_ROOM', login_room:value, login_force:force });
}

function backToName(props) {
    props.dispatch({ type: 'LOGIN_UPDATE_NAME', login_name:'' });
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
            props.dispatch({ type: 'LOGIN_SET_ROOM' });
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

            { props.active_rooms.map((value, index) => {
                return <Span key={ index } onClick={ () => roomSetting({ props, event:{target:{value:value}}, force:true }) } >{ value }</Span>
            }) }

            <Button onClick={ () => roomSetting({props, force:true}) }>Validate Room</Button>

            <Button onClick={ () => backToName(props) }>Return</Button>
        </Wrapper>
    );
}

function mapStateToProps(state) {
    return {
        room            : state.login.room,
        active_rooms    : state.login.active_rooms
    };
}

export default connect(mapStateToProps)(Room);