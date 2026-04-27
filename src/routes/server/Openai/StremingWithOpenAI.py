from openai import OpenAI
import os
import dotenv

dotenv.load_dotenv()  # Load environment variables from .env file

# Oppretter OpenAI klient for å ha spørringer til OpenAI API, og henter API-nøkkelen fra miljøvariabler
client = OpenAI(api_key=os.environ.get("TFK_OPENAI_API_KEY"))
# en funksjon for å chatte med OpenAI, som tar inn brukerinput og returnerer et stream-objekt med svaret fra OpenAI
def chatWithOpenAI():
    # prøver å opprette en respons fra OpenAI API
    try:
        # Oppretter en respons ved å bruke OpenAI klienten, og spesifiserer modellen, input og at vi ønsker et stream-objekt
        response = client.responses.create(
            model= "gpt-5.4", 
            input= user_input,
            stream=True,
        )
        
        # returnerer stream-objektet som inneholder svaret fra OpenAI
        return response
    # Skjekker eventuelle feil som kan opstå underveis
    except Exception as e:
        print("Error during chat:", e)
        return False
# En enkel loop for å chatte med OpenAI i terminalen, hvor brukeren kan skrive inn spørsmål og få svar fra OpenAI i sanntid    
if __name__ == "__main__":
    # kjører en loop som fortsetter til bruker ønsker å avslutte
    while True:
        user_input = input("You: ")
        if user_input.lower().strip() in ["exit", "quit", "q"]:
            print("Exiting chat.")
            break
        # henter strem-objektet/resultatet fra chatWithOpenAI funksjonen, og skriver ut svaret i sanntid mens det kommer inn
        stream = chatWithOpenAI()
        # skriver ut "OpenAI:" og deretter hver del av svaret etterhvert som det kommer inn, uten å vente på at hele svaret skal være klart
        print("OpenAI:", end=" ", flush=True)
        for event in stream:
            if event.type == "response.output_text.delta":
                print(event.delta, end="", flush=True)
        print()





        