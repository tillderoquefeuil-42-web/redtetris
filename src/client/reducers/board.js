export const BOARD_ACTIONS = {
    NEXT_PIECES : 'BOARD_NEXT_PIECES',
    NEW_PIECES  : 'BOARD_NEW_PIECES',
    REMOVE_LINE : 'BOARD_REMOVE_LINE',
    DROP_PIECE  : 'BOARD_UPDATE'
};

const initialState = {
    score   : 0,
    blocks  : null,
    pieces  : [],
    index   : 0
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
            return data;
        case BOARD_ACTIONS.UPDATE:
            data.score = action.board.score;
            data.blocks = action.board.blocks;
            return data;
        case BOARD_ACTIONS.NEW_PIECES:
            data.index = data.index + 1;
            return data;
        case BOARD_ACTIONS.REMOVE_LINE:
        default: 
            return state
    }
}

export default reducer;