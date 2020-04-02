const socketServer = require('socket.io');

const lib = {
    pieces  : require('./pieces/lib.js'),
    rooms   : require('./rooms/lib.js'),
    players : require('./players/lib.js')
};

const ACTIONS = require('./stateActions.js');

// SOCKET EMISSION
// io.sockets.in(<room>).emit('ACTION', <data>);
// where 
// (String) <room> is the room name
// (Object) <data> has minimum a prop `type`

module.exports = function (app, server) {

    let io = socketServer(server, {
        pingTimeout : 60000
    });

    let connections = [];
    io.on('connection', function (socket) {
        connections.push(socket);

        socket.on('disconnect', () => {
            let rooms = lib.rooms.socketLeave(socket);

            for (let i in rooms){
                let room = rooms[i];
                io.sockets.in(room.label).emit('ACTION', lib.rooms.newRoomOwner());
            }

            lib.players.delete(socket);
        });

        socket.on(ACTIONS.LOGIN.SET_NAME, (data) => {
            let playerRoom = lib.rooms.joinPlayerRoom(socket, data.login.name);

            if (playerRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.getGameRooms());
            }
        });

        socket.on(ACTIONS.LOGIN.SET_ROOM, (data) => {

            let playerRoom = lib.rooms.getPlayerRoom(data.login.name);
            let gameRoom = lib.rooms.joinGameRoom(socket, data.login.room);

            let player = lib.players.updatePlayer(socket, playerRoom, gameRoom);
            if (player && playerRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.players.getPlayerId(player));
            }


            if (playerRoom && gameRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.roomOwner(socket, gameRoom));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(ACTIONS.LOGIN.URL_LOGGING, (data) => {

            let playerRoom = lib.rooms.joinPlayerRoom(socket, data.login.name);
            let gameRoom = lib.rooms.joinGameRoom(socket, data.login.room);

            let player = lib.players.updatePlayer(socket, playerRoom, gameRoom);
            if (player && playerRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.players.getPlayerId(player));
            }


            if (playerRoom && gameRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.roomOwner(socket, gameRoom));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(ACTIONS.LOGIN.GET_ROOM_OWNER, (data) => {

            let playerRoom = lib.rooms.getPlayerRoom(data.login.name, socket);
            let gameRoom = lib.rooms.getGameRoom(data.login.room, socket);

            if (playerRoom && gameRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.roomOwner(socket, gameRoom));
            }
        });

        socket.on(ACTIONS.LOGIN.RESET_ROOM, (data) => {

            let gameRoom = lib.rooms.getGameRoom(data.login.room);
            let isOwner = gameRoom? gameRoom.isOwner(socket) : null;

            lib.rooms.leaveGameRoom(socket);
            lib.players.leaveGameRoom(socket);
            
            if (gameRoom){
                if (isOwner){
                    io.sockets.in(gameRoom.label).emit('ACTION', lib.rooms.newRoomOwner());
                }
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }

            let playerRoom = lib.rooms.getPlayerRoom(data.login.name);
            if (playerRoom){
                io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.getGameRooms());
            }

        });

        socket.on(ACTIONS.LOGIN.START, (data) => {
            let gameRoom = lib.rooms.getGameRoom(data.login.room);
            if (gameRoom && gameRoom.isOwner(socket)){
                io.sockets.in(gameRoom.label).emit('ACTION', lib.rooms.startGame(gameRoom));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.pieces.getPiecesSet(gameRoom.gameLabel, 0));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(ACTIONS.LOGIN.RESTART, (data) => {
            let gameRoom = lib.rooms.getGameRoom(data.login.room);

            if (gameRoom && gameRoom.isOwner(socket) && !data.back_to_room){
                lib.players.restartPlayers(gameRoom);
                io.sockets.in(gameRoom.label).emit('ACTION', lib.rooms.restart(gameRoom));
                io.sockets.in(gameRoom.label).emit('ACTION', lib.rooms.resetBoard());
            } else if (gameRoom && data.back_to_room){
                let isOwner = gameRoom.isOwner(socket);

                lib.players.restartOnePlayer(socket);
                lib.rooms.leaveGameRoom(socket);

                if (isOwner){
                    io.sockets.in(gameRoom.label).emit('ACTION', lib.rooms.newRoomOwner());
                }

                let playerRoom = lib.rooms.getPlayerRoom(data.login.name);
                if (playerRoom){
                    io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.getGameRooms());
                    io.sockets.in(playerRoom.label).emit('ACTION', lib.rooms.resetBoard());
                }    
            }
        });

        socket.on(ACTIONS.BOARD.NEW_PIECES, (data) => {
            let gameRoom = lib.rooms.getGameRoom(data.login.room);

            if (gameRoom){
                io.sockets.in(gameRoom.label).emit('ACTION', lib.pieces.getPiecesSet(gameRoom.label, data.board.index));
            }
        });

        socket.on(ACTIONS.BOARD.UPDATE, (data) => {
            let playerRoom = lib.rooms.getPlayerRoom(data.login.name);
            let gameRoom = lib.rooms.getGameRoom(data.login.room);

            if (gameRoom){
                lib.players.updatePlayer(socket, playerRoom, gameRoom, data.board);
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.getGamePlayers(gameRoom));
            }
        });

        socket.on(ACTIONS.BOARD.REMOVE_LINE, (data) => {
            let gameRoom = lib.rooms.getGameRoom(data.login.room);

            if (gameRoom){
                io.sockets.in(gameRoom.label).emit('ACTION', lib.players.addLine(socket, gameRoom, data.board.lines));
            }
        });

    });

};
