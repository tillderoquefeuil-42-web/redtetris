const lib = {
    pieces  : require('./pieces/lib.js'),
    rooms   : require('./rooms/lib.js'),
    players : require('./players/lib.js'),
    games   : require('./games/lib.js')
};

const ACTIONS = require('./stateActions.js');


function getRoomsBySocket(socket) {
    return lib.rooms.getRoomsByTypeForSocket(socket);    
}

function getAssetsByRooms(gameRoom, playerRoom) {

    let game = gameRoom? lib.games.getGameByRoom(gameRoom) : null;
    let player = playerRoom? lib.players.getPlayerByRoom(playerRoom) : null;

    return [player, game];
}


exports.getRooms = (socket) => {
    return getRoomsBySocket(socket);
};

exports.getRoomsAndAssets = (socket) => {
    let rooms = getRoomsBySocket(socket);
    let [player, game] = getAssetsByRooms(rooms.game, rooms.player);

    return [rooms, player, game];
};


// DISCONNECT
exports.leaveGameRoom = (socket) => {
    let rooms = getRoomsBySocket(socket);

    if (!rooms.game){
        return;
    }

    let [player, game] = getAssetsByRooms(rooms.game, rooms.player);

    let newOwner = (game.isOwner(player)? true : false);

    lib.games.leaveGame(game, player);
    lib.rooms.leaveOneRoom(socket, rooms.game);
    lib.players.leaveGameRoom(player);


    if (newOwner){
        return rooms.game;
    }

    return;
};

exports.leavePlayerRoom = (socket) => {
    let rooms = getRoomsBySocket(socket);

    let [player] = getAssetsByRooms(null, rooms.player);

    lib.players.deletePlayer(player);
    lib.rooms.leaveOneRoom(socket, rooms.players);

    return;
};

// SET NAME
exports.getPlayerRoom = (socket) => {
    return lib.rooms.getPlayerRoom(socket);
};

// SET GAME_ROOM
exports.joinGameRoom = (socket, data) => {
    let rooms = getRoomsBySocket(socket);

    let game = lib.games.getGameByName(data.login.room);
    
    if (game){
        let room = lib.rooms.getRoomByAssetId('game', game.id);
        if (room){
            rooms.game = lib.rooms.joinGameRoom(socket, room.id);
            let [player, game] = getAssetsByRooms(rooms.game, rooms.player);
            lib.games.joinGame(game, player);
        }
    }
    
    if (!rooms.game){
        let [player] = getAssetsByRooms(null, rooms.player);
        rooms.game = lib.rooms.getGameRoom(socket);
        lib.games.createNewGame(player, data.login.room, rooms.game);
    }

    return rooms;
};

exports.updatePlayer = (rooms, data) => {
    return lib.players.updatePlayer(data.login.name, rooms.player, rooms.game, data.board);
};

// START
exports.getOwnerGameRoom = (socket) => {
    let rooms = getRoomsBySocket(socket);
    let [player, game] = getAssetsByRooms(rooms.game, rooms.player);

    if (game.isOwner(player)){
        return rooms;
    }

    return;
}

// RESTART
exports.isOwner = (game, player) => {
    return game.isOwner(player);
};

exports.restartPlayerBoards = (game) => {
    lib.players.restartPlayers(game);
};


// RETURN STATES

exports.newRoomOwner = () => {
    return {
        type    : ACTIONS.LOGIN.NEW_OWNER
    };
};

exports.getGames = () => {
    let games = lib.games.getGames();

    return {
        type    : ACTIONS.LOGIN.GET_ROOMS,
        rooms   : games
    };
};

exports.sendPlayerId = (player) => {
    return {
        type        : ACTIONS.LOGIN.GET_ID,
        player_id   : player.id
    };
};

exports.roomOwner = (rooms) => {
    let [player, game] = getAssetsByRooms(rooms.game, rooms.player);
    
    let owner = game.isOwner(player);

    return {
        type    : ACTIONS.LOGIN.GET_OWNER,
        owner   : owner,
        started : game.start
    };
};

exports.getGamePlayers = (rooms) => {
    let [player, game] = getAssetsByRooms(rooms.game, null);
    
    let players = lib.players.getGamePlayers(game);

    return {
        type    : ACTIONS.BOARD.GET_UPDATE,
        players : players
    };
};

exports.setHardmode = (rooms, data) => {
    let [player, game] = getAssetsByRooms(rooms.game, rooms.player);
    game = lib.games.setHardmode(game, data.board.hardmode);

    return {
        type        : ACTIONS.BOARD.GET_HARDMODE,
        hardmode    : game.hardmode
    };
}


exports.startGame = (rooms) => {
    let [player, game] = getAssetsByRooms(rooms.game, rooms.player);
    game.setStart(true);

    return {
        type    : ACTIONS.LOGIN.GET_START
    };
};

exports.getPiecesSet = (rooms, index) => {
    let [player, game] = getAssetsByRooms(rooms.game, rooms.player);
    let pieces = lib.pieces.generatePiecesSet(game.pieceHash, index);

    return {
        type    : ACTIONS.BOARD.NEXT_PIECES,
        pieces  : pieces,
        index   : index + 1
    };
};

exports.resetBoard = () => {
    return {
        type    : ACTIONS.BOARD.RESET
    };
};

exports.restart = (game) => {
    game.restart();

    return {
        type    : ACTIONS.LOGIN.GET_RESTART
    };
};

exports.addLines = (rooms, data) => {
    let [player, game] = getAssetsByRooms(rooms.game, rooms.player);
    let players = lib.players.addLine(game, player.id, data.board.lines);

    return {
        type    : ACTIONS.BOARD.GET_UPDATE,
        players : players
    };
};
