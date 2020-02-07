import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import { Container, Column, BoardWrapper, Score } from './styles.js';
import { Button } from '../styles.js';

import NextPiece from './nextPiece.js';
import GameOver from './gameOver.js';
import Previews from './preview.js';

import useEventListener from '../eventListener/eventListener.js';
import useInterval from '../interval/interval.js';

import utils from './utils.js';
import PIECES from './pieces.js';

const ARROW_CODES = { LEFT:'ArrowLeft', RIGHT:'ArrowRight', UP:'ArrowUp', DOWN:'ArrowDown', SPACE:'Space' };
const DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 };
const SCORING = [0, 40, 100, 300, 1200];


// MANAGE USER ACTIONS
const backToRoom = (props) => {
    props.dispatch({ type: 'LOGIN_UPDATE_ROOM', login_room:'' });
};

const handleAction = (keycode, blocks, piece) => {

    switch (keycode){
        case ARROW_CODES.LEFT:
        case ARROW_CODES.RIGHT:
            piece = move(blocks, piece, keycode);
            break;
        case ARROW_CODES.DOWN:
            piece = drop(blocks, piece, keycode);
            break;
        case ARROW_CODES.UP:
            piece = rotate(blocks, piece);
            break;
        case ARROW_CODES.SPACE:
            piece = harddrop(blocks, piece, keycode);
            break;
    }

    return piece;
};

const drop = (blocks, piece, keycode) => {

    let _p = move(blocks, piece, keycode);

    if (!_p) {
        piece.END = true
        return piece;
    }

    return _p;
};

