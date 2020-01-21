import React, { useState, useCallback, useEffect } from 'react';
// import { connect } from 'react-redux';

import { Container, Column, BoardWrapper, NextPieceWrapper, PreviewWrapper, Block, PreviewBlock, Score, PreviewScore } from './styles.js';

import pieces from './pieces.js';
import useEventListener from '../eventListener/eventListener.js';
import useInterval from '../interval/interval.js';

// CONST

const boardsize = { x:10, y:20 };
const arrowCodes = { LEFT:'ArrowLeft', RIGHT:'ArrowRight', UP:'ArrowUp', DOWN:'ArrowDown', SPACE:'Space' };
const DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 };
const scoring = [0, 40, 100, 300, 1200];

// MANAGE USER ACTIONS

function handleAction(keycode, blocks, piece){

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
            piece = harddrop(blocks, piece, keycode);
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

function harddrop(blocks, piece, keycode) {

    let _p = piece;
    let lastPiece = piece;
    let rows = 1;

    for (let i=0; i<boardsize.y; i++){
        lastPiece = _p;
        _p = move(blocks, _p, keycode);
        rows++;

        if (!_p) {
            lastPiece.harddrop_rows = rows;
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

function getOneBlock(data, index, preview=false) {

    data = data || {};
    let options = {};

    options.index = data.key || data.index;

    options.plain = data.props? data.props.plain : data.plain;
    options.demo = data.props? data.props.demo : data.demo;

    if (index){
        options.index = index;
    }
    
    if (!options.index && options.index !== 0){
        console.warn("block without key/index");
        return null;
    }

    if (preview){
        return (<PreviewBlock key={ options.index } plain={ options.plain } demo={ options.demo } />);
    }

    return (<Block key={ options.index } plain={ options.plain } demo={ options.demo } />);
}

function blocksToPreview(blocks) {
    let pBlocks = getBlocksCopy(blocks, true);

    let x, y;

    for (x=0; x<boardsize.x; x++) {

        let emptyCol = true;

        for (y=0; y<boardsize.y; y++){
            if (!blockIsFree(pBlocks, x, y)){
                emptyCol = false;
                continue;
            }

            if (!emptyCol && blockIsFree(pBlocks, x, y)){
                let index = getBlockIndex(x, y);
                pBlocks[index] = getOneBlock({ plain:true }, index, true);
            }

        }
    }

    return pBlocks;
}


function getEmptyBlocks(piece, demo=false){

    let max = demo? 40 : 200;

    let blocks = [];
    for (var i=0; i<max; i++){
        blocks.push(getOneBlock({ index:i, demo:demo }));
    }

    if (piece){
        
        eachBlock(piece.type, piece.x, piece.y, piece.dir, function(x, y) {
            let index = getBlockIndex(x, y);
            blocks[index] = getOneBlock({index:index, plain:true, color:piece.type.color, demo:demo });
        });
    }

    return blocks;
}

function getBlocksCopy(_blocks, preview=false){
    let blocks = [];

    for (let i in _blocks){
        let block = _blocks[i];
        blocks[block.key] = getOneBlock(block, block.key, preview);
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

function getRandomPiece(lastPiece, next=false) {
    let piecesBag = (lastPiece? lastPiece.bag : []);
    let piece;

    if (piecesBag.length == 0){
        piecesBag = ['i','i','i','i','j','j','j','j','l','l','l','l','o','o','o','o','s','s','s','s','t','t','t','t','z','z','z','z'];
    }

    if (lastPiece && lastPiece.next){
        piece = lastPiece.next;
    } else {
        let random = (Math.random() * (piecesBag.length-1));
        let pieceType = piecesBag.splice(random, 1)[0];
        let type = pieces[pieceType];

        piece = { type: type, dir: DIR.UP, x: 3, y: 0, bag: piecesBag };
    }

    if (!next){
        piece.next = getRandomPiece(piece, true);
    }

    return piece;
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

        let _p = handleAction(keypress, blocks, piece);
        if (_p && !_p.END){
            stuck = false;
            break;
        }
    }

    return stuck;
}

function updateDelay(delay, lines){
    let newDelay = delay - (50 * lines);
    if (lines > 0){
        return ((newDelay > 500? newDelay : 500));
    }

    return delay;
}

function updateScore(score, lines, piece){

    if (piece.harddrop_rows){
        score += piece.harddrop_rows;
    }

    score += scoring[lines];

    return score;
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
    const [score, setScore] = useState(0);
    const [over, setOver] = useState(false);

    const [blocks, setBlocks] = useState(getEmptyBlocks());
    const [current, setCurrent] = useState(getEmptyBlocks(piece));
    
    const [delay, setDelay] = useState(2000);

    const handleKeyPress = (event) => {

        if (!over && Object.values(arrowCodes).indexOf(event.code) !== -1){
            let newPiece = handleAction(event.code, blocks, piece);

            //CURRENT PIECE IS STUCK
            if (newPiece && newPiece.END){
                let newCurrent = updateBoard(blocks, newPiece);
                setCurrent(newCurrent);

                let blocksCopy = getBlocksCopy(newCurrent);
                let [newBlocks, lines] = removeLines(blocksCopy);
                let newScore = updateScore(score, lines, newPiece);
                setScore(score); //for unknown reasons

                //GET NEXT PIECE
                newPiece = getRandomPiece(piece);
                setPiece(newPiece);
                setBlocks(newBlocks);
                setScore(newScore);

                if (pieceIsStuck(newBlocks, newPiece)){
                    setOver(true);
                } else {
                    setCurrent(updateBoard(newBlocks, newPiece));
                    setDelay(updateDelay(delay, lines));
                }

            //FETCH MOVE
            } else if (newPiece && newPiece.type){
                setPiece(newPiece);                
                setCurrent(updateBoard(blocks, newPiece));
            }
        }
    }

    useInterval(() => {
        handleKeyPress({ code:arrowCodes.DOWN });
    }, delay);

    const handler = useCallback(handleKeyPress, [piece, blocks, current, over, delay, score]);
    useEventListener('keydown', handler);

    return (
        <Container>

            <Column>
                <Preview blocks={ blocks } score={ score }/>
            </Column>

            <Column>
                <BoardWrapper>
                    { current }
                </BoardWrapper>
                <Score>{ score }</Score>
            </Column>

            <Column>
                <NextPiece piece={ piece.next } />
            </Column>

        </Container>
    );
}

function NextPiece(props) {

    const [bagLength, setBagLength] = useState(0);
    const [blocks, setBlocks] = useState(null);

    useEffect(()=>{
        let piece = props.piece;

        if (
            (!blocks && piece) ||
            (piece && piece.bag.length !== bagLength)
        ){
            setBagLength(piece.bag.length);
            setBlocks(getEmptyBlocks(piece, true))
        }
    });
 
    return (
        <NextPieceWrapper>
            { blocks }
        </NextPieceWrapper>
    );
}

function Preview(props){

    const [blocks, setBlocks] = useState(null);
    const [score, setScore] = useState(0);

    useEffect(()=>{
        let _blocks = props.blocks;
        let _score = props.score;

        if (_blocks !== blocks){
            setBlocks(_blocks);
        }

        if (_score !== score){
            setScore(_score);
        }
    });

    return (
        <PreviewWrapper>
            { blocksToPreview(blocks) }
            <PreviewScore>{ score }</PreviewScore>
        </PreviewWrapper>
    );

}

// function mapStateToProps(state) {
//     return {
//         count: state.counter.count
//     };
// }

export default Board;
// export default connect(mapStateToProps)(Board);