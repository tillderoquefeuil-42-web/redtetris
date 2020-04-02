function createId(name) {
    return `${name}_${Date.now()}`;
}


class Player {

    constructor({ name, playerRoom, gameRoom }) {
        
        this.name = name;
        this.id = createId(name);

        this.gameRoomId = null;
        this.playerRoomId = null;

        this.score = 0;
        this.overLine = 0;
        this.blocks = [];
        this.gameOver = false;
        this.viewer = false;

        if (playerRoom){
            this.setPlayerRoomId(playerRoom)
        }
        
        if (gameRoom){
            this.setGameRoomId(gameRoom);
        }
    }
    
    get light() {
        return {
            id          : this.id,
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
    
    setPlayerRoomId(playerRoom) {
        this.playerRoomId = playerRoom.id;
    }

    setGameRoomId(gameRoom) {
        if (!this.gameRoomId && gameRoom && gameRoom.start){
            this.viewer = true;
        }
        
        this.gameRoomId = (gameRoom? gameRoom.id : null);
    }

    updateBoard(board) {
        if (board){
            this.gameOver = board.game_over;
            this.blocks = board.blocks;
            this.score = board.score;
        }
    }

    resetBoard() {
        this.viewer = false;
        this.score = 0;
        this.blocks = [];
        this.gameOver = false;
        this.overLine = 0;

        return this;
    }

    addOverline(lines) {
        this.overLine += lines;
    }

};

module.exports = Player;