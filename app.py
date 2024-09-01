from flask import Flask, request, jsonify
from gtts import gTTS
import json
import random
import os

app = Flask(__name__)

# Load the intents JSON file
with open('intents.json') as file:
    intents = json.load(file)

def get_response(message, language):
    message = message.lower()
    for intent in intents['intents']:
        for pattern in intent['patterns']:
            if pattern.lower() in message:
                return random.choice(intent['responses'][language])
    return "Sorry, I didn't understand that."

@app.route('/chat', methods=['POST'])
def chat():
    message = request.form['message']
    language = request.form['language']
    response = get_response(message, language)
    return jsonify({'response': response})

@app.route('/speak', methods=['POST'])
def speak():
    text = request.form['text']
    language = request.form['language']
    tts = gTTS(text=text, lang=language)
    tts.save("static/response.mp3")
    return jsonify({'audio': '/static/response.mp3'})

if __name__ == '__main__':
    app.run(debug=True)
