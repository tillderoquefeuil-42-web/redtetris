const socketServer = require('socket.io');

const pieces = require('./pieces/lib.js');

const LOGIN_ACTIONS = {
    UPDATE_NAME   : 'LOGIN_UPDATE_NAME',
    UPDATE_ROOM   : 'LOGIN_UPDATE_ROOM',
    PLAYER_LOGGED : 'LOGIN_PLAYER_LOGGED',
    URL_LOGGING   : 'LOGIN_URL_LOGGING',
    START         : 'LOGIN_START'
};

const BOARD_ACTIONS = {
    NEXT_PIECES : 'BOARD_NEXT_PIECES',
    NEW_PIECES  : 'BOARD_NEW_PIECES',
    REMOVE_LINE : 'BOARD_REMOVE_LINE',
    DROP_PIECE  : 'BOARD_UPDATE'
};


const rooms = {
    // GENERIC
    getRoomName : function(base, id){
        return base + '_' + id;
    },

    joinRoom        : function(socket, roomName){
        socket.join(roomName);
    },

    leaveRoom       : function(socket, roomName){
        socket.leave(roomName);
    },

    // SPECIFIC
    getPlayerRoom   : function(player){
        return this.getRoomName('player', player);
    },

    joinPlayerRoom  : function(socket, player){
        let roomName = this.getPlayerRoom(player)
        this.joinRoom(socket, roomName);
    },

    getGameRoom   : function(game){
        return this.getRoomName('game', game);
    },

    joinGameRoom  : function(socket, game){
        let roomName = this.getGameRoom(game)
        this.joinRoom(socket, roomName);
    }
};

// SOCKET EMISSION
// io.sockets.in(<room>).emit('ACTION', <data>);
// where 
// (String) <room> is the room name
// (Object) <data> has minimum a prop `type`

module.exports = function (app, server) {

    let io = socketServer.listen(server);

    let connections = [];
    io.on('connection', function (socket) {
        console.log(`connected to socket! (${socket.id})`);

        connections.push(socket);

        socket.on('disconnect', () => {
            console.log(`disconnected (${socket.id})`);
        });

        socket.on(LOGIN_ACTIONS.UPDATE_NAME, (data) => {
            console.log('UPDATE_NAME');
            rooms.joinPlayerRoom(socket, data.login.name);
        });
        
        socket.on(LOGIN_ACTIONS.UPDATE_ROOM, (data) => {
            console.log('UPDATE_ROOM');
            rooms.joinGameRoom(socket, data.login.room);
        });
        
        socket.on(LOGIN_ACTIONS.URL_LOGGING, (data) => {
            console.log('URL_LOGGING');
            rooms.joinPlayerRoom(socket, data.login.name);
            rooms.joinGameRoom(socket, data.login.room);
        });

        socket.on(LOGIN_ACTIONS.START, (data) => {
            console.log('START');
            let gameRoom = rooms.getGameRoom(data.login.room);

            io.sockets.in(gameRoom).emit('ACTION', pieces.getPiecesSet(gameRoom, 0));
        });

        socket.on(BOARD_ACTIONS.NEW_PIECES, (data) => {
            console.log('NEW_PIECES', data.board.index);
            let gameRoom = rooms.getGameRoom(data.login.room);

            io.sockets.in(gameRoom).emit('ACTION', pieces.getPiecesSet(gameRoom, data.board.index));
        });

    });

};
