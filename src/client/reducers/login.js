export const LOGIN_ACTIONS = {
  UPDATE_NAME   : 'LOGIN_UPDATE_NAME',
  UPDATE_ROOM   : 'LOGIN_UPDATE_ROOM',
  PLAYER_LOGGED :'LOGIN_PLAYER_LOGGED'
};

const initialState = {
  name    : "",
  room    : "",
  logged  : false
};

const defaultData = {
  getName   : () => {
    return "player-" + randomize();
  },
  getRoom   : () => {
    return "room-" + randomize(3);
  }
};

function randomize(length=5) {
  return (Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length));
}

const reducer = (state = initialState , action) => {

  switch(action.type){
    case LOGIN_ACTIONS.UPDATE_NAME:
      return {
        name    : action.login_name || (action.login_force? defaultData.getName() : ''),
        room    : state.room,
        logged  : state.logged
      };
    case LOGIN_ACTIONS.UPDATE_ROOM:
      return {
        name    : state.name,
        room    : action.login_room || (action.login_force? defaultData.getRoom() : ''),
        logged  : state.logged
      };
    case LOGIN_ACTIONS.PLAYER_LOGGED:
      console.log(state);
      return {
        name    : state.name,
        room    : state.room,
        logged  : true
      };
    default:
      return state
  }
}

export default reducer;