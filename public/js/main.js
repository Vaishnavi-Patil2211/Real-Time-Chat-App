const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});



const socket = io();

//join chatroom
socket.emit('joinRoom',{username,room});

// Get room and users
socket.on('roomUsers',({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//message from server

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;

});

//message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //get message text

    const msg = e.target.elements.msg.value;

    //emit msg to server
   socket.emit('chatMessage',msg);

   //clear input
   e.target.elements.msg.value='';
   e.target.elements.msg.focus();


});


//output message to DOM 

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `	<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM 
function outputRoomName(name){

    roomName.innerText = room;

}

//add usres to DOM

function outputUsers(users){
    userList.innerHTML=`${users.map(user => `<li>${user.username}</li>`).join('')}`;
}