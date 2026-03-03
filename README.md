###
 Lugin Halvårsvurdering 

Min helt egen KI-tjeneste, basert på min halvårsvurdering. 

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)


---
[![Svelte](https://img.shields.io/badge/Svelte-5%2B-ff3e00?logo=svelte)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2%2B-ff3e00?logo=svelte)](https://kit.svelte.dev)
[![Status](https://img.shields.io/badge/status-under%20arbeid-yellow)](#)


### Innholdsfortegnelse
- [Funksjoner](#-Funksjoner)
- [Om-prosjektet](#-Om-prosjektet)
- [Prosjektstruktur](#-Prosjektstruktur)
- [Dataflyt](#-Dataflyt)
- [Filforklaring](#-Filforklaring)
- [Arkitektur-prinsipper](#-Arkitektur-prinsipper)
- [Forklaring-av-API-kall](#-Forklaring-av-API-kall)
- [Bruk-av-funksjonskall-i-prosjektet](#-Bruk-av-funksjonskall-i-prosjektet)
- [Biblioteker-og-begrunnelse](#-Biblioteker-og-begrunnelse)
- [Installasjon-og-oppsett](#-Installasjon-og-oppsett)
- [Sikkerhet-og-personvern](#-Sikkerhet-og-personvern)
- [Feilsøkings-strategier](#-Feilsøkings-strategier)


### Funksjoner
- **Moderne chatgrensesnitt** med Svelte
- ** ChatGPT - gpt-4.1-nano** (Språkmodellen som kjører/flere vil komme)
- **Responsivt design** med gradient-bakgrunner og moderne styling
- **Modulær arkitektur** med separert agent-logikk og komponenter
- **Tastaturnavigasjon** (Enter for å sende)
- **Systemflyt-visualisering** med integrert flytdiagram
- **Modulære komponenter** (UserInput, AgentInstruks, OCR)
-  **Streaming av respons** (Svar fra botten kommer delsvis underveis)





### Om prosjektet

Dette er min egen KI-tjeneste basert på en avansert språkmodell (en agent). Systemet er bygget med en multi-agent arkitektur, utviklet med SvelteKit, og inkluderer for øyeblikket en spesifikk agent – Mistral-agenten. Flere agenter vil bli lagt til etter hvert for å gi brukeren flere valg og muligheter, avhengig av ønsket leverandør. Systemet gjør det mulig å skifte mellom de ulike agentene underveis i bruk, selv om hver agent vil operere uavhengig av de andre og ikke kjenne til responsene deres. Dette er en ferdigstilt løsning, utviklet som en del av en halvårsvurdering etter å ha vært lærling i over seks måneder. På sikt planlegger jeg å utstyre agenten med funksjonskall for å muliggjøre tilgang til ekstern informasjon, slik at den kan benytte seg av oppdaterte data utenfor sitt treningsgrunnlag.


### Prosjektstruktur

```
Lugin-Halvrsvurdering/
├── src/
│   ├── lib/
│   │   ├── selectAgent.js          # Velger hvilken AI som skal brukes
│   │   ├── markdown.js             # Markdown og KaTeX rendering
│   │   └── global.css              # Global styling
│   └── routes/
│       ├── +page.svelte            # Hovedside med chat
│       └── components/
│           ├── agentInnstruks.svelte    # Systeminstruksjoner
│           ├── userInput.svelte         # Brukerinput komponent
│           └── server/
│               ├── Openai/+server.js       # OpenAI backend  
├── System flyt.png             # Systemflyt diagram
├── package.json
└── README.md
```

### Systemflyt

Se det komplette flytdiagrammet for prosjektet:

![Systemflyt](System%20flyt.png)

*Diagrammet viser den fullstendige dataflyten mellom komponenter, agenter og API-er.*

### Dataflyt

```
👤 Bruker skriver melding
    ↓
📱 Frontend (+page.svelte)
    ↓
🔄 selectAgent.js (bestemmer hvilken agent)
    ↓
🤖 API Endpoint (/components/server/{agent})
    ↓
🌐 Eksterne AI API (Mistral/OpenAI/FagAssistenten)
    ↓
📝 JSON Response tilbake til frontend
    ↓
💬 Vises i chat-grensesnitt med markdown-rendering
```

### Filforklaring

| Fil/Mappe | Funksjon | Type |
|-----------|----------|------|
| `+page.svelte` | Chat-grensesnitt, brukerinteraksjon, DOM-håndtering | Frontend |
| `selectAgent.js` | Router meldinger til riktig AI-agent | Middleware |
| `components/server/Mistralai/+server.js` | API endpoint for Mistral AI med tool calls support | Backend API |
| `components/server/Openai/+server.js` | API endpoint for OpenAI GPT modeller | Backend API |
| `components/server/FagAssistenten/+server.js` | Spesialisert fagassistent endpoint | Backend API |
| `components/agentInnstruks.svelte` | Systeminstruksjoner for agenter | Component |
| `components/userInput.svelte` | Modulær brukerinput-komponent | Component |
| `components/server/ocs/OCR.svelte` | OCR-funksjonalitet for tekstgjenkjenning | Component |
| `lib/markdown.js` | Markdown og KaTeX rendering | Utility |
| `+layout.svelte` | Global styling, CSS variabler, favicon | Layout |
| `Funksjosnkall.py` | Python test script for å teste ut funksjosnkall med Mistral API | Testing |

### Arkitektur-prinsipper

- **Frontend**: Svelte/SvelteKit for reaktiv UI
- **Backend**: SvelteKit API routes (`+server.js` filer)  
- **Agent-system**: Modulær oppbygning hvor hver AI-leverandør har sitt eget API endpoint
- **Responsiv design**: Mobile-first tilnærming med CSS Grid/Flexbox
- **Tool calls**: Mistral støtter funksjonskall (f.eks. Chuck Norris vitser)


### Forklaring av API kall
For dette projektet av vi to forskjellige agent leverandører:
- **OpenAI**

Hver leverandør tilbyr et API som vi bruker for å kommunisere med deres språkmodeller. Når en bruker sender en prompt til den valgte modellen, sendes denne forespørselen til det aktuelle API-et (OpenAI eller Mistral). API-et videresender så forespørselen til språkmodellen, som genererer et svar (respons). Dette svaret sendes tilbake via API-et og vises til brukeren.


### Bruk av funksjonskall i prosjektet
I dette prosjektet blir funksjonskall brukt sammen med Chuck Norris-API-et. Dette er satt opp for å få en generell forståelse av hvordan funksjonskall skal konfigureres i Mistral. Løsningen er implementert i et Python-script som jeg laget for å teste hvordan dette kan gjennomføres i praksis. Deretter rettet jeg løsningen mot selve agenten som skulle ha funksjonskallet, og har begynt å implementere det der. 



### Biblioteker og begrunnelse

| Import / Bibliotek           | Formål                                                                 |
|------------------------------|------------------------------------------------------------------------|
| `$env/dynamic/private`       | Henter miljøvariabler (API-nøkler) som ikke skal være synlige for klienten |
| `@sveltejs/kit` (`json`)     | Returnerer JSON-responser fra server-endepunkter på standardisert måte |
| `path`                       | Node.js-modul for håndtering av filstier på serveren               |
| `openai`                     | OpenAI-klient for kommunikasjon med API og AI-generering |
| `mistral`                    | MistralAI-klient for kommunikasjon med API og AI-genererin|
| `selectLogic.js`              | Sentral routing-logikk for multi-agent systemet                    |



### Installasjon og oppsett

# Forutsetninger

- ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
- OpenAI API-nøkkel
- Mistral API-nøkkel

# Kloning av repository

```bash
git clone https://github.com/ditt-brukernavn/FagAssistenten.git
cd FagAssistenten
```

# Installer avhengigheter

```bash
npm install
```

# Opprett miljøvariabler

Lag en `.env`-fil i prosjektroten:

```env
OPENAI_API_KEY=din_openai_api_nokkel
# Tilleggskonfigurationer for agenter (valgfritt)
# VECTOR_STORE_ID=din_vector_store_id  
# INSTRUCTIONS=instruksjoner_til_botten
```

# Start utviklingsserver

```bash
npm run dev
```

Åpne nettleseren på `http://localhost:5173`


### Sikkerhet og personvern

For å beskytte personvernet i dette prosjektet har jeg benyttet meg av samme løsning som det er i dagens Hugin. Med AI-leverandørene er det avtaler som zero retention avtale med Mistral og 30 dagers lagring av OpenAI. Med disse avtalene sikres det at:

### Datahåndtering

- **Mistral AI**: Zero retention policy - ingen data lagres permanent
- **OpenAI**: 30 dagers lagringspolicy før automatisk sletting
- **Lokal lagring**: Ingen sensitiv data lagres lokalt i nettleseren
- **API-nøkler**: Sikret gjennom miljøvariabler på serversiden

### Sikkerhetstiltak

- **Server-side API calls**: Alle forespørsler går via backend for å skjule API-nøkler
- **Miljøvariabler**: Sensitive data eksponeres ikke til frontend

### Personvernshensyn

- **Ingen persistent lagring**: Chat-historikk lagres ikke permanent
- **Anonymisering**: Ingen personidentifiserbar informasjon samles inn
- **Transparent**: Brukere informeres om hvilken AI-leverandør som brukes



### Feilsøkings strategier
Under hele prosjektet har jeg benyttet to feilsøkingsstrategier som har hjulpet meg med å komme videre underveis:

-**Console-logging av prosesser:** Å logge til konsollen hva som skjer, kan hjelpe med å se hvor programmet feiler.

-**Bryte ned problemet:** Jeg har brutt ned problemer i små Python-skript, og isolert problemet i en mindre skala.

Begge disse metodene har vært veldig hjelpsomme. De lar meg se hvordan prosessen gjennomføres i praksis underveis, og gir meg mulighet til å identifisere hva som må rettes opp.
