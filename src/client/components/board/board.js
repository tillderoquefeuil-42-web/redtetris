import React, { useState } from 'react';
// import { connect } from 'react-redux';

import { Wrapper, PieceWrapper, Square } from './styles.js'

import pieces from './pieces.js'

const width = 500;


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
    // let index = 5;
    let index = parseInt(Math.random()*100)%7;

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

    const piece = getRandomPiece();
    console.log(piece);
    // const [piece, setPiece] = useState(tmp);
    // const [size, setSize] = useState(getPieceSize(piece));
    const [position, setPosition] = useState({x:0, y:0, r:0});

    let blocks = [];
    for (var i=0; i<8; i++){
        blocks.push(<Block plain={piece[i]} key={i} />);
    }

    return (
        <PieceWrapper 
        width={ width }
        position={ position }
        >
            { blocks }
        </PieceWrapper>
    );
}

class Piece2 extends React.Component {

    componentDidMount(){
        document.addEventListener("keydown", this._handleKeyDown);
    }
        
    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }

    _handleKeyDown = (event) => {
        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) !== -1){
            this.movePiece(event.keyCode);
        }    
    }
    
    movePiece(keycode) {
        let pos = this.state.position;
        let size = this.getDynamicSize()
        let side = width/10;
        console.log(pos, size);

        switch(keycode){
            // case 32:
            //     pos.rotate = (pos.rotate + 90)%360;
            //     break;

            case 37:
                if (pos.x >= side){
                    pos.x -= side;
                }
                break;
            case 38:
                if (pos.y >= side){
                    pos.y -= side;
                }
                break;

            case 39:
                if (pos.x < (side * (10 - size.width))){
                    pos.x += side;
                }
                break;        
            case 40:
                if (pos.y < side * (20 - size.height)){
                    pos.y += side;
                }
                break;
        }

        this.setState({position:pos});
    }

    // getDynamicPos(){
    //     let side = width/10;
    //     let position = this.state.position;
    //     let correction = this.getCorrection(position);
    // }

    // getCorrection(pos){
    //     let correction = {x:0, y:0};

    //     switch (pos.rotate){
    //         case 90:
    //             correction.y = -1;
    //             break;
    //         case 180:
    //             break;
    //         case 270:
    //             break;
    //     }

    //     return correction;
    // }

    // getDynamicSize() {
    //     let pos = this.state.position;
    //     let size = this.state.size;

    //     // 0 | 90 | 180 | 270
    //     if ([90, 270].indexOf(pos.rotate) !== -1){
    //         let tmp = size.width;
    //         size = {
    //             width   : size.height,
    //             height  : tmp
    //         };
    //     }

    //     return size;
    // }
}


class Block extends React.Component {

    render() {
        return (
            <Square size={width/10} bg={ this.props.plain } piece={ [1,0].indexOf(this.props.plain) === -1? false : true } />
        )
    }
}


// function mapStateToProps(state) {
//     return {
//         count: state.counter.count
//     };
// }

export default Board;
// export default connect(mapStateToProps)(Board);