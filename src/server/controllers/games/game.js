function createId(name) {
    return `${name}_${Date.now()}`;
}


class Game {

    constructor({ name, player }) {
        
        this.name = name;
        this.id = createId(name);

        this.creation_date = Date.now();
        this.update_date = Date.now();
        
        this.start = false;
        this.ownerId = null;
        this.hardmode = false;

        this.players = [];
        
        if (player){
            this.pushPlayer(player);
        }
    }

    get label() {
        return this.id;
    }

    get pieceHash() {
        return `${this.name}_${this.update_date}`;
    }

    get light() {
        return {
            id          : this.id,
            name        : this.name,
            start       : this.start
        };
    }

    restart() {
        this.start = false;
        this.update_date = Date.now();
    }

    isOwner(player){
        let playerId = (typeof player === 'string'? player : player.id);
        
        if (playerId === this.ownerId){
            return true;
        }
        
        return false
    }
    
    isPlayer(player){
        let playerId = (typeof player === 'string'? player : player.id);

        if (this.players.indexOf(playerId) === -1){
            return false;
        }

        return true;
    }

    pushPlayer(player){
        let playerId = (typeof player === 'string'? player : player.id);

        if (!this.isPlayer(playerId)){
            this.players.push(playerId);
        }

        if (!this.ownerId){
            this.ownerId = playerId;
        }
    }

    removePlayer(player) {
        let playerId = (typeof player === 'string'? player : player.id);

        let index = this.players.indexOf(playerId);

        if (index !== -1){
            this.players.splice(index, 1);

            if (this.isOwner(playerId)){
                this.ownerId = this.players[0];
            }
        }
    }

    setStart(start) {
        this.start = start;
    }

    setHardmode(hardmode) {
        this.hardmode = hardmode;
    }

};

module.exports = Game;