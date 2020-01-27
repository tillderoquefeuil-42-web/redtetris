const socketServer = require('socket.io');

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
    getPlayRoom   : function(player){
        return this.getRoomName('onplay', player);
    },

    joinPlayRoom  : function(socket, player){
        let roomName = this.getPlayRoom(player)
        this.joinRoom(socket, roomName);
    }
};

module.exports = function (app, server) {

    let io = socketServer.listen(server);

    let connections = [];
    io.on('connection', function (socket) {
        console.log(`connected to socket! (${socket.id})`);

        connections.push(socket);

        socket.on('disconnect', () => {
            console.log(`disconnected (${socket.id})`);
        });

        socket.on('UPDATE_BOARD', (data) => {
            console.log('UPDATE_BOARD', data);
        });

        socket.on('LINES_REMOVED', (data) => {
            console.log('LINES_REMOVED', data);
        });

        socket.on('GET_NEXT_PIECES', (data) => {
            console.log('GET_NEXT_PIECES', data);
        });

    });

};