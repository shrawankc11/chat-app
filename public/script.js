//create socket connection
const socket = io();

//variable intialization
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const typing = document.getElementById('typing');
const showOnline = document.getElementById('show-online')

//client side emits
const userName = prompt('Insert you name: ');
socket.emit('new-user', userName);

socket.on('user-connected', (name) => {
    displayMessage(`${name} connected!`);
});

form.addEventListener('input', (e) => {
    socket.emit('user-typing');
});

input.addEventListener('blur', (e) => {
    socket.emit('user-not-typing');
});

socket.on('user-not-typing', (style) => {
    typing.style.display = 'none';
});

socket.on('user-typing', ({ name }) => {
    showIsTyping(`${name} is typing...`);
});

socket.on('chat message', ({ msg, name }) => {
    displayMessage(`${name} : ${msg}`);
});

socket.on('user-disconnected', ({ name }) => {
    displayMessage(`${name} disconnected`);
});

//function to emit message when user sends in a messge
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value;
    if (message) {
        socket.emit('chat message', message);
        displayMessage(`You : ${message}`);
        input.value = '';
    }
});

//this function will add if a user is typing or not feature at the top of the chat
function showIsTyping(item) {
    typing.style.display = 'block';
    typing.textContent = item;
}

//function will add message to the list of messges
function displayMessage(message) {
    const item = document.createElement('li');
    item.textContent = message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}
