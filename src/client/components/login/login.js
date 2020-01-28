import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import Name from './Name.js';
import Room from './Room.js';
import { Container } from './styles.js';


function playerLogged(props) {
    props.dispatch({ type: 'LOGIN_PLAYER_LOGGED' });
}

const Login = (props) => {

    const [named, setNamed] = useState(false);

    return (
        <Container>
            { named? 
                <Room setRoom={ () => playerLogged(props) } /> 
                : 
                <Name setName={ () => setNamed(true) } /> 
            }
        </Container>
    );
};


function mapStateToProps(state) {
    return {
        name    : state.login.name,
        room    : state.login.room,
        logged  : state.login.logged
    };
}

export default connect(mapStateToProps)(Login);