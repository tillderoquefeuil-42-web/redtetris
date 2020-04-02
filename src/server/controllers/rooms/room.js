function createId(type, socket) {
    return `${type}_${Date.now()}_${socket.id.slice(0, 5)}`;
}

class Room {

    constructor({ type, socket }) {
        this.type = type;
        this.clients = [];
        this.id = createId(type, socket);

        this.assetId = null;
    }

    get label() {
        return this.id;
    }

    isClient(socket){
        let id = socket.id;

        if (this.clients.indexOf(id) === -1){
            return false;
        }

        return true;
    }

    pushClient(socket){
        let id = socket.id;
        if (!this.isClient(socket)){
            this.clients.push(id);

        }
    }

    removeClient(socket) {
        let id = socket.id;

        let index = this.clients.indexOf(id);

        if (index !== -1){
            this.clients.splice(index, 1);
        }
    }

    setAssetId(asset) {
        if (asset){
            this.assetId = asset.id;
        } else {
            this.assetId = null;
        }
    }

};

module.exports = Room;