var sha256 = require('js-sha256');

const Piece = require('./Piece.js');

const BOARD_ACTIONS = {
    NEXT_PIECES : 'BOARD_NEXT_PIECES',
    REMOVE_LINE : 'BOARD_REMOVE_LINE',
    DROP_PIECE  : 'BOARD_UPDATE'
};

const PIECES_SET = ['i','i','i','i','j','j','j','j','l','l','l','l','o','o','o','o','s','s','s','s','t','t','t','t','z','z','z','z'];

function generatePiecesSet(roomName, index) {
    let data = [];
    let piecesSet = PIECES_SET.slice();
    let r, pieceType;

    let slice = getSliceHash(roomName, index);
    let pieceIndex = index * PIECES_SET.length;

    for (let i in slice){
        r = (piecesSet.length > 1)? slice[i].charCodeAt() % piecesSet.length-1 : 0;
        pieceType = piecesSet.splice(r, 1)[0];
        data.push(new Piece(pieceType, (pieceIndex + parseInt(i))));
    }

    return data;
}

function getSliceHash(roomName, index){
    let hash = sha256(roomName);

    while (hash.length < ((index+1) * PIECES_SET.length)){
        hash += sha256(hash);
    }

    let start = index * PIECES_SET.length;
    let end = start + PIECES_SET.length;

    return hash.slice(start, end)
}

exports.getPiecesSet = (roomName, index) => {
    return {
        type    : BOARD_ACTIONS.NEXT_PIECES,
        pieces  : generatePiecesSet(roomName, index),
        index   : index + 1
    };
}
