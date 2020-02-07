import React, { useState, useEffect } from 'react';

import { NextPieceWrapper } from './styles.js';
import utils from './utils.js';

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
            setBlocks(utils.getEmptyBlocks(piece, true))
        }
    });
 
    return (
        <NextPieceWrapper>
            { blocks }
        </NextPieceWrapper>
    );
};

export default NextPiece;