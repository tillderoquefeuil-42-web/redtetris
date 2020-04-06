import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import * as loginActions from '../../actions/login';
import * as boardActions from '../../actions/board';

import { Container, Column, BoardWrapper, Score } from './styles.js';

import { Button } from '../styles.js';

import NextPiece from './nextPiece.js';
import GameOver from './gameOver.js';
import Previews from '../preview/preview.js';

import useEventListener from '../eventListener/eventListener.js';
import useInterval from '../interval/interval.js';

import utils from './utils.js';
import PIECES from './pieces.js';

const ARROW_CODES = { LEFT:'ArrowLeft', RIGHT:'ArrowRight', UP:'ArrowUp', DOWN:'ArrowDown', SPACE:'Space' };
const DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 };
const SCORING = [0, 40, 100, 300, 1200];


// MANAGE USER ACTIONS
const backToRoom = (props) => {
    props.dispatch(loginActions.restart(true));
};

const restartGame = (props) => {
    props.dispatch(loginActions.restart());
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

            blocks[index] = utils.getBlock(block, index);
        }
    }

    return blocks;
};

const addStaticLine = (blocks) => {

    blocks = [...blocks];

    for (let y=0; y<utils.BOARDSIZE.y; y++) {
        for (let x=0; x<utils.BOARDSIZE.x; x++) {

            let newBlock;
            let index = utils.getBlockIndex(x, y);

            let block = utils.getBlockByCords(blocks, x, y+1);

            if (!block){
                block = { plain:2 };
            }
            newBlock = utils.getBlock(block, index);

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

    if (piece.harddrop_rows > 1){
        score += (piece.harddrop_rows - 1);
    }

    score += SCORING[lines];

    return score;
};

const updateCurrent = (staticBlocks, piece) => {

    let blocks = [...staticBlocks];

    utils.eachBlock(piece.model, piece.x, piece.y, piece.dir, function(x, y) {
        let index = utils.getBlockIndex(x, y);
        blocks[index] = utils.getBlock({ plain:1 }, index);
    });

    return blocks;
};


const Board = (props) => {

    let blocks;

    const [piece, setPiece] = useState(null);
    const [current, setCurrent] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [delay, setDelay] = useState(2000);
    const [newPiece, setNewPiece] = useState(false);
    const [restart, setRestart] = useState(false);
    
    // INIT BLOCKS
    useEffect(() => {
        if (!props.blocks){
            setRestart(false);
            blocks = utils.initBlocks();
            props.dispatch(boardActions.update({ blocks }));
        }
    });

    // INIT PIECE
    useEffect(() => {
        if (!piece && props.pieces.length){
            let newPiece = getNextPiece(props.pieces);
            setPiece(newPiece);
            if (props.blocks){
                setCurrent(updateCurrent(props.blocks, newPiece));
            }
        }
    });

    // MANAGE OVERLINE
    useEffect(() => {
        let player = utils.getPlayerState(props.players, props.login_id);
        let overLine = props.over_line;
        if (player && player.overLine && !props.game_over && newPiece){
            setNewPiece(false);
            let _blocks = props.blocks;
            let change = (player.overLine > overLine? true : false);
            while (player.overLine > overLine){
                _blocks = addStaticLine(_blocks);
                overLine++;
            }
            if (change){
                setCurrent(updateCurrent(_blocks, piece));
                props.dispatch(boardActions.overLine(player.overLine));
                props.dispatch(boardActions.update({ blocks:_blocks }));
            }
        }
    });

    // MANAGE RESTART
    useEffect(() => {
        if (props.game_over && !restart){
            let generalGameOver = true;
            for (let i in props.players){
                let p = props.players[i];
                if (!p.gameOver && !p.viewer){
                    generalGameOver = false;
                    break;
                }
            }

            setRestart(generalGameOver);
        }
    }) ;

    // HANDLE PLAYER ACTION
    const handleKeyPress = (event) => {

        if (countdown !== null || props.game_over || Object.values(ARROW_CODES).indexOf(event.code) === -1){
            return;
        }

        blocks = props.blocks;
        let _piece = handleAction(event.code, blocks, piece);
        setNewPiece(false);

        //CURRENT PIECE IS STUCK
        if (_piece && _piece.END){

            let _current = updateCurrent(blocks, _piece);
            setCurrent(_current);

            let currentCopy = [..._current];
            let [_blocks, lines] = removeLines(currentCopy);

            let score = updateScore(props.score, lines, _piece);

            props.dispatch(boardActions.update({ blocks:_blocks, score:score }));

            //GET NEXT PIECE
            _piece = getNextPiece(props.pieces, piece);
            setPiece(_piece);
            setNewPiece(true);

            if (lines > 0){
                lines = (props.hardmode? lines : 1);
                props.dispatch(boardActions.removeLine(lines));
            }

            if (pieceIsStuck(_blocks, _piece)){
                props.dispatch(boardActions.update({ gameOver:true }));
            } else {
                setCurrent(updateCurrent(_blocks, _piece));
                if (props.hardmode && lines){
                    setDelay(updateDelay(delay, lines));
                }

                if (newPiecesNeeded(props.pieces, _piece)){
                    props.dispatch(boardActions.newPieces());
                }
            }

        //FETCH MOVE
        } else if (_piece && _piece.model){
            setPiece(_piece);                
            setCurrent(updateCurrent(blocks, _piece));
        }
    }

    const handler = useCallback(handleKeyPress, [piece, current, delay, props]);
    useEventListener('keydown', handler);

    // COUNTDOWN
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
                    { utils.buildBoard(current) }
                    <GameOver gameOver={ props.game_over } />
                </BoardWrapper>
                <Score>{ props.score }</Score>
            </Column>

            <Column>
                { restart && props.owner? <Button onClick={ () => restartGame(props) }>Restart</Button> : null }
                {
                    props.game_over?
                    <Button onClick={ () => backToRoom(props) }>Change Room</Button>
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
        score       : state.board.score,
        game_over   : state.board.game_over,
        hardmode    : state.board.hardmode,
        name        : state.login.name,
        login_id    : state.login.id,
        owner       : state.login.owner
    };
};

export default connect(mapStateToProps)(Board);