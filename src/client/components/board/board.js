import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import { Container, Column, BoardWrapper, NextPieceWrapper, PreviewWrapper, Block, PreviewBlock, Score, PreviewScore, BoardCover, GameOverSpan, PreviewName } from './styles.js';

import PIECES from './pieces.js';
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

function move(blocks, piece, dir) {
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

    if (freeToMove(blocks, piece.model, x, y, piece.dir)){
        piece.x = x;
        piece.y = y;

        return piece;
    }

    return false;
}

function rotate(blocks, piece) {
    var dir = (piece.dir == DIR.MAX ? DIR.MIN : piece.dir + 1);

    if (freeToMove(blocks, piece.model, piece.x, piece.y, dir)){
        piece.dir = dir;
        return piece;
    }

    return false;
}

function getPlayerState(players, name){

    for (let i in players){
        if (players[i].name === name){
            return players[i];
        }
    }

    return null;
}


// MANAGE BLOCKS

function parseBoard(blocks, score) {
    let board = {
        score   : score,
        blocks  : parseBlocks(blocks)
    };

    return board;
}

function parseBlocks(blocks){
    let data = [];
    let block, index;

    for (let i in blocks){
        block = blocks[i];
        index = parseInt(block.key);

        data[index] = {
            bstatic : block.props.bstatic,
            plain   : block.props.plain
        };
    }

    return data;
}

function unparseBlocks(data) {
    let blocks = [];

    for (let index in data){
        blocks[index] = getOneBlock(data[index], index, true);
    }

    return blocks;
}

