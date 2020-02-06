import React, { useState } from 'react';
import { connect } from 'react-redux';

import Name from './Name.js';
import Room from './Room.js';
import Waiting from './Waiting.js';

import { Container } from './styles.js';

function getLoginComponent(props) {

    if (props.name_set && props.room_set){
        return <Waiting />;
    } else if (props.name_set){
        return <Room />
    }

    return <Name />;
}

const Login = (props) => {

    return (
        <Container>
            { getLoginComponent(props) }
        </Container>
    );
};


function mapStateToProps(state) {
    return {
        name_set    : state.login.name_set,
        room_set    : state.login.room_set
    };
}

export default connect(mapStateToProps)(Login);