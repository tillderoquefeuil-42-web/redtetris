import React from 'react';

import { Block, PreviewBlock } from './styles.js';

// CONST

const utils = {
    BOARDSIZE : { x:10, y:20 }
};

const defaultBlock = { plain : 0 };


// MANAGE PLAYERS

utils.getPlayerState = (players, loginId) => {

    for (let i in players){
        if (players[i].uniqueId === loginId){
            return players[i];
        }
    }

    return null;
};

utils.getOtherPlayers = (players, loginId) => {
    let others = [];

    for (let i in players){
        if (players[i].uniqueId !== loginId && !players[i].viewer){
            others.push(players[i]);
        }
    }

    return others;
};


// CONVERT BLOCKS TO REACTELEMS

utils.buildBoard = (blocks, preview=false) => {
    let board = [];

    for (let i in blocks){
        let block = utils.buildOneBlock(blocks[i], preview);
        board[block.key] = block;
    }

    return board;
};

utils.buildOneBlock = (block, preview=false) => {

    if (!block || (!block.key && block.key !== 0)){
        console.warn("block without key/index");
        return null;
    }

    if (preview){
        return (<PreviewBlock key={ block.key } plain={ block.plain } />);
    }

    return (<Block id={ "block-" + block.key } key={ block.key } plain={ block.plain } demo={ block.demo } />);
};


// INIT

utils.initNextPiece = (piece) => {

    let blocks = [];
    for (var i=0; i<40; i++){
        blocks.push(utils.getBlock({ demo:1 }, i));
    }

    utils.eachBlock(piece.model, piece.x, piece.y, piece.dir, function(x, y) {
        let index = utils.getBlockIndex(x, y);
        blocks[index] = utils.getBlock({ plain:1, demo:1 }, index);
    });

    return blocks;
};

utils.initBlocks = () => {

    let blocks = [];
    for (var i=0; i<200; i++){
        blocks.push(utils.getBlock({}, i));
    }

    return blocks;
};

utils.initPreview = (blocks) => {
    let previews = [...blocks];

    let x, y;

    for (x=0; x<utils.BOARDSIZE.x; x++) {

        let emptyCol = true;

        for (y=0; y<utils.BOARDSIZE.y; y++){
            if (!utils.blockIsFree(previews, x, y)){
                emptyCol = false;
                continue;
            }

            if (!emptyCol && utils.blockIsFree(previews, x, y)){
                let index = utils.getBlockIndex(x, y);
                previews[index] = utils.getBlock({ plain:1 }, index);
            }

        }
    }

    return previews;
};


// MANAGE BLOCKS

utils.getBlock = (data, forceKey=null) => {

    data = data || {};

    let block = Object.assign(...defaultBlock, data);

    if (forceKey !== null){
        block.key = forceKey;
    }

    return block;
}

utils.getBlockIndex = (x, y) => {
    return (y * 10 + x);
};

utils.getBlockByCords = (blocks, x, y) => {
    let index = utils.getBlockIndex(x, y);
    return blocks[index];
};

utils.blockIsFree = (blocks, x, y, strict=false) => {
    let block = utils.getBlockByCords(blocks, x, y);

    if (strict && (!block || block.plain !== 1)){
        return true;
    } else if (!strict && (!block || !block.plain)){
        return true;
    }

    return false;
};

utils.freeToMove = (blocks, model, x, y, dir) => {
    let result = true;

    utils.eachBlock(model, x, y, dir, function(x, y) {
        if ((x < 0) || (x >= utils.BOARDSIZE.x) || (y < 0) || (y >= utils.BOARDSIZE.y) || !utils.blockIsFree(blocks, x, y)){
            result = false;
        }
    });

    return result;
};

utils.eachBlock = (model, x, y, dir, callback) => {
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
};


export default utils;