function getOneBlock(data, index=null, preview=false) {

    data = data || {};
    let options = {};

    options.index = data.key || data.index;

    options.bstatic = data.props? data.props.bstatic : data.bstatic;
    options.plain = data.props? data.props.plain : data.plain;
    options.demo = data.props? data.props.demo : data.demo;

    if (index !== null){
        options.index = index;
    }
    
    if (!options.index && options.index !== 0){
        console.warn("block without key/index");
        return null;
    }

    if (preview){
        return (<PreviewBlock key={ options.index } plain={ options.plain } demo={ options.demo } bstatic={ options.bstatic } />);
    }

    return (<Block key={ options.index } plain={ options.plain } demo={ options.demo } bstatic={ options.bstatic } />);
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
        
        eachBlock(piece.model, piece.x, piece.y, piece.dir, function(x, y) {
            let index = getBlockIndex(x, y);
            blocks[index] = getOneBlock({index:index, plain:true, color:piece.model.color, demo:demo });
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

function blockIsFree(blocks, x, y, strict=false){
    let block = getBlockByCords(blocks, x, y);

    if (strict && (!block || !block.props.plain)){
        return true;
    } else if (!strict && (!block || (!block.props.plain && !block.props.bstatic))){
        return true;
    }

    return false;
}

function freeToMove(blocks, model, x, y, dir) {
    let result = true;

    eachBlock(model, x, y, dir, function(x, y) {
        if ((x < 0) || (x >= boardsize.x) || (y < 0) || (y >= boardsize.y) || !blockIsFree(blocks, x, y)){
            result = false;
        }
    });

    return result;
}

function eachBlock(model, x, y, dir, callback) {
    let bit;
    let row = 0;
    let col = 0;
    let blocks = model.blocks[dir];

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

function getNextPiece(pieces, lastpiece=null){
    let index = 0;
    
    if (lastpiece){
        index = lastpiece.index + 1;
    }

    let piece = pieces[index];
    if (piece){
        piece.model = PIECES[piece.piecetype];
        piece.next = pieces[index + 1];
        piece.next.model = PIECES[piece.next.piecetype];
    }

    return piece;
}

function newPiecesNeeded(pieces, piece){

    if (pieces.length - piece.index < 10){
        return true;
    }

    return false;
}

function removeLines(blocks) {

    let n = 0;
    let x, y, complete;

    for (y = boardsize.y-1; y >= 0; y--) {
        complete = true;
        
        for (x=0; x<boardsize.x; x++){
            if (blockIsFree(blocks, x, y, true)){
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
            let block = getBlockByCords(blocks, x, y-1);
            let newBlock = (block? getOneBlock(block, index) : getOneBlock({index:index}));

            blocks[index] = newBlock;
        }
    }

    return blocks;
}

function addStaticLine(blocks) {

    for (let y=0; y<boardsize.y; y++) {
        for (let x=0; x<boardsize.x; x++) {

            let newBlock;
            let index = getBlockIndex(x, y);

            let block = getBlockByCords(blocks, x, y+1);

            newBlock = (block? getOneBlock(block, index) : getOneBlock({ index:index, bstatic:true }));

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

    eachBlock(piece.model, piece.x, piece.y, piece.dir, function(x, y) {
        let index = getBlockIndex(x, y);
        blocks[index] = getOneBlock({index:index, plain:true, color:piece.model.color });
    });

    return blocks;
}


// BOARD COMPONENT

const Board = (props) => {

    const [piece, setPiece] = useState(null);
    const [score, setScore] = useState(0);
    const [over, setOver] = useState(false);

    const [blocks, setBlocks] = useState(getEmptyBlocks());
    const [current, setCurrent] = useState(null);
    const [countdown, setCountdown] = useState(3);

    const [delay, setDelay] = useState(99999999);

    useEffect(() => {
        if (!piece && props.pieces.length){
            let newPiece = getNextPiece(props.pieces);
            setPiece(newPiece);
            setCurrent(getEmptyBlocks(newPiece));
            setDelay(2000);
        }
    });

    useEffect(() => {
        let player = getPlayerState(props.players, props.name);
        let overLine = props.over_line;
        if (player && player.overLine){
            while (player.overLine > overLine){
                let nBlocks = addStaticLine(blocks);
                setBlocks(nBlocks);
                overLine++;
            }
            props.dispatch({ type: 'BOARD_OVER_LINE', over_line: player.overLine});
        }
    });

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
                newPiece = getNextPiece(props.pieces, piece);
                setPiece(newPiece);
                // newBlocks = addStaticLine(newBlocks);
                setBlocks(newBlocks);
                setScore(newScore);

                if (lines > 0){
                    props.dispatch({ type: 'BOARD_REMOVE_LINE', lines:lines });
                }

                let board = parseBoard(newBlocks, newScore);
                if (pieceIsStuck(newBlocks, newPiece)){
                    setOver(true);
                    props.dispatch({ type: 'BOARD_UPDATE', board:board, over:true });
                } else {
                    setCurrent(updateBoard(newBlocks, newPiece));
                    setDelay(updateDelay(delay, lines));
                    props.dispatch({ type: 'BOARD_UPDATE', board:board });

                    if (newPiecesNeeded(props.pieces, newPiece)){
                        props.dispatch({ type: 'BOARD_NEW_PIECES' });
                    }
                }

            //FETCH MOVE
            } else if (newPiece && newPiece.model){
                setPiece(newPiece);                
                setCurrent(updateBoard(blocks, newPiece));
            }
        }
    }

    const handler = useCallback(handleKeyPress, [piece, blocks, current, over, delay, score, props]);
    useEventListener('keydown', handler);

    if (countdown !== null){
        useInterval(() => {
            setCountdown(!countdown? null : countdown - 1);
        }, 1000);

        return (
            <Container>
                <Score>{ countdown }</Score>
            </Container>
        );
    } else {
        useInterval(() => {
            handleKeyPress({ code:arrowCodes.DOWN });
        }, delay);
    }

    return (
        <Container>

            <Column>
                <Previews name={ props.name } players={ props.players } />
            </Column>

            <Column>
                <BoardWrapper>
                    { current }
                    <GameOver over={ over } />
                </BoardWrapper>
                <Score>{ score }</Score>
            </Column>

            <Column>
                <NextPiece piece={ piece? piece.next : null} />
            </Column>

        </Container>
    );
};

const NextPiece = (props) => {

    const [index, setIndex] = useState(0);
    const [blocks, setBlocks] = useState(null);

    useEffect(()=>{
        let piece = props.piece;

        if (
            (!blocks && piece) ||
            (piece && piece.index !== index)
        ){
            setIndex(piece.index);
            setBlocks(getEmptyBlocks(piece, true))
        }
    });
 
    return (
        <NextPieceWrapper>
            { blocks }
        </NextPieceWrapper>
    );
};


const Previews = (props) => {

    if (!props.players || props.players.length === 1 || !props.name){
        return;
    }

    let previews = [];
    for (let i in props.players){
        let player = props.players[i];
        if (player.name === props.name){
            continue;
        }

        previews.push(<Preview blocks={ unparseBlocks(player.blocks) } score={ player.score } name={ player.name } over={ player.gameOver } />)
    }

    return (
        <div>
            { previews }
        </div>
    );

};

const Preview = (props) => {

    return (
        <PreviewWrapper>
            <PreviewName>{ props.name }</PreviewName>
            { blocksToPreview(props.blocks) }
            <GameOver over={ props.over } preview={ true } />
            <PreviewScore>{ props.score }</PreviewScore>
        </PreviewWrapper>
    );

};

const GameOver = (props) => {
    return (
        <BoardCover over={ props.over }>
            <GameOverSpan preview={ props.preview } >Game</GameOverSpan>
            <GameOverSpan preview={ props.preview } >Over</GameOverSpan>
        </BoardCover>
    );
}

function mapStateToProps(state) {
    return {
        pieces      : state.board.pieces,
        players     : state.board.players,
        over_line   : state.board.over_line,
        name        : state.login.name
    };
}

// export default Board;
export default connect(mapStateToProps)(Board);