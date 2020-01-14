import React from 'react';
// import { connect } from 'react-redux';

import { Wrapper, PieceWrapper, Square } from './styles.js'

import pieces from './pieces.js'


const width = 500;

class Board extends React.Component {

    getBlockKey(x, y) {
        return (x * 10 + y);
    }

    getBlockPosition(key) {        
        return ({
            x   : parseInt(key / 10),
            y   : key % 10
        });
    }

    fillBoard() {
        let response = [];

        for (var i=0; i<200; i++){
            response.push(<Block key={i} />);
        }

        return response;
    }

    render() {
        return (
            <Wrapper width={width}>
                <Piece />
                { this.fillBoard() }
            </Wrapper>
        )
    }
}

class Piece extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            piece   : this.getRandomPiece(),
            position: {
                x       : 0,
                y       : 0,
                rotate  : 0
            }
        }
    }

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
        let size = width/10;

        switch(keycode){
            case 32:
                pos.rotate = (pos.rotate + 90)%360;
                break;
            case 37:
                if (pos.x >= size){
                    pos.x -= size;
                }
                break;
            case 38:
                if (pos.y >= size){
                    pos.y -= size;
                }
                break;
            case 39:
                if (pos.x < size * 10){
                    pos.x += size;
                }
                break;        
            case 40:
                if (pos.y < size * 20){
                    pos.y += size;
                }
                break;
        }

        this.setState({position:pos});
    }

    getRandomPiece() {
        let index = parseInt(Math.random()*100)%7;

        return pieces[index];
    }

    fillPiece() {
        let response = [];
        let piece = this.state.piece;

        for (var i=0; i<8; i++){
            response.push(<Block plain={piece[i]} key={i} />);
        }

        return response;
    }


    render() {
        return (
            <PieceWrapper 
                width={width}
                position={ this.state.position }
            >
                { this.fillPiece() }
            </PieceWrapper>
        )
    }
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