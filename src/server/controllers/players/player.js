class Player {

    constructor({ name, socket, gameRoom, board }) {
        this.name = name;
        this.id = socket.id;
        this.gameRoom = gameRoom;
        this.viewer = false;
        this.score = 0;
        this.blocks = [];
        this.gameOver = false;
        this.overLine = 0;

        if (board) {
            this.updateBoard(board);
        }

        if (gameRoom && gameRoom.start){
            this.viewer = true;
        }
    }

    get light() {
        return {
            name        : this.name,
            score       : this.score,
            blocks      : this.blocks,
            gameOver    : this.gameOver,
            overLine    : this.overLine,
            viewer      : this.viewer
        };
    }

    setName(name) {
        this.name = name;
    }

    setGameRoom(gameRoom) {
        this.gameRoom = gameRoom;
    }

    addOverline(socket, lines) {
        if (socket.id !== this.id){
            this.overLine += lines;
        }
    }

    updateBoard(board) {
        if (board){
            this.gameOver = board.game_over;
            this.blocks = board.blocks;
            this.score = board.score;
        }
    }
};

module.exports = Player;