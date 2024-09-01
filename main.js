const intents = {
    "intents": [
        {
            "tag": "greeting",
            "patterns": ["hello", "hi", "how are you", "is anyone there", "hey"],
            "responses": {
                "en": ["Hello!", "Hi there! How can I assist you today?"],
                "ta": ["வணக்கம்!", "வணக்கம்! நான் உங்களுக்கு எப்படி உதவ வேண்டும்?"]
            }
        },
        {
            "tag": "goodbye",
            "patterns": ["bye", "see you later", "goodbye"],
            "responses": {
                "en": ["Goodbye!", "See you later! Have a great day!"],
                "ta": ["பிரியாவிடை!", "பின்னர் சந்திப்போம்! உங்களுக்கு நல்ல நாள்!"]
            }
        },
        {
            "tag": "thanks",
            "patterns": ["thanks", "thank you", "that's helpful"],
            "responses": {
                "en": ["You're welcome!", "Glad to help!"],
                "ta": ["உங்களை வரவேற்கிறேன்!", "உதவியதில் மகிழ்ச்சி!"]
            }
        }
    ]
};

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
    let message = document.getElementById('message').value.toLowerCase();
    let language = document.getElementById('language').value;
    document.getElementById('message').value = '';

    if (message.trim() === '') {
        return;
    }

    updateChatlog('user', message);

    let response = getResponse(message, language);
    updateChatlog('bot', response);
    playSpeech(response, language);
}

function getResponse(message, language) {
    for (let intent of intents.intents) {
        for (let pattern of intent.patterns) {
            if (message.includes(pattern)) {
                return intent.responses[language][Math.floor(Math.random() * intent.responses[language].length)];
            }
        }
    }
    return language === 'en' ? "Sorry, I didn't understand that." : "மன்னிக்கவும், என்னை புரிந்துகொள்ள முடியவில்லை.";
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
    let speech = new SpeechSynthesisUtterance();
    speech.lang = language === 'ta' ? 'ta-IN' : 'en-US';
    speech.text = text;
    window.speechSynthesis.speak(speech);
}
