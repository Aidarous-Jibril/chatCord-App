const socket = io();

 const chatForm = document.getElementById('chat-form');
 const chatMessages = document.querySelector('.chat-messages');
 const roomName = document.getElementById('room-name');
 const usersList = document.getElementById('users');

 //Get username & room info from URL link using by Qs library
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });
  
  //Emit when User joins a room
  socket.emit('userJoinsRoom', ({username, room}))

 // Listen Message from server
 socket.on('message', message => {
   //console.log(message);
   outputMessage(message);
 
   // Scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;
 });
 
 // Message submit
 chatForm.addEventListener('submit', e => {
   e.preventDefault();
 
   // Get message text
   var chatMessage = chatForm.message.value;
   
   // Emit message to server
   socket.emit('chatMessage', chatMessage);
 
   // Clear input
   chatForm.message.value = '';
   chatForm.message.focus();
 });
 
 // Output message to DOM
 function outputMessage(message) {
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
   <p class="text">
     ${message.text}
   </p>`;
   document.querySelector('.chat-messages').appendChild(div);
 }

 //Listen UsersAndRoomInfo event from server
socket.on('UsersAndRoomInfo', ({room, users}) => {
    showRoomName(room);
    showUsersName(users)
})

 function showRoomName(room){
    roomName.innerHTML = room;
 }

 //join method just gives space ' '
 function showUsersName(users){
     usersList.innerHTML =  `
     ${users.map(user => `<li>${user.username}</li>`).join(' ')} 
    `
 }
