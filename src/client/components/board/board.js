import React, { useState, useCallback, useEffect } from 'react';
// import { connect } from 'react-redux';
// import styled from 'styled-components';

import { Wrapper, PieceWrapper, Square } from './styles.js';

import pieces from './pieces.js';
import useEventListener from '../eventListener/eventListener.js';

const width = 500;
const arrowCodes = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'];


function getBlockKey(x, y) {
    return (x * 10 + y);
}

function getBlockPosition(key) {        
    return ({
        x   : parseInt(key / 10),
        y   : key % 10
    });
}

function getRandomPiece() {
    let index = 5;
    // let index = parseInt(Math.random()*100)%7;

    return pieces[index];
}

function getPieceSize(piece) {
    let size = {
        width   : 0,
        height  : 0
    };

    let columns = {
        a   : false,
        b   : false
    };

    for (let i=0; i<4; i++){
        let j = i*2;

        if (piece[j] || piece[j+1]){
            size.height++;
        }
        if (piece[j] && !columns.a){
            size.width++;
            columns.a = true;
        }
        if (piece[j+1] && !columns.b){
            size.width++;
            columns.b = true;
        }
    }

    return size;
}

function movePiece(keycode, position, piece) {
    let size = getDynamicSize(position, piece);
    let correction = getCorrection(position.r, size);

    position = applyCorrection(position, correction);
    let side = width/10;

    switch(keycode){
        case 'Space':
            position.r = (position.r + 90)%360;
            break;

        case 'ArrowLeft':
            if (position.x >= side){
                position.x -= side;
            }
            break;
        case 'ArrowUp':
            if (position.y >= side){
                position.y -= side;
            }
            break;

        case 'ArrowRight':
            if (position.x < (side * (10 - size.width))){
                position.x += side;
            }
            break;        
        case 'ArrowDown':
            if (position.y < side * (20 - size.height)){
                position.y += side;
            }
            break;
    }

    position = cancelCorrection(position, correction);
    console.log(position);
    return position;
}

function getDynamicSize(position, piece) {
    let size = getPieceSize(piece);

    // 0 | 90 | 180 | 270
    if ([90, 270].indexOf(position.r) !== -1){
        size.width = size.width + size.height;
        size.height = size.width - size.height;
        size.width = size.width - size.height;
    }

    return size;
}

function getCorrection(rotation, size){
    let correction = {x:0, y:0};

    switch (rotation){
        case 90:
            //for everybody
            correction.y = 1;
            //for bar
            if (size.width === 4){
                correction.x = -1;
            }
            break;
        case 180:
            //for everybody
            correction.y = 1;
            //for bar
            if (size.height === 4){
                correction.x = 1;
                correction.y = 0;
            }
            break;
        case 270:
            //for everybody
            correction.x = -1;
            correction.y = 1;
            //for bar
            if (size.width === 4){
                correction.y = 2;
            }
            break;
    }

    return correction;
}

function applyCorrection(position, correction){
    let side = width/10;

    position.x = position.x + (side * correction.x);
    position.y = position.y + (side * correction.y);
    
    return position;
}

function cancelCorrection(position, correction){
    let side = width/10;
    
    position.x = position.x - (side * correction.x);
    position.y = position.y - (side * correction.y);
    
    return position;
}

function Board() {  
    let blocks = [];
    for (var i=0; i<200; i++){
        blocks.push(<Block key={i} />);
    }

    return (
        <Wrapper width={width}>
            <Piece />
            { blocks }
        </Wrapper>
    );
}

function Piece() {

    const [piece, setPiece] = useState(getRandomPiece());
    const [position, setPosition] = useState({x:0, y:0, r:0});

    let blocks = [];
    for (var i=0; i<8; i++){
        blocks.push(Block(piece[i], i));
    }

    const handleKeyPress = (event) => {
        if (arrowCodes.indexOf(event.code) !== -1){
            let _p = movePiece(event.code, position, piece);
            setPosition({x:_p.x, y:_p.y, r:_p.r});
        }
    }

    const handler = useCallback(handleKeyPress, []);    
    useEventListener('keydown', handler);

    return (
        <PieceWrapper 
            width={ width }
            position={ position }
        >
            { blocks }
        </PieceWrapper>
    );
}


function Block(plain, key) {
    return (
        <Square key={ key } size={ width/10 } bg={ plain } piece={ [1,0].indexOf(plain) === -1? false : true } />
    );
}


// function mapStateToProps(state) {
//     return {
//         count: state.counter.count
//     };
// }

export default Board;
// export default connect(mapStateToProps)(Board);