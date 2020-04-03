const Game = require('./Game.js');

const ACTIONS = require('../stateActions.js');


let _games = {
    collection  : {},

    createGame    : (name, player) => {
        let game = new Game({ name, player });
        _games.pushGame(game);

        return game;
    },

    pushGame      : (game) => {
        let _this = _games;

        _this.collection[game.id] = game;
    },

    deleteGame    : (game) => {
        let _this = _games;

        if (_this.collection[game.id]){
            delete _this.collection[game.id];
        }
    },

    getById         : (id) => {
        let _this = _games;
        return _this.collection[id];
    }
};


exports.getGameById = (gameId) => {
    return _games.getById(gameId);
};

exports.getGameByName = (name) => {
    let c = _games.collection;

    for (let i in c){
        if (c[i].name === name){
            return c[i];
        }
    }

    return null;
}

exports.joinGame = (game, player) => {
    game.pushPlayer(player);

    return game;
};

exports.createNewGame = (player, name, gameRoom) => {
    let game = _games.createGame(name, player);
    gameRoom.setAssetId(game);

    return game;
};

exports.getGameByRoom = (gameRoom) => {
    return _games.getById(gameRoom.assetId);
};

exports.leaveGame = (game, player) => {
    game.removePlayer(player);

    if (!game.players.length){
        _games.deleteGame(game);
        return null;
    }

    return game;
};

exports.getGames = () => {

    let games = [];

    for (let i in _games.collection){
        games.push(_games.collection[i].light);
    }

    return games;
};

exports.setHardmode = (game, hardmode) => {
    game.setHardmode(hardmode);

    return game;
}