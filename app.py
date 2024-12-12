from flask import Flask, request, jsonify
from pydub import AudioSegment
import os
from jiwer import wer
import speech_recognition as sr
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Function to convert audio to WAV
def convert_audio_to_wav(audio_path, output_path):
    sound = AudioSegment.from_file(audio_path)
    sound.export(output_path, format="wav")

# Endpoint for speech recognition
@app.route('/speech2text', methods=['POST'])
def recognize():
    try:
        # Get the audio file from the request
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Save the uploaded audio file
        audio_file_mp3 = 'user_speech.mp3'
        audio_file_wav = 'user_speech.wav'
        file.save(audio_file_mp3)

        # Convert MP3 to WAV
        convert_audio_to_wav(audio_file_mp3, audio_file_wav)

        # Get the reference sentence
        reference_sentence = request.form['reference_text']

        # Initialize recognizer
        recognizer = sr.Recognizer()

        # Load the WAV audio file
        with sr.AudioFile(audio_file_wav) as source:
            audio_data = recognizer.record(source)
            try:
                hypothesis = recognizer.recognize_google(audio_data)
            except sr.UnknownValueError:
                hypothesis = ""

        # Calculate the Word Error Rate (WER)
        error_rate = wer(reference_sentence, hypothesis)

        # Calculate accuracy as a percentage
        accuracy = (1 - error_rate) * 100

        # Clean up the saved files
        os.remove(audio_file_mp3)
        os.remove(audio_file_wav)

        # Return the results as JSON
        return jsonify({
            'recognized': hypothesis,
            'reference_text': reference_sentence,
            'word_error_rate': error_rate,
            'accuracy': accuracy
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
