const Room = require('./Room.js');

const LOGIN_ACTIONS = {
    UPDATE_NAME   : 'LOGIN_UPDATE_NAME',
    UPDATE_ROOM   : 'LOGIN_UPDATE_ROOM',
    PLAYER_LOGGED : 'LOGIN_PLAYER_LOGGED',
    URL_LOGGING   : 'LOGIN_URL_LOGGING',
    START         : 'LOGIN_START',
    GET_START     : 'LOGIN_GET_START',
    GET_ROOMS     : 'LOGIN_GET_ROOMS',
    GET_OWNER     : 'LOGIN_GET_OWNER'
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
    }
};


function joinRoom(socket, room) {
    room.pushClient(socket);
    socket.join(room.label);
};

function leaveRoom(socket, room) {
    room.removeClient(socket);
    socket.leave(room.label);
};

function getOpenGameRooms() {

    let openGameRooms = [];
    let gameRooms = _rooms.collection.game;

    if (gameRooms){
        for (let i in gameRooms){
            if (gameRooms[i].active && !gameRooms[i].start){
                openGameRooms.push(gameRooms[i]);
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
    let type = 'player';
    let room = _rooms.getRoom(type, name, socket);

    return room;
};

exports.joinPlayerRoom = (socket, name) => {
    let room = this.getPlayerRoom(name, socket);
    joinRoom(socket, room);

    return room;
};

exports.getGameRoom = (name, socket=null) => {
    let type = 'game';
    let room = _rooms.getRoom(type, name, socket);

    return room;
};

exports.joinGameRoom = (socket, name) => {
    let room = this.getGameRoom(name, socket);
    joinRoom(socket, room);

    return room;
};


exports.getGameRooms = () => {

    let rooms = getOpenGameRooms();
    let results = [];

    for (let i in rooms){
        results.push(rooms[i].name);
    }

    return {
        type    : LOGIN_ACTIONS.GET_ROOMS,
        rooms   : results
    };
};

exports.roomOwner = (socket, gameRoom) => {

    let owner = gameRoom.isOwner(socket);

    return {
        type    : LOGIN_ACTIONS.GET_OWNER,
        owner   : owner
    };
};

exports.startGame = () => {
    return {
        type    : LOGIN_ACTIONS.GET_START
    };
}