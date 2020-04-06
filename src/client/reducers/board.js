import ActionTypes from '../constants/ActionTypes';
const BOARD_ACTIONS = ActionTypes.BOARD;

const initialState = {
    hardmode    : false,
    score       : 0,
    blocks      : null,
    pieces      : [],
    index       : 0,
    players     : [],
    game_over   : false,
    over_line   : 0
};

export const getBoardStateCopy = (state) => {

    let data = {};

    for (let i in initialState){
        data[i] = state[i];
    }

    return data;
}

const reset = (data) => {
    const resetIndex = ['score', 'blocks', 'players', 'game_over', 'over_line', 'pieces'];

    for (let i in resetIndex){
        let index = resetIndex[i];
        data[index] = initialState[index];
    }

    return data;
}

const reducer = (state = initialState , action) => {
    let data = getBoardStateCopy(state);

    switch(action.type){
        case BOARD_ACTIONS.SET_HARDMODE:
        case BOARD_ACTIONS.GET_HARDMODE:
            data.hardmode = action.hardmode;
            return data;
        case BOARD_ACTIONS.RESET:
            return reset(data);
        case BOARD_ACTIONS.NEXT_PIECES:
            data.pieces = data.pieces.concat(action.pieces);
            data.index = action.index;
            return data;
        case BOARD_ACTIONS.UPDATE:
            if (action.score){
                data.score = action.score;
            }
            if (action.blocks){
                data.blocks = action.blocks;
            }
            if (action.game_over){
                data.game_over = true;
            }
            return data;
        case BOARD_ACTIONS.GET_UPDATE:
            data.players = action.players;
            return data;
        case BOARD_ACTIONS.OVER_LINE:
            data.over_line = action.over_line;
            return data;
        case BOARD_ACTIONS.NEW_PIECES:
        case BOARD_ACTIONS.REMOVE_LINE:
        default: 
            return state
    }
}

export default reducer;