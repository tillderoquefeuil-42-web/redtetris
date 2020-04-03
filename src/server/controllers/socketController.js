const socketServer = require('socket.io');

const library = require('./lib.js');

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
            let gameRoom = library.leaveGameRoom(socket);
            if (gameRoom) {
                io.sockets.in(gameRoom.label).emit('ACTION', library.newRoomOwner());
            }

            library.leavePlayerRoom(socket);
        });

        socket.on(ACTIONS.LOGIN.SET_NAME, (data) => {
            let playerRoom = library.getPlayerRoom(socket);
            let player = library.updatePlayer({ player:playerRoom }, data);
            
            if (playerRoom){
                if (player){
                    io.sockets.in(playerRoom.label).emit('ACTION', library.sendPlayerId(player));
                }
                io.sockets.in(playerRoom.label).emit('ACTION', library.getGames());
            }
        });

        socket.on(ACTIONS.LOGIN.SET_ROOM, (data) => {
            let rooms = library.joinGameRoom(socket, data);

            library.updatePlayer(rooms, data);

            if (rooms.player && rooms.game){
                io.sockets.in(rooms.player.label).emit('ACTION', library.roomOwner(rooms));
                io.sockets.in(rooms.game.label).emit('ACTION', library.getGamePlayers(rooms));
            }
        });

        socket.on(ACTIONS.LOGIN.URL_LOGGING, (data) => {
            let playerRoom = library.getPlayerRoom(socket);
            let player = library.updatePlayer({ player:playerRoom }, data);

            let rooms = library.joinGameRoom(socket, data);

            player = library.updatePlayer(rooms, data);

            if (player && rooms.player){
                io.sockets.in(rooms.player.label).emit('ACTION', library.sendPlayerId(player));
            }

            if (rooms.player && rooms.game){
                io.sockets.in(rooms.player.label).emit('ACTION', library.roomOwner(rooms));
                io.sockets.in(rooms.game.label).emit('ACTION', library.getGamePlayers(rooms));
            }
        });

        socket.on(ACTIONS.LOGIN.GET_ROOM_OWNER, () => {
            let rooms = library.getRooms(socket);

            if (rooms.player && rooms.game){
                io.sockets.in(rooms.player.label).emit('ACTION', library.roomOwner(rooms));
            }
        });

        socket.on(ACTIONS.BOARD.SET_HARDMODE, (data) => {
            let rooms = library.getRooms(socket);

            if (rooms.game){
                io.sockets.in(rooms.game.label).emit('ACTION', library.setHardmode(rooms, data));
            }
        });

        socket.on(ACTIONS.LOGIN.RESET_ROOM, () => {
            let rooms = library.getRooms(socket);
            
            let gameRoom = library.leaveGameRoom(socket);
            
            // NEW OWNER
            if (gameRoom) {
                io.sockets.in(gameRoom.label).emit('ACTION', library.newRoomOwner());
            }
            
            // MAJ GAME PLAYERS
            if (rooms.game && rooms.game.clients.length > 0){
                io.sockets.in(rooms.game.label).emit('ACTION', library.getGamePlayers(rooms));
            }

            // GET AVAILABLE GAMES
            if (rooms.player){
                io.sockets.in(rooms.player.label).emit('ACTION', library.getGames());
            }

        });

        socket.on(ACTIONS.LOGIN.START, () => {
            let rooms = library.getOwnerGameRoom(socket);

            if (rooms && rooms.game){
                io.sockets.in(rooms.game.label).emit('ACTION', library.startGame(rooms));
                io.sockets.in(rooms.game.label).emit('ACTION', library.getPiecesSet(rooms, 0));
                io.sockets.in(rooms.game.label).emit('ACTION', library.getGamePlayers(rooms));

            }
        });

        socket.on(ACTIONS.LOGIN.RESTART, (data) => {
            let [rooms, player, game] = library.getRoomsAndAssets(socket);

            if (!rooms.game){
                return;
            }

            if (library.isOwner(game, player) && !data.back_to_room){
                library.restartPlayerBoards(game);

                io.sockets.in(rooms.game.label).emit('ACTION', library.restart(game));
                io.sockets.in(rooms.game.label).emit('ACTION', library.resetBoard());

            } else if (data.back_to_room){

                let gameRoom = library.leaveGameRoom(socket);
            
                // NEW OWNER
                if (gameRoom) {
                    io.sockets.in(gameRoom.label).emit('ACTION', library.newRoomOwner());
                }
                // MAJ GAME PLAYERS
                if (rooms.game && rooms.game.clients.length > 0){
                    io.sockets.in(rooms.game.label).emit('ACTION', library.getGamePlayers(rooms));
                }
                // GET AVAILABLE GAMES
                if (rooms.player){
                    io.sockets.in(rooms.player.label).emit('ACTION', library.getGames());
                    io.sockets.in(rooms.player.label).emit('ACTION', library.resetBoard());
                }
            }
        });

        socket.on(ACTIONS.BOARD.NEW_PIECES, (data) => {
            let rooms = library.getRooms(socket);

            if (rooms.game){
                io.sockets.in(rooms.game.label).emit('ACTION', library.getPiecesSet(rooms, data.board.index));
            }
        });

        socket.on(ACTIONS.BOARD.UPDATE, (data) => {
            let rooms = library.getRooms(socket);

            library.updatePlayer(rooms, data);
            if (rooms.game){
                io.sockets.in(rooms.game.label).emit('ACTION', library.getGamePlayers(rooms));
            }
        });

        socket.on(ACTIONS.BOARD.REMOVE_LINE, (data) => {
            let rooms = library.getRooms(socket);

            if (rooms.game){
                io.sockets.in(rooms.game.label).emit('ACTION', library.addLines(rooms, data));
            }
        });

    });

};
