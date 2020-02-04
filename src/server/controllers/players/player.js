class Player {

    constructor({ name, socket, gameRoom }) {
        this.name = name;
        this.id = socket.id;
        this.gameRoom = gameRoom;
        this.score = 0;
        this.blocks = [];
        this.gameOver = false;
        this.overLine = 0
    }

    get light() {
        return {
            name        : this.name,
            score       : this.score,
            blocks      : this.blocks,
            gameOver    : this.gameOver,
            overLine    : this.overLine
        };
    }

    addOverline(socket, lines) {
        if (socket.id !== this.id){
            this.overLine += lines;
        }
    }
};

module.exports = Player;