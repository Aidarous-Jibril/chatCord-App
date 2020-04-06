//empty users array
const users = [];


function userJoin(id, username, room){
    //make a user by these inpassed args
    const user = {id, username, room}
    users.push(user);
    return user;
}

//Finds a user and returns it
function getCurrentUser(id){
  return  users.find(user => user.id === id)
}

function getUserLeaveIndex(id){
    const index = users.findIndex(user => user.id === id);

    //return 1 if there is a user, if not returns -1
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

//Get users' room
function getUsersRoom(room){
    return users.filter(user => user.room === room)
}

module.exports = {userJoin, getCurrentUser, getUserLeaveIndex, getUsersRoom};

