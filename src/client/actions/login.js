import ActionTypes from '../constants/ActionTypes';

const ACTIONS = ActionTypes.LOGIN;

export function updateName(name, force) {
    return { type:ACTIONS.UPDATE_NAME, login_name:name, login_force:force };
}

export function setName() {
    return { type: ACTIONS.SET_NAME };
}

export function updateRoom(room, force) {
    return { type:ACTIONS.UPDATE_ROOM, login_room:room, login_force:force };
}

export function setRoom() {
    return { type: ACTIONS.SET_ROOM };
}

export function resetRoom() {
    return { type: ACTIONS.RESET_ROOM };
}

export function urlLogging(name, room) {
    return { type:ACTIONS.URL_LOGGING, data:{ name, room } };
}

export function getRoomOwner() {
    return { type:ACTIONS.GET_ROOM_OWNER };
}

export function start() {
    return { type:ACTIONS.START };
}

export function restart(backToRoom) {
    return { type:ACTIONS.RESTART, back_to_room:backToRoom };
}


export function getId(id) {
    return { type:ACTIONS.GET_ID, player_id:id };
}

export function getRooms(rooms) {
    return { type:ACTIONS.GET_ROOMS, rooms };
}

export function newOwner() {
    return { type:ACTIONS.NEW_OWNER };
}

export function getOwner(owner, started) {
    return { type:ACTIONS.GET_OWNER, owner, started };
}

export function getStart() {
    return { type:ACTIONS.GET_START };
}

export function getRestart(backToRoom) {
    return { type:ACTIONS.GET_RESTART, back_to_room:backToRoom };
}