const Room = require('./Room.js');

const LOGIN_ACTIONS = {
    UPDATE_NAME   : 'LOGIN_UPDATE_NAME',
    UPDATE_ROOM   : 'LOGIN_UPDATE_ROOM',
    URL_LOGGING   : 'LOGIN_URL_LOGGING',
    START         : 'LOGIN_START',
    SET_ROOM      : 'LOGIN_SET_ROOM',
    GET_START     : 'LOGIN_GET_START',
    GET_ROOMS     : 'LOGIN_GET_ROOMS',
    GET_OWNER     : 'LOGIN_GET_OWNER',
    GET_RESTART   : 'LOGIN_GET_RESTART'
};

const BOARD_ACTIONS = {
    RESET       : 'BOARD_RESET',
    NEXT_PIECES : 'BOARD_NEXT_PIECES',
    NEW_PIECES  : 'BOARD_NEW_PIECES',
    UPDATE      : 'BOARD_UPDATE',
    GET_UPDATE  : 'BOARD_GET_UPDATE',
    REMOVE_LINE : 'BOARD_REMOVE_LINE',
    OVER_LINE   : 'BOARD_OVER_LINE'
};

const TYPES = {
    GAME    : 'game',
    PLAYER  : 'player'
};

let _rooms = {
    collection      : {},

    getRoom         : (type, name, socket=null) => {
        let _this = _rooms;
        if (_this.collection[type] && _this.collection[type][name]){
            return _this.collection[type][name];
        }

        if (socket){
            let room = new Room({ type, name, socket });
            _this.pushRoom(room);
            return room;
        }

        return null;
    },

    pushRoom        : (room) => {
        let _this = _rooms;

        if (!_this.collection[room.type]){
            _this.collection[room.type] = {};
        }

        _this.collection[room.type][room.name] = room;
    },

    deleteRoom      : (room) => {
        let _this = _rooms;

        if (_this.collection[room.type] && _this.collection[room.type][room.name]){
            delete _this.collection[room.type][room.name];
        }
    },

    getSocketRooms  : (socket) => {
        let _this = _rooms;
        let data = [];

        for (let i in _this.collection){
            let rooms = _this.collection[i];

            for (let j in rooms){
                if (rooms[j].isClient(socket)){
                    data.push(rooms[j]);
                }
            }
        }

        return data;
    },

    getSocketRoomsByType    : (socket, type) => {
        let _this = _rooms;
        let data = [];

        let socketRooms = _this.getSocketRooms(socket);

        for (let i in socketRooms){
            if (socketRooms[i].type === type){
                data.push(socketRooms[i]);
            }
        }

        return data;
    }
};


function joinRoom(socket, room) {
    room.pushClient(socket);
    socket.join(room.label);
};

function leaveRoom(socket, room) {
    room.removeClient(socket);
    socket.leave(room.label);

    if (!room.clients.length){
        _rooms.deleteRoom(room);
    }
};

function getOpenGameRooms() {

    let openGameRooms = [];
    let gameRooms = _rooms.collection.game;

    if (gameRooms){
        for (let i in gameRooms){
            if (gameRooms[i].active){
                openGameRooms.push(gameRooms[i].light);
            }
        }
    }

    return openGameRooms;
};


exports.socketLeave = (socket) => {
    let rooms = _rooms.getSocketRooms(socket);

    for (let i in rooms){
        leaveRoom(socket, rooms[i]);
    }
};

exports.getPlayerRoom = (name, socket=null) => {
    let type = TYPES.PLAYER;
    let room = _rooms.getRoom(type, name, socket);

    return room;
};

exports.joinPlayerRoom = (socket, name) => {
    let rooms = _rooms.getSocketRoomsByType(socket, TYPES.PLAYER);
    for (let i in rooms){
        leaveRoom(socket, rooms[i]);
    }

    let room = this.getPlayerRoom(name, socket);
    joinRoom(socket, room);

    return room;
};

exports.getGameRoom = (name, socket=null) => {
    let type = TYPES.GAME;
    let room = _rooms.getRoom(type, name, socket);

    return room;
};

exports.joinGameRoom = (socket, name) => {
    let rooms = _rooms.getSocketRoomsByType(socket, TYPES.GAME);
    for (let i in rooms){
        leaveRoom(socket, rooms[i]);
    }

    let room = this.getGameRoom(name, socket);
    joinRoom(socket, room);

    return room;
};

exports.leaveGameRoom = (socket) => {
    let rooms = _rooms.getSocketRoomsByType(socket, TYPES.GAME);
    for (let i in rooms){
        leaveRoom(socket, rooms[i]);
    }

    return;
};


exports.getGameRooms = () => {

    return {
        type    : LOGIN_ACTIONS.GET_ROOMS,
        rooms   : getOpenGameRooms()
    };
};

exports.roomOwner = (socket, gameRoom) => {

    let owner = gameRoom.isOwner(socket);

    return {
        type    : LOGIN_ACTIONS.GET_OWNER,
        owner   : owner,
        started : gameRoom.start
    };
};

exports.startGame = (gameRoom) => {
    gameRoom.setStart();

    return {
        type    : LOGIN_ACTIONS.GET_START
    };
};

exports.restart = (gameRoom) => {
    gameRoom.restart();

    return {
        type    : LOGIN_ACTIONS.GET_RESTART
    };
};

exports.resetBoard = () => {
    return {
        type    : BOARD_ACTIONS.RESET
    };
};