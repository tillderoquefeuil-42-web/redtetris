import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import * as loginActions from '../../actions/login';

import useEventListener from '../eventListener/eventListener.js';
import { checkInput } from '../../helpers/utils';
import { Wrapper } from './styles.js';
import { Button, TextInput } from '../styles.js';

function updateName(props, value, force=false) {
    props.dispatch(loginActions.updateName(value, force));
}

function nameSetting({ props, event, force }){
    let value;

    if (event){
        value = event.target.value;
    } else {
        value = props.name;
    }

    if ((value && checkInput(value)) || !value){
        updateName(props, value, force);
        if (force){
            props.dispatch(loginActions.setName());
        }
    }
}


const Name = (props) => {

    const handleKeyPress = (event) => {
        if (event.code === 'Enter'){
            nameSetting({props, force:true});
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
                onChange={ event => nameSetting({props, event}) }
            />
            <Button onClick={ () => nameSetting({props, force:true}) }>Validate Name</Button>
        </Wrapper>
    );
}

function mapStateToProps(state) {
    return {
        name    : state.login.name
    };
}

export default connect(mapStateToProps)(Name);