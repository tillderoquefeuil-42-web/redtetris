import { expect } from 'chai';

import ActionTypes from '../../src/client/constants/ActionTypes';

import * as actions from '../../src/client/actions/login';

describe('Login Actions', function () {

    const login = {
        name        : 'test-name',
        room        : 'test-room'
    };

    //UPDATE NAME
    describe('#updateName()', function () {
        it('should return object for the updateNameAction with force = false', function(){
            let force = false;

            let response = actions.updateName(login.name, force);
		    expect(response).to.eql({
                type        : ActionTypes.LOGIN.UPDATE_NAME,
                login_name  : login.name,
                login_force : force
            });
        });

        it('should return object for the updateNameAction with force = true', function(){
            let force = true;

            let response = actions.updateName(login.name, force);
		    expect(response).to.eql({
                type        : ActionTypes.LOGIN.UPDATE_NAME,
                login_name  : login.name,
                login_force : force
            });
        });
    });

    //SET NAME
    describe('#setName()', function () {
        it('should return object for the setNameAction', function(){
            
            const response = actions.setName();
		    expect(response).to.eql({
                type    : ActionTypes.LOGIN.SET_NAME
            });
        });
    });

    //UPDATE ROOM
    describe('#updateRoom()', function () {
        it('should return object for the updateRoomAction with force = false', function(){
            let force = false;

            let response = actions.updateRoom(login.room, force);
            expect(response).to.eql({
                type        : ActionTypes.LOGIN.UPDATE_ROOM,
                login_room  : login.room,
                login_force : force
            });
        });

        it('should return object for the updateRoomAction with force = true', function(){
            let force = true;

            let response = actions.updateRoom(login.room, force);
            expect(response).to.eql({
                type        : ActionTypes.LOGIN.UPDATE_ROOM,
                login_room  : login.room,
                login_force : force
            });
        });
    });

    // SET ROOM
    describe('#setRoom()', function () {
        it('should return object for the setRoomAction', function(){

            const response = actions.setRoom();
		    expect(response).to.eql({
                type    : ActionTypes.LOGIN.SET_ROOM
            });
        });
    });

    // RESET ROOM
    describe('#resetRoom()', function () {
        it('should return object for the resetRoomAction', function(){

            const response = actions.resetRoom();
		    expect(response).to.eql({
                type    : ActionTypes.LOGIN.RESET_ROOM
            });
        });
    });

    //URL LOGGING
    describe('#urlLogging()', function () {
        it('should return object for the urlLoggingAction', function(){

            let response = actions.urlLogging(login.name, login.room);
            expect(response).to.eql({
                type    : ActionTypes.LOGIN.URL_LOGGING,
                data    : {
                    name    : login.name,
                    room    : login.room
                }
            });
        });
    });

    //GET ROOM OWNER
    describe('#getRoomOwner()', function () {
        it('should return object for the getRoomOwnerAction', function(){

            let response = actions.getRoomOwner();
            expect(response).to.eql({
                type    : ActionTypes.LOGIN.GET_ROOM_OWNER
            });
        });
    });

    //START
    describe('#start()', function () {
        it('should return object for the startAction', function(){

            let response = actions.start();
            expect(response).to.eql({
                type    : ActionTypes.LOGIN.START
            });
        });
    });

    //RESTART
    describe('#restart()', function () {
        it('should return object for the restartAction with backToRoom = false', function(){
            let backToRoom = false;

            let response = actions.restart(backToRoom);
            expect(response).to.eql({
                type            : ActionTypes.LOGIN.RESTART,
                back_to_room    : backToRoom
            });
        });

        it('should return object for the restartAction with backToRoom = true', function(){
            let backToRoom = true;

            let response = actions.restart(backToRoom);
            expect(response).to.eql({
                type            : ActionTypes.LOGIN.RESTART,
                back_to_room    : backToRoom
            });
        });
    });

    //GET ID
    describe('#getId()', function () {
        it('should return object for the getIdAction', function(){
            let id = 123;

            let response = actions.getId(id);
            expect(response).to.eql({
                type        : ActionTypes.LOGIN.GET_ID,
                player_id   : id
            });
        });
    });

    //GET ROOMS
    describe('#getRooms()', function () {
        it('should return object for the getRoomsAction', function(){
            let rooms = ['r1', 'r2', 'etc'];

            let response = actions.getRooms(rooms);
            expect(response).to.eql({
                type    : ActionTypes.LOGIN.GET_ROOMS,
                rooms   : rooms
            });
        });
    });

    //NEW OWNER
    describe('#newOwner()', function () {
        it('should return object for the newOwnerAction', function(){

            let response = actions.newOwner();
            expect(response).to.eql({
                type    : ActionTypes.LOGIN.NEW_OWNER
            });
        });
    });

    //GET OWNER
    describe('#getOwner()', function () {
        it('should return object for the getOwnerAction', function(){
            let owner = true;
            let started = false;

            let response = actions.getOwner(owner, started);
            expect(response).to.eql({
                type    : ActionTypes.LOGIN.GET_OWNER,
                owner   : owner,
                started : started
            });
        });
    });

    //GET START
    describe('#getStart()', function () {
        it('should return object for the getStartAction', function(){

            let response = actions.getStart();
            expect(response).to.eql({
                type    : ActionTypes.LOGIN.GET_START
            });
        });
    });

    //GET RESTART
    describe('#getRestart()', function () {
        it('should return object for the getRestartAction with backToRoom = false', function(){
            let backToRoom = false;

            let response = actions.getRestart(backToRoom);
            expect(response).to.eql({
                type            : ActionTypes.LOGIN.GET_RESTART,
                back_to_room    : backToRoom
            });
        });

        it('should return object for the getRestartAction with backToRoom = true', function(){
            let backToRoom = true;

            let response = actions.getRestart(backToRoom);
            expect(response).to.eql({
                type            : ActionTypes.LOGIN.GET_RESTART,
                back_to_room    : backToRoom
            });
        });
    });

});