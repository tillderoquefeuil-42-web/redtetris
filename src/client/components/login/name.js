import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import useEventListener from '../eventListener/eventListener.js';

import { Wrapper, TextInput, Button } from './styles.js';


function updateName(props, value, force=false) {
    props.dispatch({ type: 'LOGIN_UPDATE_NAME', login_name:value, login_force:force });
}

const Name = (props) => {

    const setName = () => {
        updateName(props, props.name, true);
        props.setName();
    }

    const handleKeyPress = (event) => {
        if (event.code === 'Enter'){
            setName();
        }
    };

    const handler = useCallback(handleKeyPress, [props]);
    useEventListener('keydown', handler);

    return (
        <Wrapper>
            <TextInput
                autoFocus
                type="text"
                value={ props.name }
                placeholder="Your name"
                onChange={ event => updateName(props, event.target.value) }
            />
            <Button onClick={ setName }>Validate Name</Button>
        </Wrapper>
    );
}

function mapStateToProps(state) {
    return {
        name    : state.login.name
    };
}

export default connect(mapStateToProps)(Name);