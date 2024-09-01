document.getElementById('send').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('message').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('speak').addEventListener('click', function() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = document.getElementById('language').value === 'ta' ? 'ta-IN' : 'en-US';

    recognition.onresult = function(event) {
        let message = event.results[0][0].transcript;
        document.getElementById('message').value = message;
        sendMessage();
    };
    recognition.start();
});

function sendMessage() {
    let message = document.getElementById('message').value;
    let language = document.getElementById('language').value;
    document.getElementById('message').value = '';

    if (message.trim() === '') {
        return;
    }

    updateChatlog('user', message);

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `message=${message}&language=${language}`
    })
    .then(response => response.json())
    .then(data => {
        updateChatlog('bot', data.response);
        playSpeech(data.response, language);
    });
}

function updateChatlog(sender, text) {
    let chatlog = document.getElementById('chatlog');
    let newMessage = document.createElement('p');
    newMessage.textContent = text;
    newMessage.classList.add(sender);
    chatlog.appendChild(newMessage);
    chatlog.scrollTop = chatlog.scrollHeight;
}

function playSpeech(text, language) {
    fetch('/speak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `text=${text}&language=${language}`
    })
    .then(response => response.json())
    .then(data => {
        let audio = document.getElementById('audio');
        audio.src = data.audio;
        audio.hidden = false;
        audio.play();
    });
}
