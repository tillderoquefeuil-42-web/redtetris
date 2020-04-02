const Room = require('./Room.js');

const ACTIONS = require('../stateActions.js');

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

    return room;
};

function leaveRoom(socket, room) {
    
    room.removeClient(socket);
    socket.leave(room.label);
    
    if (!room.clients.length){
        _rooms.deleteRoom(room);
        return null;
    }

    return room;
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
    let newOwners = [];

    for (let i in rooms){

        let room = rooms[i];
        let owner = room.owner;

        room = leaveRoom(socket, room);

        if (room && owner != room.owner) {
            newOwners.push(room);
        }
    }

    return newOwners;
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
    room = joinRoom(socket, room);

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
        type    : ACTIONS.LOGIN.GET_ROOMS,
        rooms   : getOpenGameRooms()
    };
};

exports.roomOwner = (socket, gameRoom) => {

    let owner = gameRoom.isOwner(socket);

    return {
        type    : ACTIONS.LOGIN.GET_OWNER,
        owner   : owner,
        started : gameRoom.start
    };
};

exports.newRoomOwner = () => {
    return {
        type    : ACTIONS.LOGIN.NEW_OWNER
    };
}

exports.startGame = (gameRoom) => {
    gameRoom.setStart();

    return {
        type    : ACTIONS.LOGIN.GET_START
    };
};

exports.restart = (gameRoom) => {
    gameRoom.restart();

    return {
        type    : ACTIONS.LOGIN.GET_RESTART
    };
};

exports.nameAvailable = (name) => {
    let type = TYPES.PLAYER;
    let available = (_rooms.getRoom(type, name)? false : true);

    return {
        type        : ACTIONS.LOGIN.NAME_AVAILABLE,
        available   : available
    };
}

exports.resetBoard = () => {
    return {
        type    : ACTIONS.BOARD.RESET
    };
};