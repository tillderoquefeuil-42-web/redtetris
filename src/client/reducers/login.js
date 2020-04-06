import ActionTypes from '../constants/ActionTypes';

const LOGIN_ACTIONS = ActionTypes.LOGIN;

const initialState = {
    id              : null, 
    name            : "",
    name_set        : false,
    room            : "",
    active_rooms    : [],
    room_set        : false,
    logged          : false,
    start           : false,
    owner           : false,
    viewer          : false,
};
  
export const getLoginStateCopy = (state) => {
    let data = {};
  
    for (let i in initialState){
        data[i] = state[i];
    }
  
    return data;
}


function getDefaultName() {
    return "player-" + randomize();
}

function getDefaultRoom() {
    return "room-" + randomize(3);
}

function randomize(length=5) {
    return (Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length));
}

const reducer = (state = initialState , action) => {

    let data = getLoginStateCopy(state);

    switch(action.type){
    // MANAGE ID
    case LOGIN_ACTIONS.GET_ID:
        data.id = action.player_id;
        return data;

    // MANAGE NAME
    case LOGIN_ACTIONS.UPDATE_NAME:
        data.name = action.login_name || (action.login_force? getDefaultName() : '');
        data.name_set = false;
        return data;
    case LOGIN_ACTIONS.SET_NAME:
        data.name_set = true;
        return data;
        
    // MANAGE ROOM
    case LOGIN_ACTIONS.UPDATE_ROOM:
        data.room = action.login_room || (action.login_force? getDefaultRoom() : '');
        data.room_set = false;
        data.start = false;
        return data;
    case LOGIN_ACTIONS.GET_ROOMS:
        data.active_rooms = action.rooms;
        return data;
    case LOGIN_ACTIONS.SET_ROOM:
        data.start = false;
        data.room_set = true;
        return data;
    case LOGIN_ACTIONS.RESET_ROOM:
        data.room = '';
        data.room_set = false;
        data.start = false;
        return data;

    // MANAGE URL LOGIN
    case LOGIN_ACTIONS.URL_LOGGING:
        data.name = action.data.name;
        data.room = action.data.room;
        data.name_set = true;
        data.room_set = true;
        data.logged = true;
        return data;

    // MANAGE ROOM OWNER
    case LOGIN_ACTIONS.NEW_OWNER:
    case LOGIN_ACTIONS.GET_ROOM_OWNER:
        data.owner = null;
        return data;
    case LOGIN_ACTIONS.GET_OWNER:
        data.owner = action.owner;
        if (action.started){
            data.viewer = true;
        }
        return data;

    // START
    case LOGIN_ACTIONS.START:
    case LOGIN_ACTIONS.GET_START:
        data.start = true;
        return data;
    case LOGIN_ACTIONS.RESTART:
    case LOGIN_ACTIONS.GET_RESTART:
        if (action.back_to_room){
        data.room = '';
        data.room_set = false;
        }

        data.start = false;
        data.viewer = false;
        return data;
    

    default:
        return state
    }
}

export default reducer;