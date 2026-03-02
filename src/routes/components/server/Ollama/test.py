from ollama import Client
import dotenv
import os

dotenv.load_dotenv()  # Load environment variables from .env file

# Initialize the Ollama client with the API key from environment variables
client = Client(
    host="https://ollama.com",
    headers={'Authorization': 'Bearer ' + os.environ.get('OLLAMA_API_KEY')}
)

# Deklarerer en global variabel for ¨å holde samtalehistorikken
conversationHistory = [{"role": "system", "content": "Du er en hjelpsom assistent som svarer på spørsmål og hjelper med oppgaver."}]


# Funksjon for å chatte med Ollama, som tar inn en prompt og oppdaterer samtalehistorikken
def chatWithOllama(prompt):
    try:
        conversationHistory.append({"role": "user", "content": prompt})

        response = client.chat(
            model="gpt-oss:120b-cloud",
            messages=conversationHistory,
        )
        
        conversationHistory.append({"role": "assistant", "content": response['message']['content']})
        return response
    except Exception as e:
        print("Error during chat:", e)
        return False
    
if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower().strip() in ["exit", "quit", "q"]:
            print("Exiting chat.")
            break
        response = chatWithOllama(user_input)
        if response:
            print("Ollama:", response['message']['content'])
        else:
            print("Failed to get response from Ollama.")
