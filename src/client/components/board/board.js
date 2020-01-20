import React, { useState, useCallback, useEffect } from 'react';
// import { connect } from 'react-redux';
// import styled from 'styled-components';

import { Wrapper, Block } from './styles.js';

import pieces from './pieces.js';
import useEventListener from '../eventListener/eventListener.js';

// CONST

const width = 500;
const boardsize = {x:10, y:20};
const arrowCodes = {LEFT:'ArrowLeft', RIGHT:'ArrowRight', UP:'ArrowUp', DOWN:'ArrowDown', SPACE:'Space'};
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
            console.log('drop');
            break;
    }

    return piece;
}

function drop(blocks, piece, keycode) {

    let _p = move(blocks, piece, keycode);

    if (!_p) {
        return { END:true };
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

function getEmptyBlocks(piece){

    let blocks = [];
    for (var i=0; i<200; i++){
        blocks.push(<Block key={ i } size={ width/10 } />);
    }

    if (piece){
        eachBlock(piece.type, piece.x, piece.y, piece.dir, function(x, y) {
            let index = getBlockIndex(x, y);
            blocks[index] = <Block key={index} size={ width/10 } plain={ true } color={ piece.type.color } />;
        });
    }

    return blocks;
}

function getBlocksCopy(_blocks, log=false){
    let blocks = [];

    for (let i in _blocks){
        let block = _blocks[i];
        if (log && block.props.plain){
            console.log(block);
        }
        blocks[block.key] = <Block key={ block.key } size={ block.props.size } plain={ block.props.plain } color={ block.props.color } />
    }

    return blocks;
}

function getBlockIndex(x, y){
    return (y * 10 + x);
}

function getBlock(blocks, x, y){
    let index = getBlockIndex(x, y);

    return blocks[index];
}

function setBlock(blocks, x, y, block = null){
    let index = getBlockIndex(x, y);

    if (block){
        block = <Block key={ block.key } size={ block.props.size } plain={ block.props.plain } color={ block.props.color } />
    } else {
        block = <Block key={ index } size={ width/10 } />
    }
    
    blocks[index] = block;

    return blocks;
}

function blockIsFree(blocks, x, y){
    let block = getBlock(blocks, x, y);

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
            console.log(`for line ${y}`);
            console.log('remove line')
            blocks = removeLine(blocks, y);
            y = y + 1;
        }
    }

    return blocks;
}

function removeLine(blocks, line) {
    let x, y;

    for (y=line; y>=0; --y) {
        for (x=0; x<boardsize.x; x++) {
            let block = getBlock(blocks, x, y-1);
            blocks = setBlock(blocks, x, y, block);
        }
    }

    return blocks;
}

function updateBoard(staticBlocks, piece){

    let blocks = getBlocksCopy(staticBlocks);

    eachBlock(piece.type, piece.x, piece.y, piece.dir, function(x, y) {
        let index = getBlockIndex(x, y);
        blocks[index] = <Block key={index} size={ width/10 } plain={ true } color={ piece.type.color } />;
    });

    return blocks;
}


// BOARD COMPONENT

function Board() {

    const [piece, setPiece] = useState(getRandomPiece());

    const [blocks, setBlocks] = useState(getEmptyBlocks());
    const [current, setCurrent] = useState(getEmptyBlocks(piece));

    const handleKeyPress = (event) => {
        if (Object.values(arrowCodes).indexOf(event.code) !== -1){
            let newPiece = handleKeypress(event.code, blocks, piece);

            if (newPiece && newPiece.type){
                setPiece(newPiece);                
                setCurrent(updateBoard(blocks, newPiece));
            } else if (newPiece && newPiece.END){
                console.log(current);
                let blocksCopy = getBlocksCopy(current);
                let newBlocks = removeLines(blocksCopy);
                console.log(newBlocks);
                setBlocks(newBlocks);
                newPiece = getRandomPiece(piece);
                setPiece(newPiece);

                setCurrent(updateBoard(newBlocks, newPiece));
            }
        }
    }

    // useEffect(()=>{
        // console.log(piece);
        // console.log(piece.bag.length);
    // });

    const handler = useCallback(handleKeyPress, [piece, blocks, current]);
    useEventListener('keydown', handler);

    return (
        <Wrapper width={width}>
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