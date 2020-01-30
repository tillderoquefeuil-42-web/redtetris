export const LOGIN_ACTIONS = {
  UPDATE_NAME   : 'LOGIN_UPDATE_NAME',
  UPDATE_ROOM   : 'LOGIN_UPDATE_ROOM',
  PLAYER_LOGGED : 'LOGIN_PLAYER_LOGGED',
  URL_LOGGING   : 'LOGIN_URL_LOGGING',
  START         : 'LOGIN_START'
};

const initialState = {
  name    : "",
  room    : "",
  logged  : false,
  start   : false
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
    case LOGIN_ACTIONS.UPDATE_NAME:
      data.name = action.login_name || (action.login_force? getDefaultName() : '');
      return data;
    case LOGIN_ACTIONS.UPDATE_ROOM:
      data.room = action.login_room || (action.login_force? getDefaultRoom() : '');
      return data;
    case LOGIN_ACTIONS.PLAYER_LOGGED:
      data.logged = true;
      return data;
    case LOGIN_ACTIONS.START:
      data.start = true;
      return data;
    case LOGIN_ACTIONS.URL_LOGGING:
      data.name = action.data.name;
      data.room = action.data.room;
      data.logged = true;
      return data;
    default:
      return state
  }
}

export default reducer;