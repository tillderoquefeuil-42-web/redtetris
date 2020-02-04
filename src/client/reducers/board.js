export const BOARD_ACTIONS = {
    NEXT_PIECES : 'BOARD_NEXT_PIECES',
    NEW_PIECES  : 'BOARD_NEW_PIECES',
    UPDATE      : 'BOARD_UPDATE',
    GET_UPDATE  : 'BOARD_GET_UPDATE',
    REMOVE_LINE : 'BOARD_REMOVE_LINE',
    OVER_LINE   : 'BOARD_OVER_LINE'
};

const initialState = {
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

const reducer = (state = initialState , action) => {
    let data = getBoardStateCopy(state);

    switch(action.type){
        case BOARD_ACTIONS.NEXT_PIECES:
            data.pieces = data.pieces.concat(action.pieces);
            data.index = action.index;
            return data;
        case BOARD_ACTIONS.UPDATE:
            data.score = action.board.score;
            data.blocks = action.board.blocks;
            data.game_over = action.over? true : false;
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