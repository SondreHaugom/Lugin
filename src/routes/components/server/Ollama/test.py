
import ollama

model = 'bge-large:335'  # bytt til din

res = ollama.generate(
    model=model,
    prompt='Skriv en kort setning om Norge.'
)

print(res['response'])









"""
Docstring for routes.components.server.Ollama.test


import os
from ollama import Client
from dotenv import load_dotenv

load_dotenv()

client = Client(
    host="https://ollama.com",
    headers={'Authorization': 'Bearer ' + os.environ.get('OLLAMA_API_KEY')}
)

messages = [
  {
    'role': 'user',
    'content': 'Hvilken modell er du?',
  },
]

for part in client.chat('gpt-oss:120b', messages=messages, stream=True):
  print(part['message']['content'], end='', flush=True)
  """