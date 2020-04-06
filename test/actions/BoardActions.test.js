import { expect } from 'chai';

import ActionTypes from '../../src/client/constants/ActionTypes';

import * as actions from '../../src/client/actions/board';

describe('Board Actions', function () {

    const board = {
        over_line   : 1,
        score       : 123,
        blocks      : [1, 2, 3, 4, 5]
    };

    //SET HARDMODE
    describe('#setHardmode()', function () {
        it('should return object for the setHardmodeAction with hardmode = false', function(){
            let hardmode = false;
            
            const response = actions.setHardmode(hardmode);
		    expect(response).to.eql({
                type        : ActionTypes.BOARD.SET_HARDMODE,
                hardmode    : hardmode
            });
        });

        it('should return object for the setHardmodeAction with hardmode = true', function(){
            let hardmode = true;
            
            const response = actions.setHardmode(hardmode);
		    expect(response).to.eql({
                type        : ActionTypes.BOARD.SET_HARDMODE,
                hardmode    : hardmode
            });
        });
    });

    //UPDATE
    describe('#update()', function () {
        it('should return object for the updateAction with gameOver = false', function(){
            let gameOver = false;
            
            const response = actions.update({ score:board.score, blocks:board.blocks, gameOver });
		    expect(response).to.eql({
                type        : ActionTypes.BOARD.UPDATE,
                score       : board.score,
                blocks      : board.blocks,
                game_over   : gameOver
            });
        });

        it('should return object for the updateAction with gameOver = true', function(){
            let gameOver = true;
            
            const response = actions.update({ score:board.score, blocks:board.blocks, gameOver });
		    expect(response).to.eql({
                type        : ActionTypes.BOARD.UPDATE,
                score       : board.score,
                blocks      : board.blocks,
                game_over   : gameOver
            });
        });
    });

    //OVERLINE
    describe('#overLine()', function () {
        it('should return object for the overLineAction', function(){
            
            const response = actions.overLine(board.over_line);
		    expect(response).to.eql({
                type        : ActionTypes.BOARD.OVER_LINE,
                over_line   : board.over_line
            });
        });
    });

    //NEW PIECES
    describe('#newPieces()', function () {
        it('should return object for the newPiecesAction', function(){
            
            const response = actions.newPieces();
		    expect(response).to.eql({
                type    : ActionTypes.BOARD.NEW_PIECES
            });
        });
    });

    //REMOVE LINE
    describe('#removeLine()', function () {
        it('should return object for the removeLineAction', function(){
            
            const response = actions.removeLine();
		    expect(response).to.eql({
                type    : ActionTypes.BOARD.REMOVE_LINE
            });
        });
    });

    //RESET
    describe('#reset()', function () {
        it('should return object for the resetAction', function(){
            
            const response = actions.reset();
		    expect(response).to.eql({
                type    : ActionTypes.BOARD.RESET
            });
        });
    });

    //NEXT PIECES
    describe('#nextPieces()', function () {
        it('should return object for the nextPiecesAction', function(){
            let pieces = ['piece3', 'piece4'];
            let index = 2;
    
            const response = actions.nextPieces(pieces, index);
		    expect(response).to.eql({
                type    : ActionTypes.BOARD.NEXT_PIECES,
                pieces  : pieces,
                index   : index
            });
        });
    });

    //GET UPDATE
    describe('#getUpdate()', function () {
        it('should return object for the getUpdateAction', function(){
            let players = ['player1', 'player2'];
    
            const response = actions.getUpdate(players);
		    expect(response).to.eql({
                type    : ActionTypes.BOARD.GET_UPDATE,
                players : players
            });
        });
    });    

});