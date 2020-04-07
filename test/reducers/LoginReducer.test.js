import { expect } from 'chai';

import * as actions from '../../src/client/actions/login';

import reducer, { initialState } from '../../src/client/reducers/login';

describe('Login Reducer', function () {

    //GET ID
    describe('set player_id to LoginState', function () {
        it('should return object for the LoginState with the player_id', function(){
            let id = 123;

            const response = reducer(initialState, actions.getId(id));
            expect(response.id).to.eql(id);
        });
    });

    //UPDATE NAME
    describe('update name to LoginState', function () {
        it('should return object for the LoginState with the name not empty', function(){
            let name = 'test-name';

            const response = reducer(initialState, actions.updateName(name, false));
            expect(response.name).to.eql(name);
            expect(response.name_set).to.eql(false);
        });

        it('should return object for the LoginState with the name empty', function(){
            let name = '';

            const response = reducer(initialState, actions.updateName(name, true));
            expect(response.name).to.be.a('string');
            expect(response.name_set).to.eql(false);
        });
    });

    //SET NAME
    describe('set name to LoginState', function () {
        it('should return object for the LoginState with the name_set = true', function(){
            const response = reducer(initialState, actions.setName());
            expect(response.name_set).to.eql(true);
        });
    });

    //UPDATE ROOM
    describe('update room to LoginState', function () {
        it('should return object for the LoginState with the room not empty', function(){
            let room = 'test-room';

            const response = reducer(initialState, actions.updateRoom(room, false));
            expect(response.room).to.eql(room);
            expect(response.room_set).to.eql(false);
            expect(response.start).to.eql(false);
        });

        it('should return object for the LoginState with the room empty', function(){
            let room = '';

            const response = reducer(initialState, actions.updateRoom(room, true));
            expect(response.room).to.be.a('string');
            expect(response.room_set).to.eql(false);
            expect(response.start).to.eql(false);
        });
    });

    //SET ROOM
    describe('set room to LoginState', function () {
        it('should return object for the LoginState with the room_set = true', function(){
            const response = reducer(initialState, actions.setRoom());
            expect(response.room_set).to.eql(true);
        });
    });

    //GET ROOMS
    describe('get rooms to LoginState', function () {
        it('should return object for the LoginState with the rooms not empty', function(){
            let rooms = ['r1', 'r2', 'etc'];

            const response = reducer(initialState, actions.getRooms(rooms));
            expect(response.active_rooms).to.eql(rooms);
        });
    });

    //RESET ROOM
    describe('reset room to LoginState', function () {
        it('should return object for the LoginState with the room reset', function(){

            const response = reducer(initialState, actions.resetRoom());
            expect(response.room).to.eql(initialState.room);
            expect(response.room_set).to.eql(initialState.room_set);
            expect(response.start).to.eql(initialState.start);
        });
    });

    //URL LOGGING
    describe('url logging to LoginState', function () {
        it('should return object for the LoginState with name, room, name_set, room_set & logged', function(){
            let data = {
                name    : 'test-name',
                room    : 'test-room'
            }

            const response = reducer(initialState, actions.urlLogging(data.name, data.room));
            expect(response.name).to.eql(data.name);
            expect(response.room).to.eql(data.room);
            expect(response.name_set).to.eql(true);
            expect(response.room_set).to.eql(true);
            expect(response.logged).to.eql(true);
        });
    });

    //NEW OWNER
    describe('new owner to LoginState', function () {
        it('should return object for the LoginState with owner = null', function(){
            let state = [...initialState];
            state.owner = true;

            const response = reducer(state, actions.newOwner());
            expect(response.owner).to.eql(null);
        });
    });

    //GET ROOM OWNER
    describe('get room owner to LoginState', function () {
        it('should return object for the LoginState with owner = null', function(){
            let state = [...initialState];
            state.owner = true;

            const response = reducer(state, actions.getRoomOwner());
            expect(response.owner).to.eql(null);
        });
    });

    //GET OWNER
    describe('get owner to LoginState', function () {
        it('should return object for the LoginState with owner = true', function(){
            let owner = true;

            const response = reducer(initialState, actions.getOwner(owner, false));
            expect(response.owner).to.eql(owner);
        });
        it('should return object for the LoginState with owner = false', function(){
            let owner = false;

            const response = reducer(initialState, actions.getOwner(owner, false));
            expect(response.owner).to.eql(owner);
        });
    });

    //START
    describe('start to LoginState', function () {
        it('should return object for the LoginState with start = true', function(){
            const response = reducer(initialState, actions.start());
            expect(response.start).to.eql(true);
        });
    });

    //GET START
    describe('get start to LoginState', function () {
        it('should return object for the LoginState with start = true', function(){
            const response = reducer(initialState, actions.getStart());
            expect(response.start).to.eql(true);
        });
    });

    //RESTART
    describe('restart to LoginState', function () {
        it('should return object for the LoginState with reset fields && backToRoom = false', function(){
            let room = 'test-room';
            let backToRoom = false;

            let state = [...initialState];
            state.start = true;
            state.viewer = true;
            state.room = room;
            state.room_set = true


            const response = reducer(state, actions.restart(backToRoom));
            expect(response.start).to.eql(false);
            expect(response.viewer).to.eql(false);
            expect(response.room).to.eql(room);
            expect(response.room_set).to.eql(true);
        });

        it('should return object for the LoginState with reset fields && backToRoom = true', function(){
            let room = 'test-room';
            let backToRoom = true;

            let state = [...initialState];
            state.start = true;
            state.viewer = true;
            state.room = room;
            state.room_set = true


            const response = reducer(state, actions.restart(backToRoom));
            expect(response.start).to.eql(false);
            expect(response.viewer).to.eql(false);
            expect(response.room).to.eql('');
            expect(response.room_set).to.eql(false);
        });
    });

    //GET RESTART
    describe('get restart to LoginState', function () {
        it('should return object for the LoginState with reset fields && backToRoom = false', function(){
            let room = 'test-room';
            let backToRoom = false;

            let state = [...initialState];
            state.start = true;
            state.viewer = true;
            state.room = room;
            state.room_set = true


            const response = reducer(state, actions.getRestart(backToRoom));
            expect(response.start).to.eql(false);
            expect(response.viewer).to.eql(false);
            expect(response.room).to.eql(room);
            expect(response.room_set).to.eql(true);
        });

        it('should return object for the LoginState with reset fields && backToRoom = true', function(){
            let room = 'test-room';
            let backToRoom = true;

            let state = [...initialState];
            state.start = true;
            state.viewer = true;
            state.room = room;
            state.room_set = true


            const response = reducer(state, actions.getRestart(backToRoom));
            expect(response.start).to.eql(false);
            expect(response.viewer).to.eql(false);
            expect(response.room).to.eql('');
            expect(response.room_set).to.eql(false);
        });
    });
});