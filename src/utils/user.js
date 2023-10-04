const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existUserIndex = users.findIndex((user) => {
        return user.username === username && user.room === room;
    })
    if(existUserIndex !== -1){
        return { error : 'User already in use' };
    }
    
    const user = { id, username, room };
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

module.exports = {
    addUser,
    removeUser,
    getUser,
    getRoomUsers
}