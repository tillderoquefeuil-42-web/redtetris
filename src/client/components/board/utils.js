import React from 'react';

import { Block, PreviewBlock } from './styles.js';

// CONST

const utils = {
    BOARDSIZE : { x:10, y:20 }
};

utils.getPlayerState = (players, name) => {

    for (let i in players){
        if (players[i].name === name){
            return players[i];
        }
    }

    return null;
};

utils.getOtherPlayers = (players, name) => {
    let others = [];

    for (let i in players){
        if (players[i].name !== name){
            others.push(players[i]);
        }
    }

    return others;
};


// MANAGE BLOCKS

utils.parseBoard = (blocks, score) => {
    let board = {
        score   : score,
        blocks  : utils.parseBlocks(blocks)
    };

    return board;
};

utils.parseBlocks = (blocks) => {
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
};

utils.unparseBlocks = (data) => {
    let blocks = [];

    for (let index in data){
        blocks[index] = utils.getOneBlock(data[index], index, true);
    }

    return blocks;
};

utils.getOneBlock = (data, index=null, preview=false) => {

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
};

utils.getEmptyBlocks = (piece, demo=false) => {

    let max = demo? 40 : 200;

    let blocks = [];
    for (var i=0; i<max; i++){
        blocks.push(utils.getOneBlock({ index:i, demo:demo }));
    }

    if (piece){
        
        utils.eachBlock(piece.model, piece.x, piece.y, piece.dir, function(x, y) {
            let index = utils.getBlockIndex(x, y);
            blocks[index] = utils.getOneBlock({index:index, plain:true, color:piece.model.color, demo:demo });
        });
    }

    return blocks;
};

utils.getBlocksCopy = (_blocks, preview=false) => {
    let blocks = [];

    for (let i in _blocks){
        let block = _blocks[i];
        blocks[block.key] = utils.getOneBlock(block, block.key, preview);
    }

    return blocks;
};

utils.blocksToPreview = (blocks) => {
    let pBlocks = utils.getBlocksCopy(blocks, true);

    let x, y;

    for (x=0; x<utils.BOARDSIZE.x; x++) {

        let emptyCol = true;

        for (y=0; y<utils.BOARDSIZE.y; y++){
            if (!utils.blockIsFree(pBlocks, x, y)){
                emptyCol = false;
                continue;
            }

            if (!emptyCol && utils.blockIsFree(pBlocks, x, y)){
                let index = utils.getBlockIndex(x, y);
                pBlocks[index] = utils.getOneBlock({ plain:true }, index, true);
            }

        }
    }

    return pBlocks;
};

utils.getBlockIndex = (x, y) => {
    return (y * 10 + x);
};

utils.getBlockByCords = (blocks, x, y) => {
    let index = utils.getBlockIndex(x, y);
    return blocks[index];
};

utils.blockIsFree = (blocks, x, y, strict=false) => {
    let block = utils.getBlockByCords(blocks, x, y);

    if (strict && (!block || !block.props.plain)){
        return true;
    } else if (!strict && (!block || (!block.props.plain && !block.props.bstatic))){
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