import requests

url = 'http://192.168.199.171:5000/speech2text'
files = {'file': open('user_sentence/sentence.mp3', 'rb')}
data = {'reference_text': 'hello world'}

response = requests.post(url, files=files, data=data)

print(response.json())
