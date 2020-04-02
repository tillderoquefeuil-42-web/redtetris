const Player = require('./Player.js');

const ACTIONS = require('../stateActions.js');

let _players = {
    collection  : {},

    pushPlayer      : (player) => {
        let _this = _players;

        _this.collection[player.id] = player;
    },

    getById         : (socket) => {
        let _this = _players;

        return _this.collection[socket.id];
    },

    deletePlayer    : (player) => {
        let _this = _players;

        if (_this.collection[player.id]){
            delete _this.collection[player.id];
        }
    },

};


function addPlayer(socket, playerRoom, gameRoom) {
    player = new Player({ socket, name:playerRoom.name, gameRoom });
    _players.pushPlayer(player);

    return player;
};


exports.updatePlayer = (socket, playerRoom, gameRoom, board) => {

    let player = _players.getById(socket);

    if (!player){
        return addPlayer(socket, playerRoom, gameRoom);
    }

    player.setName(playerRoom.name);
    player.setGameRoom(gameRoom);
    player.updateBoard(board);

    return player;
};


exports.restartPlayers = (gameRoom) => {

    let clients = gameRoom.clients;

    for (let i in clients){
        let player = _players.collection[clients[i]];
        
        if (player){
            player.restart();
        }
    }
};

exports.restartOnePlayer = (socket) => {
    let player = _players.getById(socket);

    if (player){
        player.restart();
    }
};

exports.leaveGameRoom = (socket) => {
    let player = _players.getById(socket);

    if (player){
        player.setGameRoom(null);
    }

    return player;
};

exports.delete = (socket) => {
    let player = _players.getById(socket);

    if (player){
        _players.deletePlayer(player);
    }
};

exports.getGamePlayers = (gameRoom, socket) => {

    let players = [];
    let label = gameRoom.label;

    for (let i in _players.collection){
        let player = _players.collection[i];
        if (player.gameRoom && label === player.gameRoom.label){
            players.push(player.light);
        }
    }

    return {
        type    : ACTIONS.BOARD.GET_UPDATE,
        players : players
    };
};

exports.addLine = (socket, gameRoom, lines) => {
    let players = [];
    let label = gameRoom.label;

    for (let i in _players.collection){
        let player = _players.collection[i];
        if (label === player.gameRoom.label && !player.viewer){
            player.addOverline(socket, lines);
            players.push(player.light);
        }
    }

    return {
        type    : ACTIONS.BOARD.GET_UPDATE,
        players : players
    };
};

exports.getPlayerId = (player) => {
    return {
        type        : ACTIONS.LOGIN.GET_ID,
        unique_id   : player.uniqueId
    };
};