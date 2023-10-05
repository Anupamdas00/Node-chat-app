const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existUserIndex = users.findIndex((user) => {
        return user.username.trim().toLowerCase() === username && user.room.trim().toLowerCase() === room;
    })
    if(existUserIndex !== -1){
        return { error : 'User already in use' };
    }

    username = username.titleCaseFn()
    room = room.titleCaseFn()

    const user = { id, username , room };
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if(userIndex !== -1){
        const user = users.splice(userIndex, 1)
        return user[0];
    }
}

const getUser = (id) => {
    const user = users.find((user) => user.id == id);
   return user

}


const getRoomUsers = (room) => {
    const usersInRoom = users.filter((user) => user.room == room);
    return usersInRoom;
}


//Makes Name and room name as titlecase
String.prototype.titleCaseFn = function(){
    let newStr = ''
    let strArr = this.split(' ');
    for(let str of strArr){
        newStr += ( str.charAt(0).toUpperCase() + str.slice(1) + ' ');
    }
    return newStr.trim();
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getRoomUsers
}