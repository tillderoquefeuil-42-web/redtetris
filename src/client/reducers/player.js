export const PLAYER_ACTIONS = {
  REMOVE_LINE : 'PLAYER_REMOVE_LINE',
  DROP_PIECE  : 'PLAYER_DROP_PIECE',
  RAGE_QUIT   : 'PLAYER_RAGE_QUIT'
};

const initialState = {
  board : {}
};

const reducer = (state = initialState , action) => {

  switch(action.type){
    case PLAYER_ACTIONS.REMOVE_LINE:
      return {
        board : {status:'line_removed'}
      };
    case PLAYER_ACTIONS.DROP_PIECE:
      return {
        board : {status:'piece_dropped'}
      };
    default: 
      return state
  }
}

export default reducer;