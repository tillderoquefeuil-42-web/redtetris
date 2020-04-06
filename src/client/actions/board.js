import ActionTypes from '../constants/ActionTypes';

const ACTIONS = ActionTypes.BOARD;


export function setHardmode(hardmode) {
    return { type:ACTIONS.SET_HARDMODE, hardmode };
}

export function update({ score, blocks, gameOver }) {
    return { type:ACTIONS.UPDATE, score, blocks, game_over:gameOver };
}

export function overLine(overLine) {
    return { type:ACTIONS.OVER_LINE, over_line:overLine };
}

export function newPieces() {
    return { type:ACTIONS.NEW_PIECES };
}

export function removeLine() {
    return { type:ACTIONS.REMOVE_LINE };
}

export function reset() {
    return { type:ACTIONS.RESET };
}

export function nextPieces(pieces, index) {
    return { type:ACTIONS.NEXT_PIECES, pieces, index };
}

export function getUpdate(players) {
    return { type:ACTIONS.GET_UPDATE, players };
}
