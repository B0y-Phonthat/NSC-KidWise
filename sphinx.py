from pydub import AudioSegment
import os
from jiwer import wer
import speech_recognition as sr

# Convert MP3 to WAV
audio_file_mp3 = 'user_sentence/hello_world.mp3'
audio_file_wav = 'user_sentence/hello_world.wav'

# Check if the WAV file already exists to avoid unnecessary conversion
if not os.path.isfile(audio_file_wav):
    # Convert MP3 to WAV
    sound = AudioSegment.from_mp3(audio_file_mp3)
    sound.export(audio_file_wav, format="wav")

# Initialize recognizer
recognizer = sr.Recognizer()

# Load the WAV audio file
with sr.AudioFile(audio_file_wav) as source:
    audio_data = recognizer.record(source)
    try:
        hypothesis = recognizer.recognize_google(audio_data)
    except sr.UnknownValueError:
        hypothesis = ""

# Reference sentence
reference_sentence = "hello word"

# Calculate the Word Error Rate (WER)
error_rate = wer(reference_sentence, hypothesis)

# Calculate accuracy as a percentage
accuracy = (1 - error_rate) * 100

# Print the recognized text, WER, and accuracy
print(f"Recognized: {hypothesis}")
print(f"Word Error Rate: {error_rate}")
print(f"Accuracy: {accuracy}%")
