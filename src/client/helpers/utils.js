
export const parseHash = (hash) => {
    let matches;

    if (hash && hash.match(/^#.*\]/)){
        hash = hash.split(']')[0];
        matches = hash.match(/^#([\w!@%*+=._-]+)\[([\w!@%*+=._-]+)$/);
    }

    return {
        name    : (matches && matches.length === 3? matches[2] : null),
        room    : (matches && matches.length === 3? matches[1] : null)
    }
}

export const getHashFromProps = (props) => {
    return '/#' + (props.room_set? `${props.room}[${props.name}]` : '');  
}

export const checkInput = (value) => {
    let matches = value.match(/^[\w!@%*+=._-]+$/);

    if (matches){
        return true;
    }

    return false;
}