const socket = io();

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true })

const input = document.querySelector('#inputField');
const sendButton = document.querySelector('.send-icon');
const messageArea = document.querySelector('#message-area');
const chatTemplate = document.querySelector('#chat-text-template').innerHTML;
const userListTemplate = document.querySelector('#userListTemplate').innerHTML;
const usersListArea = document.querySelector('#user-list');

window.addEventListener('load', () => {
    sendButton.setAttribute('disabled','true');

    input.addEventListener('input', () => {
        if(input.value.trim() !== ''){
            sendButton.removeAttribute('disabled')
        }
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error);
        location.href = '/'
    }
})

socket.on('roomData', ({ users, room } ) => {
    console.log(users, room);
    const html = Mustache.render(userListTemplate, {
        users,
        room,
    })
    usersListArea.innerHTML = html
})

sendButton.addEventListener('click', () => {
     socket.emit('sentText', input.value)

    sendButton.setAttribute('disabled','true');
    input.value = '';
    input.focus()
})

socket.on('responseToUI', ( value ) => {
    console.log(value);
    const html = Mustache.render(chatTemplate, {
        username : value.username,
        message : value.text,
        time : moment(value.createdAt).format('hh:mm a')
    });
    // console.log('recieve response from server');
    // console.log('this chat template',chatTemplate);
    messageArea.insertAdjacentHTML('beforeend', html)
})

socket.on('joinUser', (msg) => {
    console.log(msg);
})
