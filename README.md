###
 Lugin

Min helt egen KI-tjeneste, basert på min halvårsvurdering. 

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Speech Synthesis](https://img.shields.io/badge/Speech%20Synthesis-0A66C2?style=for-the-badge&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)


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
- [Nye-funksjoner-og-forbedringer](#-Nye-funksjoner-og-forbedringer)
- [Feilsøkings-strategier](#-Feilsøkings-strategier)


### Funksjoner
- **Moderne chatgrensesnitt** med Svelte
- **Multi-agent støtte**: ChatGPT (OpenAI) og Ollama (lokal/sky AI)
- **Talesyntese** med norsk stemme (Microsoft Sonia) - trykk 'M' for å avbryte
- **Autentisering** med brukernavn/passord-system
- **Responsivt design** med gradient-bakgrunner og moderne styling
- **Modulær arkitektur** med separert agent-logikk og komponenter  
- **Tastaturnavigasjon** (Enter for å sende)
- **Systemflyt-visualisering** med integrert flytdiagram
- **Modulære komponenter** (UserInput, AgentInstruks, TypingDots, Autentisering)
- **Streaming av respons** (Svar fra botten kommer delsvis underveis)
- **Scroll-til-topp** funksjonalitet for bedre navigasjon
- **Markdown og KaTeX støtte** for formatert tekst og matematiske uttrykk
- **Syntax highlighting** med highlight.js





### Om prosjektet

Dette er min egen KI-tjeneste basert på en avansert språkmodell (en agent). Systemet er bygget med en multi-agent arkitektur, utviklet med SvelteKit, og inkluderer for øyeblikket to hovedleverandører – OpenAI og Ollama. Systemet gjør det mulig å skifte mellom de ulike agentene underveis i bruk, selv om hver agent vil operere uavhengig av de andre og ikke kjenne til responsene deres. 

Prosjektet har utviklet seg betydelig siden oppstarten og inkluderer nå avanserte funksjoner som talesyntese, autentisering og forbedret brukeropplevelse. På sikt planlegger jeg å utstyre agentene med flere funksjonskall for å muliggjøre tilgang til ekstern informasjon, slik at de kan benytte seg av oppdaterte data utenfor sitt treningsgrunnlag.

Løsningen er utviklet som en del av en halvårsvurdering etter å ha vært lærling i over seks måneder, og viser frem både teknisk kompetanse og praktisk implementering av moderne AI-integrasjoner.


### Prosjektstruktur

```
Lugin/
├── src/
│   ├── lib/
│   │   ├── selectAgent.js          # Velger hvilken AI som skal brukes
│   │   ├── markdown.js             # Markdown og KaTeX rendering
│   │   ├── speakMessage.js         # Talesyntese-funksjonalitet
│   │   ├── scrollToTop.js          # Scroll-til-topp funksjonalitet
│   │   ├── openAISystemInstruks.js # Systeminstruksjoner for OpenAI
│   │   ├── index.js                # Bibliotek-eksporter
│   │   ├── global.css              # Global styling
│   │   ├── assets/                 # Statiske ressurser
│   │   └── logo/                   # Logo-filer
│   └── routes/
│       ├── +page.svelte            # Hovedside med chat
│       ├── +layout.svelte          # Global layout og styling
│       ├── components/
│       │   ├── agentInnstruks.svelte    # Systeminstruksjoner
│       │   ├── userInput.svelte         # Brukerinput komponent
│       │   ├── autentisering.svelte     # Autentiserings-komponent
│       │   └── TypingDots.svelte        # Lading-indikator
│       └── server/
│           ├── Openai/+server.js        # OpenAI backend
│           │   └── StremingWithOpenAI.py # Python test-script
│           └── Ollama/+server.js        # Ollama backend
│               └── streamingWithOllama.py # Python test-script
├── ollama/                         # Python virtuelt miljø for Ollama
├── static/                         # Statiske filer
├── System flyt.png                 # Systemflyt diagram
├── package.json
└── README.md
```

### Systemflyt

Se det komplette flytdiagrammet for prosjektet:

![Systemflyt](System%20flyt.png)

*Diagrammet viser den fullstendige dataflyten mellom komponenter, agenter og API-er.*

### Dataflyt

```
👤 Bruker logger inn (autentisering.svelte)
    ↓
🔒 Lagrer innloggingsstatus i localStorage
    ↓
👤 Bruker skriver melding i chat
    ↓
📱 Frontend (+page.svelte) med TypingDots-indikator
    ↓
🔄 selectAgent.js (bestemmer hvilken agent: OpenAI/Ollama)
    ↓
🤖 API Endpoint (/server/{agent}/+server.js)
    ↓
🌐 Eksterne AI API (OpenAI/Ollama)
    ↓
📝 Streaming JSON Response tilbake til frontend
    ↓  
💬 Markdown-rendering med KaTeX og syntax highlighting
    ↓
🔊 Valgfri talesyntese (speakMessage.js) - trykk 'M' for å avbryte
    ↓
📜 Scroll-til-topp funksjonalitet (scrollToTop.js)
```

### Filforklaring

| Fil/Mappe | Funksjon | Type |
|-----------|----------|------|
| `+page.svelte` | Chat-grensesnitt, brukerinteraksjon, DOM-håndtering | Frontend |
| `+layout.svelte` | Global styling, CSS variabler, favicon | Layout |
| `selectAgent.js` | Router meldinger til riktig AI-agent | Middleware |
| `server/Openai/+server.js` | API endpoint for OpenAI GPT modeller | Backend API |
| `server/Ollama/+server.js` | API endpoint for Ollama (lokal/sky AI) | Backend API |
| `components/agentInnstruks.svelte` | Systeminstruksjoner for agenter | Component |
| `components/userInput.svelte` | Modulær brukerinput-komponent | Component |
| `components/autentisering.svelte` | Autentisering med brukernavn/passord | Component |
| `components/TypingDots.svelte` | Animert lading-indikator | Component |
| `lib/markdown.js` | Markdown og KaTeX rendering | Utility |
| `lib/speakMessage.js` | Talesyntese med Microsoft Sonia stemme | Utility |
| `lib/scrollToTop.js` | Scroll-til-topp funksjonalitet | Utility |
| `lib/openAISystemInstruks.js` | Systeminstruksjoner for OpenAI | Utility |
| `lib/index.js` | Bibliotek-eksporter | Utility |
| `server/Openai/StremingWithOpenAI.py` | Python test script for OpenAI streaming | Testing |
| `server/Ollama/streamingWithOllama.py` | Python test script for Ollama streaming | Testing |
| `ollama/` | Python virtuelt miljø for Ollama-integrasjon | Environment |

### Arkitektur-prinsipper

- **Frontend**: Svelte/SvelteKit for reaktiv UI med moderne komponenter
- **Backend**: SvelteKit API routes (`+server.js` filer)  
- **Agent-system**: Modulær oppbygning hvor hver AI-leverandør har sitt eget API endpoint
- **Autentisering**: Sikkerhet med localStorage og miljøvariabler
- **Responsiv design**: Mobile-first tilnærming med CSS Grid/Flexbox
- **Talesyntese**: Web Speech API med norsk stemme-støtte
- **Python-integrasjon**: Virtuelt miljø for Ollama og test-scripts
- **Streaming**: Sanntids AI-responser for bedre brukeropplevelse


### Forklaring av API kall
For dette prosjektet bruker vi to hovedleverandører for AI-tjenester:
- **OpenAI** - Tilgang til GPT-modeller via sky-API
- **Ollama** - Støtte for både lokale og sky-baserte modeller som Ministral

Hver leverandør tilbyr et API som vi bruker for å kommunisere med deres språkmodeller. Når en bruker sender en prompt til den valgte modellen, sendes denne forespørselen til det aktuelle API-et (OpenAI eller Ollama). API-et videresender så forespørselen til språkmodellen, som genererer et svar (respons) som streames tilbake i sanntid. Dette svaret sendes tilbake via API-et og vises til brukeren med full markdown-støtte og valgfri talesyntese.


### Bruk av funksjonskall i prosjektet
Prosjektet har en modulær tilnærming til AI-integrasjoner hvor hver leverandør har sitt eget API-endpoint. Python-miljøet (ollama/) inneholder test-scripts som demonstrerer hvordan streaming fungerer med både OpenAI og Ollama. 

Systemet støtter:
- **Streaming responses** fra begge AI-leverandører
- **Markdown og KaTeX rendering** for formatert innhold
- **Talesyntese** som konverterer AI-responser til tale
- **Autentisering** for sikker tilgang
- **Modulær komponent-arkitektur** for enkel utvidelse

Dette gir en solid foundation for fremtidige utvidelser som funksjonskall og eksterne API-integrasjoner.



### Biblioteker og begrunnelse

| Import / Bibliotek           | Formål                                                                 |
|------------------------------|------------------------------------------------------------------------|
| `$env/dynamic/private`       | Henter miljøvariabler (API-nøkler) som ikke skal være synlige for klienten |
| `$env/dynamic/public`        | Henter offentlige miljøvariabler for autentisering |
| `@sveltejs/kit` (`json`)     | Returnerer JSON-responser fra server-endepunkter på standardisert måte |
| `@sveltejs/kit` (`error`)    | Håndterer feil i SvelteKit-applikasjoner |
| `$app/environment`           | Tilgang til miljøvariabler som `browser` for klient-side logikk |
| `path`                       | Node.js-modul for håndtering av filstier på serveren               |
| `openai`                     | OpenAI-klient for kommunikasjon med API og AI-generering |
| `ollama`                     | Ollama-klient for lokal og sky-basert AI-kommunikasjon |
| `selectLogic.js`             | Sentral routing-logikk for multi-agent systemet                    |
| `katex`                      | Matematisk formelrendering for LaTeX-støtte |
| `markdown-it`                | Markdown-parser og -renderer |
| `highlight.js`               | Syntax highlighting for kodeblokker |
| `uuid`                       | Generering av unike identifikatorer |
| `marked`                     | Alternativ markdown-parser |



### Installasjon og oppsett

# Forutsetninger

- ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
- ![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=flat&logo=python&logoColor=white)
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
- OpenAI API-nøkkel
- Ollama API-nøkkel (for sky-bruk) eller lokal Ollama-installasjon

# Kloning av repository

```bash
git clone https://github.com/SondreHaugom/Lugin.git
cd Lugin
```

# Installer avhengigheter

```bash
npm install
```

# Python miljø (for Ollama)

```bash
# Python virtuelt miljø er allerede satt opp i ollama/
# For å aktivere på Windows:
.\ollama\Scripts\Activate.ps1

# Installer Python-avhengigheter hvis nødvendig:
pip install ollama openai python-dotenv
```

# Opprett miljøvariabler

Lag en `.env`-fil i prosjektroten:

```env
OPENAI_API_KEY=din_openai_api_nokkel
OLLAMA_API_KEY=din_ollama_api_nokkel
PUBLIC_ADMIN_BRUKERNAVN=ditt_brukernavn
PUBLIC_ADMIN_PASSORD=ditt_passord
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

For å beskytte personvernet i dette prosjektet har jeg implementert flere sikkerhetslag og benytter samme retningslinjer som i dagens Hugin-system. Med AI-leverandørene er det forskjellige datalagring-policyer:

### Datahåndtering

- **Ollama**: Kan kjøres lokalt for full datakontroll, eller via sky med tilpasset datalagring
- **OpenAI**: 30 dagers lagringspolicy før automatisk sletting 
- **Lokal lagring**: Autentisering lagres i localStorage, ingen sensitiv chat-data lagres permanent
- **API-nøkler**: Sikret gjennom miljøvariabler på serversiden

### Sikkerhetstiltak

- **Autentisering**: Brukernavn/passord-system med localStorage-lagring
- **Server-side API calls**: Alle forespørsler går via backend for å skjule API-nøkler
- **Miljøvariabler**: Sensitive data eksponeres ikke til frontend
- **Python virtuelt miljø**: Isolert miljø for Ollama-integrasjon

### Personvernshensyn

- **Ingen persistent chat-lagring**: Chat-historikk lagres ikke permanent på serveren
- **Anonymisering**: Ingen personidentifiserbar informasjon samles inn utover autentisering
- **Transparent**: Brukere kan velge mellom AI-leverandører og ser tydelig hvilken som brukes
- **Lokal AI-mulighet**: Med Ollama kan alt kjøres lokalt uten eksterne API-er

### Nye sikkerhetsfunksjoner

- **Talesyntese**: Kjører lokalt i nettleseren via Web Speech API
- **Keyboard shortcuts**: 'M' for å avbryte tale - ingen data sendes eksternt
- **Modulær arkitektur**: Enkel å deaktivere eller endre leverandører



### Nye funksjoner og forbedringer

Siden første versjon har prosjektet fått mange betydelige oppdateringer:

#### 🔊 Talesyntese
- **Microsoft Sonia** Engelsk stemme som standard
- **Markdown-rensing** før talesyntese for ren lydopplevelse  
- **Keyboard shortcut** - trykk 'M' for å avbryte tale
- **Automatisk språkdeteksjon** - engelsk fallback

#### 🔐 Autentiseringssystem
- **Sikker innlogging** med brukernavn og passord
- **localStorage** for varig innlogging-status
- **Miljøvariabel-basert** konfigurasjon
- **Automatisk omdirigering** til hovedapp ved vellykket innlogging

#### 🤖 Ollama-integrasjon  
- **Ministral 3:14b** sky-modell fra Ollama
- **Python virtuelt miljø** for testing og utvikling
- **Streaming støtte** for sanntids-responser
- **Lokale muligheter** for fremtidig implementering

#### 🎨 UI/UX forbedringer
- **TypingDots** animert lading-indikator  
- **Scroll-til-topp** funksjonalitet for bedre navigasjon
- **Forbedret markdown** med KaTeX matematikk-støtte
- **Syntax highlighting** med highlight.js
- **Responsiv design** optimalisert for alle enheter

#### 🛠️ Tekniske forbedringer
- **Modulær komponent-arkitektur** for enkel vedlikehold
- **Streaming API-responser** fra alle leverandører  
- **Forbedret feilhåndtering** med SvelteKit error-system
- **Python test-scripts** for API-testing og utvikling
- **UUID-støtte** for unik identifisering
Under hele prosjektet har jeg benyttet to feilsøkingsstrategier som har hjulpet meg med å komme videre underveis:

-**Console-logging av prosesser:** Å logge til konsollen hva som skjer, kan hjelpe med å se hvor programmet feiler.

-**Bryte ned problemet:** Jeg har brutt ned problemer i små Python-skript, og isolert problemet i en mindre skala.

Begge disse metodene har vært veldig hjelpsomme. De lar meg se hvordan prosessen gjennomføres i praksis underveis, og gir meg mulighet til å identifisere hva som må rettes opp.
