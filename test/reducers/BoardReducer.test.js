import { expect } from 'chai';

import * as actions from '../../src/client/actions/board';

import reducer, { initialState } from '../../src/client/reducers/board';

describe('Board Reducer', function () {

    //SET HARDMODE
    describe('set hardmode to BoardState', function () {
        it('should return object for the BoardState with hardmode (false) updated', function(){
            let hardmode = false;

            const response = reducer(initialState, actions.setHardmode(hardmode));
            expect(response.hardmode).to.eql(hardmode);
        });

        it('should return object for the BoardState with hardmode (true) updated', function(){
            let hardmode = true;

            const response = reducer(initialState, actions.setHardmode(hardmode));
            expect(response.hardmode).to.eql(hardmode);
        });
    });

    //RESET
    describe('reset BoardState', function () {
        it('should return object for the BoardState with reset fields', function(){
            const response = reducer(initialState, actions.reset());
            expect(response).to.eql(initialState);
        });
    });

    //NEXT PIECES
    describe('next pieces in BoardState', function () {
        let pieces = ['piece3', 'piece4'];
        let index = 2;
        
        let state = [...initialState];
        state.pieces = ['piece1', 'piece2'];
        
        let expected = ['piece1', 'piece2', 'piece3', 'piece4'];
        
        it('should return object for the BoardState with next pieces', function(){
            const response = reducer(state, actions.nextPieces(pieces, index));
            expect(response.pieces).to.eql(expected);
            expect(response.index).to.eql(index);
        });
    });

    //UPDATE
    describe('update in BoardState', function () {
        let score = 15;
        let blocks = ['b1', 'b2', 'etc.'];
        let gameOver = true;
        
        let state = [...initialState];
        state.score = 0;
        state.blocks = [1,'two', 3];
        state.game_over = false;

        it('should return object for the BoardState with update on score, blocks and game_over', function(){
            const response = reducer(state, actions.update({score, blocks, gameOver}));
            expect(response.score).to.eql(score);
            expect(response.blocks).to.eql(blocks);
            expect(response.game_over).to.eql(gameOver);
        });
    });

    //GET UPDATE
    describe('get update in BoardState', function () {
        let players = ['p1', 'p2', 'etc.'];

        let state = [...initialState];
        state.players = ['old-p1', 'old-p2', 'old-etc.'];

        it('should return object for the BoardState with update on players', function(){
            const response = reducer(state, actions.getUpdate(players));
            expect(response.players).to.eql(players);
        });
    });

    //OVERLINE
    describe('overline in BoardState', function () {
        let overline = 3;

        it('should return object for the BoardState with update on players', function(){
            const response = reducer(initialState, actions.overLine(overline));
            expect(response.over_line).to.eql(overline);
        });
    });

});