const socket = io();

const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const typing = document.getElementById('typing');

const name = prompt('Insert you name: ');
socket.emit('new-user', name);

socket.on('user-connected', (name) => {
    displayMessage(`${name} connected!`);
});

form.addEventListener('input', (e) => {
    socket.emit('user-typing');
});

input.addEventListener('blur', (e) => {
    socket.emit('user-not-typing');
});

socket.on('user-not-typing', (msg) => {
    typing.style.display = 'none';
});

socket.on('user-typing', ({ name }) => {
    addItem(`${name} is typing...`);
});

socket.on('chat message', ({ msg, name }) => {
    displayMessage(`${name} : ${msg}`);
});

socket.on('user-disconnected', ({ name }) => {
    displayMessage(`${name} disconnected`);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value;
    if (message) {
        socket.emit('chat message', message);
        displayMessage(`You : ${message}`);
        input.value = '';
    }
});

function addItem(item) {
    typing.style.display = 'block';
    typing.textContent = item;
}

function displayMessage(message) {
    const item = document.createElement('li');
    item.textContent = message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}