const harddrop = (blocks, piece, keycode) => {

    let _p = piece;
    let lastPiece = piece;
    let rows = 1;

    for (let i=0; i<utils.BOARDSIZE.y; i++){
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
};

const move = (blocks, piece, dir) => {
    let x = piece.x;
    let y = piece.y;

    switch (dir) {
        case ARROW_CODES.RIGHT:
            x = x + 1;
            break;
        case ARROW_CODES.LEFT:
            x = x - 1;
            break;
        case ARROW_CODES.SPACE:
        case ARROW_CODES.DOWN:
            y = y + 1;
            break;
    }

    if (utils.freeToMove(blocks, piece.model, x, y, piece.dir)){
        piece.x = x;
        piece.y = y;

        return piece;
    }

    return false;
};

const rotate = (blocks, piece) => {
    var dir = (piece.dir == DIR.MAX ? DIR.MIN : piece.dir + 1);

    if (utils.freeToMove(blocks, piece.model, piece.x, piece.y, dir)){
        piece.dir = dir;
        return piece;
    }

    return false;
};


// UPDATE BOARD / PIECE

const getNextPiece = (pieces, lastpiece=null) => {
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
};

const newPiecesNeeded = (pieces, piece) => {

    if (pieces.length - piece.index < 10){
        return true;
    }

    return false;
};

const removeLines = (blocks) => {

    let n = 0;
    let x, y, complete;

    for (y = utils.BOARDSIZE.y-1; y >= 0; y--) {
        complete = true;
        
        for (x=0; x<utils.BOARDSIZE.x; x++){
            if (utils.blockIsFree(blocks, x, y, true)){
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
};

const removeLine = (blocks, line) => {
    let x, y;

    for (y=line; y>=0; --y) {
        for (x=0; x<utils.BOARDSIZE.x; x++) {

            let index = utils.getBlockIndex(x, y);
            let block = utils.getBlockByCords(blocks, x, y-1);
            let newBlock = (block? utils.getOneBlock(block, index) : utils.getOneBlock({index:index}));

            blocks[index] = newBlock;
        }
    }

    return blocks;
};

const addStaticLine = (blocks) => {

    for (let y=0; y<utils.BOARDSIZE.y; y++) {
        for (let x=0; x<utils.BOARDSIZE.x; x++) {

            let newBlock;
            let index = utils.getBlockIndex(x, y);

            let block = utils.getBlockByCords(blocks, x, y+1);

            newBlock = (block? utils.getOneBlock(block, index) : utils.getOneBlock({ index:index, bstatic:true }));

            blocks[index] = newBlock;
        }
    }

    return blocks;
};

const pieceIsStuck = (blocks, piece) => {

    let stuck = true;
    for (var i in ARROW_CODES){
        let keypress = ARROW_CODES[i];
        if (keypress === ARROW_CODES.SPACE){
            continue;
        }

        let _p = handleAction(keypress, blocks, piece);
        if (_p && !_p.END){
            stuck = false;
            break;
        }
    }

    return stuck;
};

const updateDelay = (delay, lines) => {
    let newDelay = delay - (50 * lines);
    if (lines > 0){
        return ((newDelay > 500? newDelay : 500));
    }

    return delay;
};

const updateScore = (score, lines, piece) => {

    if (piece.harddrop_rows){
        score += piece.harddrop_rows;
    }

    score += SCORING[lines];

    return score;
};

const updateBoard = (staticBlocks, piece) => {

    let blocks = utils.getBlocksCopy(staticBlocks);

    utils.eachBlock(piece.model, piece.x, piece.y, piece.dir, function(x, y) {
        let index = utils.getBlockIndex(x, y);
        blocks[index] = utils.getOneBlock({index:index, plain:true, color:piece.model.color });
    });

    return blocks;
};



const Board = (props) => {

    const [piece, setPiece] = useState(null);
    const [score, setScore] = useState(0);
    const [over, setOver] = useState(false);

    const [blocks, setBlocks] = useState(utils.getEmptyBlocks());
    const [current, setCurrent] = useState(null);
    const [countdown, setCountdown] = useState(3);

    const [delay, setDelay] = useState(99999999);

    // const reset = () => {
    //     setPiece(null);
    //     setScore(0);
    //     setOver(false);
    //     setBlocks(utils.getEmptyBlocks());
    //     setCurrent(null);
    //     setCountdown(3);
    //     setDelay(99999999);
    // };

    // if (over && !props.blocks){
    //     console.log('here')
    //     reset();
    // }

    useEffect(() => {
        if (!piece && props.pieces.length){
            let newPiece = getNextPiece(props.pieces);
            setPiece(newPiece);
            setCurrent(utils.getEmptyBlocks(newPiece));
            setDelay(2000);
        }
    });

    useEffect(() => {
        let player = utils.getPlayerState(props.players, props.name);
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

        if (!over && Object.values(ARROW_CODES).indexOf(event.code) !== -1){
            let newPiece = handleAction(event.code, blocks, piece);

            //CURRENT PIECE IS STUCK
            if (newPiece && newPiece.END){
                let newCurrent = updateBoard(blocks, newPiece);
                setCurrent(newCurrent);

                let blocksCopy = utils.getBlocksCopy(newCurrent);
                let [newBlocks, lines] = removeLines(blocksCopy);
                let newScore = updateScore(score, lines, newPiece);
                setScore(score); //for unknown reasons

                //GET NEXT PIECE
                newPiece = getNextPiece(props.pieces, piece);
                setPiece(newPiece);
                setBlocks(newBlocks);
                setScore(newScore);

                if (lines > 0){
                    props.dispatch({ type: 'BOARD_REMOVE_LINE', lines:lines });
                }

                let board = utils.parseBoard(newBlocks, newScore);
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
            handleKeyPress({ code:ARROW_CODES.DOWN });
        }, delay);
    }

    return (
        <Container>

            <Column>
                <Previews />
            </Column>

            <Column>
                <BoardWrapper>
                    { current }
                    <GameOver over={ over } />
                </BoardWrapper>
                <Score>{ score }</Score>
            </Column>

            <Column>
                {
                    over?
                    // <Button onClick={ () => backToRoom(props) }>Change Room</Button>
                    <NextPiece piece={ piece? piece.next : null} />
                    :
                    <NextPiece piece={ piece? piece.next : null} />
                }
            </Column>

        </Container>
    );
};

function mapStateToProps(state) {
    return {
        pieces      : state.board.pieces,
        players     : state.board.players,
        over_line   : state.board.over_line,
        blocks      : state.board.blocks,
        name        : state.login.name
    };
};

export default connect(mapStateToProps)(Board);