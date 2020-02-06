const Player = require('./Player.js');

const BOARD_ACTIONS = {
    NEXT_PIECES : 'BOARD_NEXT_PIECES',
    NEW_PIECES  : 'BOARD_NEW_PIECES',
    REMOVE_LINE : 'BOARD_REMOVE_LINE',
    UPDATE      : 'BOARD_UPDATE',
    GET_UPDATE  : 'BOARD_GET_UPDATE'
};

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

exports.delete = (socket) => {
    let player = _players.getById(socket);


};


exports.getGamePlayers = (gameRoom) => {

    let players = [];
    let label = gameRoom.label;

    for (let i in _players.collection){
        let player = _players.collection[i];
        if (label === player.gameRoom.label){
            players.push(player.light);
        }
    }

    return {
        type    : BOARD_ACTIONS.GET_UPDATE,
        players : players
    };
};

exports.addLine = (socket, gameRoom, lines) => {
    let players = [];
    let label = gameRoom.label;

    for (let i in _players.collection){
        let player = _players.collection[i];
        if (label === player.gameRoom.label){
            player.addOverline(socket, lines);
            players.push(player.light);
        }
    }

    return {
        type    : BOARD_ACTIONS.GET_UPDATE,
        players : players
    };
};