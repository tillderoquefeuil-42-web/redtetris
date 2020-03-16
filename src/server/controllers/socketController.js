const socketServer = require('socket.io');

const lib = {
    pieces  : require('./pieces/lib.js'),
    rooms   : require('./rooms/lib.js'),
    players : require('./players/lib.js')
};

const LOGIN_ACTIONS = {
    UPDATE_NAME   : 'LOGIN_UPDATE_NAME',
    UPDATE_ROOM   : 'LOGIN_UPDATE_ROOM',
    SET_NAME      : 'LOGIN_SET_NAME',
    SET_ROOM      : 'LOGIN_SET_ROOM',
    RESET_ROOM    : 'LOGIN_RESET_ROOM',
    URL_LOGGING   : 'LOGIN_URL_LOGGING',
    START         : 'LOGIN_START'
};

const BOARD_ACTIONS = {
    NEXT_PIECES : 'BOARD_NEXT_PIECES',
    NEW_PIECES  : 'BOARD_NEW_PIECES',
    REMOVE_LINE : 'BOARD_REMOVE_LINE',
    UPDATE      : 'BOARD_UPDATE',
    GET_UPDATE  : 'BOARD_GET_UPDATE'
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
        connections.push(socket);

        socket.on('disconnect', () => {
            lib.rooms.socketLeave(socket);
            lib.players.delete(socket);
        });

        socket.on(LOGIN_ACTIONS.SET_NAME, (data) => {
            let playerRoom = lib.rooms.joinPlayerRoom(socket, data.login.name);

            if (playerRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.getGameRooms());
            }
        });

        socket.on(LOGIN_ACTIONS.SET_ROOM, (data) => {
            let playerRoom = lib.rooms.getPlayerRoom(data.login.name);
            let gameRoom = lib.rooms.joinGameRoom(socket, data.login.room);
            lib.players.updatePlayer(socket, playerRoom, gameRoom);

            if (playerRoom && gameRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.roomOwner(socket, gameRoom));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(LOGIN_ACTIONS.URL_LOGGING, (data) => {
            let playerRoom = lib.rooms.joinPlayerRoom(socket, data.login.name);
            let gameRoom = lib.rooms.joinGameRoom(socket, data.login.room);

            lib.players.updatePlayer(socket, playerRoom, gameRoom);

            if (playerRoom && gameRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.roomOwner(socket, gameRoom));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(LOGIN_ACTIONS.RESET_ROOM, (data) => {
            lib.rooms.leaveGameRoom(socket);
            lib.players.leaveGameRoom(socket);

            let gameRoom = lib.rooms.getGameRoom(data.login.room);
            if (gameRoom){
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(LOGIN_ACTIONS.START, (data) => {
            let gameRoom = lib.rooms.getGameRoom(data.login.room);
            if (gameRoom && gameRoom.isOwner(socket)){
                io.sockets.in(gameRoom.label).emit('ACTION', lib.rooms.resetBoard());
                io.sockets.in(gameRoom.label).emit('ACTION', lib.rooms.startGame(gameRoom));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.pieces.getPiecesSet(gameRoom.label, 0));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(BOARD_ACTIONS.NEW_PIECES, (data) => {
            let gameRoom = lib.rooms.getGameRoom(data.login.room);

            if (gameRoom){
                io.sockets.in(gameRoom.label).emit('ACTION', lib.pieces.getPiecesSet(gameRoom.label, data.board.index));
            }
        });

        socket.on(BOARD_ACTIONS.UPDATE, (data) => {
            let playerRoom = lib.rooms.getPlayerRoom(data.login.name);
            let gameRoom = lib.rooms.getGameRoom(data.login.room);

            if (gameRoom){
                lib.players.updatePlayer(socket, playerRoom, gameRoom, data.board);
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(BOARD_ACTIONS.REMOVE_LINE, (data) => {
            let gameRoom = lib.rooms.getGameRoom(data.login.room);

            if (gameRoom){
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.addLine(socket, gameRoom, data.board.lines));
            }
        });

    });

};
