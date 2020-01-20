import React, { useState, useCallback, useEffect } from 'react';
// import { connect } from 'react-redux';

import { Wrapper, Block } from './styles.js';

import pieces from './pieces.js';
import useEventListener from '../eventListener/eventListener.js';
import useInterval from '../interval/interval.js';

// CONST

const width = 500;
const boardsize = { x:10, y:20 };
const arrowCodes = { LEFT:'ArrowLeft', RIGHT:'ArrowRight', UP:'ArrowUp', DOWN:'ArrowDown', SPACE:'Space' };
const DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 };


// MANAGE USER ACTIONS

function handleKeypress(keycode, blocks, piece){

    switch(keycode){
        case arrowCodes.LEFT:
        case arrowCodes.RIGHT:
            piece = move(blocks, piece, keycode);
            break;
        case arrowCodes.DOWN:
            piece = drop(blocks, piece, keycode);
            break;
        case arrowCodes.UP:
            piece = rotate(blocks, piece);
            break;
        case arrowCodes.SPACE:
            piece = dropspace(blocks, piece, keycode);
            break;
    }

    return piece;
}

function drop(blocks, piece, keycode) {

    let _p = move(blocks, piece, keycode);

    if (!_p) {
        piece.END = true
        return piece;
    }

    return _p;
}

function dropspace(blocks, piece, keycode) {

    let _p = piece;
    let lastPiece = piece;

    for (let i=0; i<boardsize.y; i++){
        lastPiece = _p;
        _p = move(blocks, _p, keycode);

        if (!_p) {
            lastPiece.END = true
            return lastPiece;
        }
    }

    return _p;
}

function move(blocks, piece, dir){
    let x = piece.x;
    let y = piece.y;

    switch(dir) {
        case arrowCodes.RIGHT:
            x = x + 1;
            break;
        case arrowCodes.LEFT:
            x = x - 1;
            break;
        case arrowCodes.SPACE:
        case arrowCodes.DOWN:
            y = y + 1;
            break;
    }

    if (freeToMove(blocks, piece.type, x, y, piece.dir)){
        piece.x = x;
        piece.y = y;

        return piece;
    }

    return false;
}

function rotate(blocks, piece) {
    var dir = (piece.dir == DIR.MAX ? DIR.MIN : piece.dir + 1);

    if (freeToMove(blocks, piece.type, piece.x, piece.y, dir)){
        piece.dir = dir;
        return piece;
    }

    return false;
}


// MANAGE BLOCKS

function getOneBlock(data, index) {

    data = data || {};
    let options = {};

    options.index = data.key || data.index;

    options.size = (data.props? data.props.size : data.size) || (width/10);
    options.plain = data.props? data.props.plain : data.plain;
    options.color = data.props? data.props.color : data.color;

    if (index){
        options.index = index;
    }
    
    if (!options.index && options.index !== 0){
        console.warn("block without key/index");
        return null;
    }

    return (<Block key={ options.index } size={ options.size } plain={ options.plain } color={ options.color } />);
}

function getEmptyBlocks(piece){

    let blocks = [];
    for (var i=0; i<200; i++){
        blocks.push(getOneBlock({index:i}));
    }

    if (piece){
        eachBlock(piece.type, piece.x, piece.y, piece.dir, function(x, y) {
            let index = getBlockIndex(x, y);
            blocks[index] = getOneBlock({index:index, plain:true, color:piece.type.color });
        });
    }

    return blocks;
}

function getBlocksCopy(_blocks){
    let blocks = [];

    for (let i in _blocks){
        let block = _blocks[i];
        blocks[block.key] = getOneBlock(block);
    }

    return blocks;
}

function getBlockIndex(x, y){
    return (y * 10 + x);
}

function getBlockByCords(blocks, x, y){
    let index = getBlockIndex(x, y);
    return blocks[index];
}

function blockIsFree(blocks, x, y){
    let block = getBlockByCords(blocks, x, y);

    if (!block || !block.props.plain){
        return true;
    }

    return false;
}

function freeToMove(blocks, type, x, y, dir) {
    let result = true;

    eachBlock(type, x, y, dir, function(x, y) {
        if ((x < 0) || (x >= boardsize.x) || (y < 0) || (y >= boardsize.y) || !blockIsFree(blocks, x, y)){
            result = false;
        }
    });

    return result;
}

