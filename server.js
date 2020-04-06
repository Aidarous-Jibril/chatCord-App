const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, getUserLeaveIndex, getUsersRoom } = require('./utils/users');

//init app
const app = express();

//set public folder as static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

const io = socketio(server);

const admin = 'ChatCord Admin';

// Run when client connects
io.on('connection', socket => {

    //Listen user that joins a room
    socket.on('userJoinsRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        //socket.io gives join method to join user a spec room
        socket.join(user.room);
        // Welcome current user
        socket.emit('message', formatMessage(admin, 'Welcome to ChatCord!'));
        
        //Broadcast to other users when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
            'message',
            formatMessage(admin, `${user.username} has joined the chat`)
            );
                //Get users and room info
        io.to(user.room).emit('UsersAndRoomInfo', {
        room: user.room,
        users: getUsersRoom(user.room)
    })
    })


  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    //Use getCurrentUser function which finds and returns a user
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //Listen when User disconnects/ leaves the chat
  socket.on('disconnect', () => {
    const user = getUserLeaveIndex(socket.id);
    if(user){
        socket.to(user.room).emit('message', formatMessage(admin, `${user.username} has left the chat`));

        // Send users and room info
        io.to(user.room).emit('UsersAndRoomInfo', {
          room: user.room,
          users: getUsersRoom(user.room)
        });
    }

    });

});
