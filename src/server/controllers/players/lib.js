const Player = require('./Player.js');

const ACTIONS = require('../stateActions.js');

let _players = {
    collection  : {},

    createPlayer    : (name, playerRoom, gameRoom) => {
        let player = new Player({ name:name, playerRoom, gameRoom });
        _players.pushPlayer(player);

        return player;
    },

    pushPlayer      : (player) => {
        let _this = _players;

        _this.collection[player.id] = player;
    },

    deletePlayer    : (player) => {
        let _this = _players;

        if (_this.collection[player.id]){
            delete _this.collection[player.id];
        }
    },

    getById         : (id) => {
        let _this = _players;

        return _this.collection[id];
    }
};

exports.getPlayerByRoom = (playerRoom) => {
    return _players.getById(playerRoom.assetId);
}

exports.leaveGameRoom = (player) => {

    if (player){
        player.setGameRoomId(null);
        player.resetBoard();
    }

    return player;
};

exports.deletePlayer = (player) => {

    if (player){
        _players.deletePlayer(player);
    }
};

exports.updatePlayer = (name, playerRoom, gameRoom, board) => {
    let player = _players.getById(playerRoom.assetId);

    //CREATION
    if (!player){
        player = _players.createPlayer(name, playerRoom, gameRoom);
        playerRoom.setAssetId(player);
        return player;
    }

    //UPDATE
    player.setName(name);
    player.setGameRoomId(gameRoom);
    player.updateBoard(board);

    return player;
};

exports.restartPlayers = (game) => {
    for (let i in game.players){
        let player = _players.getById(game.players[i]);
            
        if (player){
            player.resetBoard();
        }
    }
};

exports.getGamePlayers = (game) => {
    let players = [];

    for (let i in game.players){
        let player = _players.getById(game.players[i]);
        players.push(player.light);
    }

    return players;
};

exports.addLine = (game, playerId, lines) => {
    let players = [];

    for (let i in game.players){
        let player = _players.getById(game.players[i]);
        if (player.id !== playerId && !player.viewer){
            player.addOverline(lines);
        }
        players.push(player.light);
    }

    return players;
};

