export const LOGIN_ACTIONS = {
  UPDATE_NAME   : 'LOGIN_UPDATE_NAME',
  UPDATE_ROOM   : 'LOGIN_UPDATE_ROOM',
  SET_NAME      : 'LOGIN_SET_NAME',
  SET_ROOM      : 'LOGIN_SET_ROOM',
  RESET_ROOM    : 'LOGIN_RESET_ROOM',
  URL_LOGGING   : 'LOGIN_URL_LOGGING',
  START         : 'LOGIN_START',
  GET_START     : 'LOGIN_GET_START',
  GET_ROOMS     : 'LOGIN_GET_ROOMS',
  GET_OWNER     : 'LOGIN_GET_OWNER'
};

const initialState = {
  name          : "",
  room          : "",
  name_set      : false,
  room_set      : false,
  logged        : false,
  start         : false,
  active_rooms  : [],
  owner         : false,
  viewer        : false,
  unique_id     : null
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

const getUniqueId = (state) => {
  return state.name + '_' + state.room + '_' + randomize();
}

const reducer = (state = initialState , action) => {

  let data = getLoginStateCopy(state);

  switch(action.type){
    // EDIT NAME | ROOM
    case LOGIN_ACTIONS.UPDATE_NAME:
      data.name = action.login_name || (action.login_force? getDefaultName() : '');
      data.name_set = false;
      return data;
    case LOGIN_ACTIONS.UPDATE_ROOM:
      data.room = action.login_room || (action.login_force? getDefaultRoom() : '');
      data.room_set = false;
      data.start = false;
      return data;
    // SET NAME | ROOM
    case LOGIN_ACTIONS.SET_NAME:
      data.name_set = true;
      return data;
    case LOGIN_ACTIONS.SET_ROOM:
      data.room_set = true;
      data.unique_id = getUniqueId(state);
      return data;
    //RESET ROOM
    case LOGIN_ACTIONS.RESET_ROOM:
      data.room = '';
      data.room_set = false;
      data.start = false;
      return data;

    case LOGIN_ACTIONS.START:
    case LOGIN_ACTIONS.GET_START:
      data.start = true;
      return data;
    case LOGIN_ACTIONS.URL_LOGGING:
      data.name = action.data.name;
      data.room = action.data.room;
      data.unique_id = getUniqueId(action.data);
      data.name_set = true;
      data.room_set = true;
      data.logged = true;
      return data;
    case LOGIN_ACTIONS.GET_ROOMS:
      data.active_rooms = action.rooms;
      return data;
    case LOGIN_ACTIONS.GET_OWNER:
      data.owner = action.owner;
      if (action.started){
        data.viewer = true;
      }
      return data;
    default:
      return state
  }
}

export default reducer;