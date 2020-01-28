export const BOARD_ACTIONS = {
  REMOVE_LINE : 'BOARD_REMOVE_LINE',
  DROP_PIECE  : 'BOARD_UPDATE',
  RAGE_QUIT   : 'BOARD_RAGE_QUIT'
};

const initialState = {
  score   : 0,
  blocks  : null
};

const reducer = (state = initialState , action) => {

  switch(action.type){
    case BOARD_ACTIONS.UPDATE:
      return {
        score   : action.board.score,
        blocks  : action.board.blocks
      };
    case BOARD_ACTIONS.REMOVE_LINE:
    default: 
      return state
  }
}

export default reducer;