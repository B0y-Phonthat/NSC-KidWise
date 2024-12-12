from gtts import gTTS

# Sentence to be converted to speech
sentence = "Hello world"

# Create a gTTS object
tts = gTTS(text=sentence, lang='en')

# Save the speech to a file
audio_file = 'hello_world.mp3'
tts.save(audio_file)

print(f"Audio file saved as {audio_file}")

