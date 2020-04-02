const Room = require('./Room.js');

const TYPES = {
    GAME    : 'game',
    PLAYER  : 'player'
};

let _rooms = {
    collection      : {},

    createRoom              : (type, socket=null) => {
        let _this = _rooms;

        let room = new Room({ type, socket });
        _this.pushRoom(room);
        return room;
    },

    pushRoom                : (room) => {
        let _this = _rooms;

        if (!_this.collection[room.type]){
            _this.collection[room.type] = {};
        }

        _this.collection[room.type][room.id] = room;
    },

    deleteRoom              : (room) => {
        let _this = _rooms;

        if (_this.collection[room.type] && _this.collection[room.type][room.id]){
            delete _this.collection[room.type][room.id];
        }
    },

    getRoomById             : (id) => {
        let _this = _rooms;

        for (let i in _this.collection){
            let rooms = _this.collection[i];

            if (rooms && rooms[id]){
                return rooms[id];
            }
        }
    },

    getSocketRooms          : (socket) => {
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

function leaveRoomsByType(socket, type) {
    let rooms = _rooms.getSocketRoomsByType(socket, type);

    for (let i in rooms){
        leaveRoom(socket, rooms[i]);
    }
}

function getRoomByType(socket, type) {
    let rooms = _rooms.getSocketRoomsByType(socket, type);

    if (rooms && rooms.length > 0){
        return rooms[0];
    }

    let room = _rooms.createRoom(type, socket);
    joinRoom(socket, room);

    return room;
};


//GET ALL ROOMS
exports.getRoomsByTypeForSocket = (socket) => {

    let rooms = {};

    rooms[TYPES.PLAYER] = _rooms.getSocketRoomsByType(socket, TYPES.PLAYER)[0];
    rooms[TYPES.GAME] = _rooms.getSocketRoomsByType(socket, TYPES.GAME)[0];

    return rooms;
};

//LEAVE ONE ROOM
exports.leaveOneRoom = (socket, room) => {
    if (room){
        leaveRoom(socket, room);
    }
};


//LEAVE ALL ROOMS

exports.socketLeave = (socket) => {
    let rooms = _rooms.getSocketRooms(socket);

    for (let i in rooms){
        leaveRoom(socket, rooms[i]);
    }

    return;
};

//PLAYER ROOM

exports.getPlayerRoom = (socket) => {
    let type = TYPES.PLAYER;
    return getRoomByType(socket, type);
};

// GAME ROOM

exports.getGameRoom = (socket) => {
    let type = TYPES.GAME;
    return getRoomByType(socket, type);
};

exports.joinGameRoom = (socket, roomId) => {
    leaveRoomsByType(socket, TYPES.GAME);

    let room = _rooms.getRoomById(roomId);

    if (room) {
        joinRoom(socket, room);
        return room;
    }

    return null;
};

exports.leaveGameRoom = (socket) => {
    leaveRoomsByType(socket, TYPES.GAME);
};

exports.getRoomByAssetId = (type, assetId) => {
    let c = _rooms.collection[type];

    for (let i in c){
        if (c[i].assetId === assetId){
            return c[i];
        }
    }

    return null;
}