

const socket=io();

const receiverId=document.getElementById('receiver').innerHTML;
const timestamp= new Date().toLocaleTimeString();
const receivername=document.getElementById('receivername').innerHTML;
const userId=document.getElementById('userid').innerHTML;



socket.emit('register', userId);


function sendMessage(){
    const message=document.getElementById('messageInput').value;

    
  
    

    


    socket.emit('sendMessage',{
        message,
        receiverId,
        timestamp,
        userId

    })
   
    
    addMessageToUI('user', message, timestamp);

    document.getElementById('messageInput').value = '';
}

socket.on('receiveMessage', (data) => {
    console.log( data.sender, ':', data.message);

    
    addMessageToUI('recipient', data.message, data.timestamp);
})

function addMessageToUI(type,message,timestamp){
    const messageElement=document.createElement('li');
    messageElement.textContent=message;

    if(type === 'user'){
        messageElement.classList.add('user');
    }
    else{
        messageElement.classList.add('recipient');
    }

    const timestampElement=document.createElement('span');
    timestampElement.classList.add('timestamp');
    timestampElement.textContent = timestamp;
    messageElement.appendChild(timestampElement);


    const messagesList = document.getElementById('messages');
    messagesList.appendChild(messageElement);

}











































// const errorMessage = document.querySelector('.error-message');
// const inputs = document.querySelectorAll('input');

// inputs.forEach(input => {
//     input.addEventListener('input', () => {
//         if (errorMessage) {
//             errorMessage.style.display = 'none';
//         }
//     });
// });