function eachBlock(type, x, y, dir, callback) {
    let bit;
    let row = 0;
    let col = 0;
    let blocks = type.blocks[dir];

    for (bit = 0x8000 ; bit > 0 ; bit = bit >> 1){
        if (blocks & bit){
            callback(x + col, y + row);
        }
        if (++col === 4){
            col = 0;
            ++row;
        }
    }
}


// UPDATE BOARD / PIECE

function getRandomPiece(lastPiece) {
    let piecesBag = (lastPiece? lastPiece.bag : []);

    if (piecesBag.length == 0){
        piecesBag = ['i','i','i','i','j','j','j','j','l','l','l','l','o','o','o','o','s','s','s','s','t','t','t','t','z','z','z','z'];
    }

    let random = (Math.random() * (piecesBag.length-1));
    let pieceType = piecesBag.splice(random, 1)[0];
    let type = pieces[pieceType];
    return { type: type, dir: DIR.UP, x: 2, y: 0, bag: piecesBag };
}

function removeLines(blocks) {

    let n = 0;
    let x, y, complete;

    for (y = boardsize.y-1; y >= 0; y--) {
        complete = true;
        
        for (x=0; x<boardsize.x; x++){
            if (blockIsFree(blocks, x, y)){
                complete = false;
                break;
            }
        }
        
        if (complete){
            blocks = removeLine(blocks, y);
            n++;
            y = y + 1;
        }
    }

    return [blocks, n];
}

function removeLine(blocks, line) {
    let x, y;

    for (y=line; y>=0; --y) {
        for (x=0; x<boardsize.x; x++) {

            let index = getBlockIndex(x, y);
            let block = getBlockByCords(blocks, x, y-1, true);
            let newBlock = (block? getOneBlock(block, index) : getOneBlock({index:index}));

            blocks[index] = newBlock;
        }
    }

    return blocks;
}

function pieceIsStuck(blocks, piece){

    let stuck = true;
    for (var i in arrowCodes){
        let keypress = arrowCodes[i];
        if (keypress === arrowCodes.SPACE){
            continue;
        }

        let _p = handleKeypress(keypress, blocks, piece);
        if (_p && !_p.END){
            stuck = false;
            break;
        }
    }

    return stuck;
}

function updateBoard(staticBlocks, piece){

    let blocks = getBlocksCopy(staticBlocks);

    eachBlock(piece.type, piece.x, piece.y, piece.dir, function(x, y) {
        let index = getBlockIndex(x, y);
        blocks[index] = getOneBlock({index:index, plain:true, color:piece.type.color });
    });

    return blocks;
}


// BOARD COMPONENT

function Board() {

    const [piece, setPiece] = useState(getRandomPiece());
    const [over, setOver] = useState(false);

    const [blocks, setBlocks] = useState(getEmptyBlocks());
    const [current, setCurrent] = useState(getEmptyBlocks(piece));
    
    const [delay, setDelay] = useState(2000);

    const handleKeyPress = (event) => {

        if (!over && Object.values(arrowCodes).indexOf(event.code) !== -1){
            let newPiece = handleKeypress(event.code, blocks, piece);

            if (newPiece && newPiece.END){
                setPiece(newPiece);
                let newCurrent = updateBoard(blocks, newPiece);
                setCurrent(newCurrent);

                let blocksCopy = getBlocksCopy(newCurrent);
                let [newBlocks, lines] = removeLines(blocksCopy);
                setBlocks(newBlocks);
                newPiece = getRandomPiece(piece);
                setPiece(newPiece);

                if (pieceIsStuck(newBlocks, newPiece)){
                    console.log("GAME OVER BIATCH");
                    setOver(true);
                } else {
                    setCurrent(updateBoard(newBlocks, newPiece));
                    if (lines > 0){
                        setDelay(delay - (50 * lines));
                    }
                }

            } else if (newPiece && newPiece.type){
                setPiece(newPiece);                
                setCurrent(updateBoard(blocks, newPiece));
            }
        }
    }

    useInterval(() => {
        handleKeyPress({code:arrowCodes.DOWN});
    }, delay);

    const handler = useCallback(handleKeyPress, [piece, blocks, current, over, delay]);
    useEventListener('keydown', handler);

    return (
        <Wrapper width={ width }>
            { current }
        </Wrapper>
    );
}

// function mapStateToProps(state) {
//     return {
//         count: state.counter.count
//     };
// }

export default Board;
// export default connect(mapStateToProps)(Board);