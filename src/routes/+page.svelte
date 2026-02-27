<script>
  // importerer onMount fra svelte
  import { onMount } from "svelte";
  import { selectAgent} from "../lib/selectAgent.js";
  import { marked } from 'marked';
  import { md, addKaTexToMathStrings, wrapInPreCode } from "../lib/markdown.js";
  import '$lib/global.css';
  import AgentInnstruks from './components/agentInnstruks.svelte';
  import UserInput from './components/userInput.svelte';
  import Autentisering from "./components/autentisering.svelte";   
  import { integrationsFromJSON } from "@mistralai/mistralai/models/components/completionjobout.js";
  

    // deklarerer globale variabler
    let chatbox, userInput, sendBtn, resetBtn, toggleBtn, selectBtn;
    let currentAgent = "Openai"; // Standard agent
    let systemInstruks = ""; // For å holde systeminstruksjoner
    let audioFile = null; // For å holde valgt lydfil for transkripsjon
    let isLoggedIn = false; // For å spore innloggingsstatus

    // Funksjon for å håndtere vellykket innlogging
    function handleSuccessfulLogin() {
        isLoggedIn = true;
    }
    

    // Store response ID per agent
    let agentResponseIds = {
        'Openai': null,
        'Ollama': Date.now().toString(), // Start med en unik ID for å unngå null ved første melding

    };

    let agentResponseIDHistory = {
        'Openai': [],
        'Ollama': [ agentResponseIds['Ollama']] // Start historikken med den første ID-en,

    };

    // variabel for å spore menyens tilstand
    let isMenuOpen = true;

    // vis menyen basert på skjermstørrelse
    if (typeof window !== 'undefined' && window.innerWidth < 600) {
        isMenuOpen = false;
    }

    // funksjon for å åpne/lukke menyen
    const sidebar = () => {
        isMenuOpen = !isMenuOpen;


    }

    // funksjon for å streame tekst
    const streamText = (element, text, speed = 2) => {
        const markdownText = md.render(addKaTexToMathStrings(wrapInPreCode(text)));
        // definerer en indeks for å holde styr på posisjonen i teksten
        let index = 0;
        // tømmer innholdet i elementet før streaming
        element.innerHTML = '';

        const interval = setInterval(() => {
            element.innerHTML = markdownText.substring(0, index + 1);
            index++;
            if (index >= markdownText.length) {
                clearInterval(interval);
            }
            chatbox.scrollTop = chatbox.scrollHeight;
        }, speed);
    };

    // funksjon for å opprette og legge til meldinger i chatboksen
    const createChatMessage = (message, className, isStreaming = false) => {
        // oppretter en listeelement for meldingen
        let chatLi = document.createElement("li");

        // legger til riktig klasse basert på om meldingen er fra brukeren eller boten
        chatLi.classList.add(className);

        // legger til et tomt div for meldingsinnholdet
        let content = '';
        // sjekker om meldingen er fra boten eller brukeren og legger til riktig div
        if (className === 'chat_incoming') {
            content = `<div class="bot_message"></div>`;
        } else {
            content = `<div class="user_message"></div>`;
        }
        // legger til innholdet i listeelementet
        chatLi.innerHTML = content;
        // legger til listeelementet i chatboksen
        chatbox.appendChild(chatLi);
        // henter meldingsdiven
        const messageDiv = chatLi.querySelector(className === 'chat_incoming' ? '.bot_message' : '.user_message');

        if (isStreaming && className === 'chat_incoming') {
            streamText(messageDiv, message);
        } else if (className === 'chat_incoming') {
            // bruker markdown-funksjonen for å formatere botens svar
            messageDiv.innerHTML = md.render(addKaTexToMathStrings(wrapInPreCode(message)));
        } else {
            messageDiv.textContent = message;
        }

         // ruller chatboksen til bunnen for å vise den nyeste meldingen
         chatbox.scrollTop = chatbox.scrollHeight;
    }


    // funksjon for å sende meldinger og motta svar fra Valgte KI-agent
    function sendtMessage() {

        // henter og skjekker brukerdata fra inputfeltet
        const inputmessage = userInput.value.trim();
        // Skjekker om motat melding er tom
        if (inputmessage === "") return;
        // viser brukerens melding i chatboksen
        createChatMessage(inputmessage, 'chat_outgoing');

        // henter valgt agent fra dropdown-menyen
        const selectedAgent = selectBtn.value;
        // henter tidligere response ID for denne agenten
        const previousResponseId = agentResponseIds[selectedAgent];
        console.log("Previous Response ID for " + selectedAgent + ": " + previousResponseId);

        
        // sender melding til SelectAgent.js og venter på svar fra utvalgt agent
        selectAgent(inputmessage, selectedAgent, systemInstruks, previousResponseId).then((result) => {
            // Lagre ny response ID for denne agenten
            agentResponseIds[selectedAgent] = result.responseId;
            agentResponseIDHistory[selectedAgent].push(result.responseId);
            console.log("Response ID for " + selectedAgent + ": " + result.responseId);
            console.log("Response ID History for " + selectedAgent + ": " + agentResponseIDHistory[selectedAgent]);
        
            
            
            createChatMessage(result.response, 'chat_incoming', true);

        });
        
        // tømmer inputfeltet etter sending
        userInput.value = "";
    }


    onMount((async () => {
        chatbox = document.querySelector(".chatbox");
        userInput = document.querySelector(".user_input");
        sendBtn = document.querySelector(".sendBtn");
        resetBtn = document.querySelector(".resetBtn");
        toggleBtn = document.querySelector(".sidebar-btn");
        selectBtn = document.querySelector(".select-btn");



        if (sendBtn) {
            sendBtn.addEventListener("click", sendtMessage);
        }


        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
            let userChoice = confirm("Er du sikker på at du vil starte en ny samtale? Dette vil slette all tidligere samtalehistorikk.");
            if (userChoice) {
                agentResponseIds = {
                    'Openai': null,
                    'Ollama': null
            };
                agentResponseIDHistory = {
                    'Openai': [],
                    'Ollama': []
            };
            chatbox.innerHTML = '';
                alert("Ny samtale startet!");
            }
        });
        }

        if (userInput) {
            userInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    sendtMessage();
                }
            })
        }

        if (selectBtn) {
            selectBtn.addEventListener("change", () => {
                currentAgent = selectBtn.value;
            });
        }

    }
    ));

</script>

<head>

    <title>Lugin</title>
</head>


<main>
    <button class="sidebar-btn" title="Åpne/lukk meny" on:click={sidebar} type="button">☰</button>
    <button class="resetBtn" title="Ny Samtale" type="button">⟳</button>
    <div class="sidebar" class:open={isMenuOpen}>
        <h1>
            Lugin
        </h1>
        <select title="Velg agent" class="select-btn" name="" id="">
            <option value="Openai">ChatGPT-lite</option>
            <option value="Ollama">Ollama</option>
        </select>
        <div class="userData">
        </div>
    </div>

    {#if !isLoggedIn}
        <Autentisering onLogin={handleSuccessfulLogin} />
    {:else}
        <div class="chatbot_wrapper" class:shifted={isMenuOpen}>
            
            {#if currentAgent === "Openai"}
                <AgentInnstruks bind:systemInstruks />
            {/if}

            {#if currentAgent === "Transkripsjon"}
                <Transkripsjon bind:audioFile />
            {:else}
                <UserInput />
            {/if}

            <ul class="chatbox">
                <li class="chat_incoming">
                </li>

            </ul>
        </div>
        <p class="appVersjon">v0.3</p>
    {/if}</main>

<style>




main {
    background:
  radial-gradient(circle at 25% 20%, rgba(41,74,149,0.18) 0%, rgba(41,74,149,0) 60%),
  linear-gradient(135deg, #181b28 0%, #14161b 55%, #23272f 100%);
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    font-family: "Cascadia Mono", "Consolas", "Lucida Console", monospace;
}
h1 {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 20px;
    color: white;
}
.appVersjon {
    position: fixed;
    bottom: 10px;
    right: 10px;
    color: #545454;
    font-size: 15px;
    margin-right: 20px;
}
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(.77,.2,.05,1.0); 
}
.sidebar.open {
    transform: translate(0);
}
.sidebar-btn {
    position: fixed;
    top: 20px;
    left: 10px;
    height: 35px;
    width: 35px;
    border-radius: 8px;
    z-index: 1000;
    border: none;
    padding: 0;
    cursor: pointer;
    
    /* Enkel glassstil */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    border: 1px solid rgba(255, 255, 255, 0.15);
    
    color: white;
    font-size: 16px;
    
    /* Enkel skygge */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    
    transition: all 0.2s ease;
}

.sidebar-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.sidebar-btn:active {
    transform: translateY(0px);
}
.resetBtn {
    position: fixed;
    margin-top: 65px;
    left: 10px;
    height: 35px;
    width: 35px;
    border-radius: 8px;
    z-index: 1000;
    border: none;
    padding: 0;
    cursor: pointer;
    
    /* Matching enkel stil */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    border: 1px solid rgba(255, 255, 255, 0.15);
    
    color: white;
    font-size: 16px;
    
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    
    transition: all 0.2s ease;
}

.resetBtn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.resetBtn:active {
    transform: translateY(0px);
}
.select-btn {
    width: 100%;
    padding: 10px;
    margin-top: 35px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    
    /* Enkel glassstil */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    color: white;
    font-size: 16px;
    
    /* Enkel skygge */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    
    transition: all 0.2s ease;
}

.select-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
}

.select-btn option {
    background-color: rgba(24, 27, 40, 0.95);
    color: white;
    padding: 8px;
    border: none;
}

.select-btn option:hover,
.select-btn option:checked {
    background-color: rgba(41, 74, 149, 0.8);
}

.select-btn option:hover,
.select-btn option:checked {
    background-color: rgba(41, 74, 149, 0.8); /* Blåaktig när hover/selected */
}
.chatbox {
    position: absolute;
    top: 30px;
    left: 25%;
    width: 51%;
    overflow-y: auto;
    max-width: 51%;
    height: 850px;
    z-index: 2000;
    border-color: var(--color-stein-50);


}

.chatbot_wrapper {
    transition: margin-left 0.4s cubic-bezier(.77,.2,.05,1.0), width 0.4s cubic-bezier(.77,.2,.05,1.0);
    position: absolute;
    top: 10px;
    width: 97.03%;
    max-width: 97.03%;
    height: 98%;
    border-radius: 20px;
    margin-left: 50px;
    display: block;
    
    /* Subtle glassmorphism uten fargendring */
    background: rgba(255, 255, 255, 0.02);
    
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    
    /* Diskret border som matcher tema */
    border: 1px solid rgba(255, 255, 255, 0.08);
    
    /* Enhanced shadow for dybde */
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.03);
    
    position: relative;
}

/* Mer subtil glow som matcher bakgrunnen */
.chatbot_wrapper::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(45deg, 
        rgba(41, 74, 149, 0.1) 0%, 
        rgba(255, 255, 255, 0.02) 25%, 
        rgba(41, 74, 149, 0.08) 50%, 
        rgba(255, 255, 255, 0.02) 75%, 
        rgba(41, 74, 149, 0.1) 100%);
    border-radius: 21px;
    z-index: -1;
    opacity: 0.3;
    filter: blur(0.5px);
}

.chatbot_wrapper.shifted {
    margin-left: 205px;
    width: calc(99% - 195px);
}

    :global(.chat_incoming), :global(.chat_outgoing) {
        list-style-type: none;
        padding: 0;
        margin: 0;
}
    :global(.user_message) {
            backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);

        color: white;
        padding: 10px;
        border-radius: 10px;
        border-bottom-right-radius: 1px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        display: table;        /* krymper til innhold, men kan auto-margins */
        width: fit-content;
        max-width: 40%;

        margin: 10px 10px 10px auto;

        text-align: left;
        white-space: normal;
        overflow-wrap: break-word;
    }
    :global(.bot_message) {
        text-align: left;
        color: white;
        padding: 10px;
        margin: 10px;
        width: auto;
        max-width: 73%;
        align-self: flex-start;
        display: block;
}


@media (min-width: 300px) and (max-width: 600px) {
        .chatbot_wrapper {
                width: 86%;
        }
        .chatbox {
            left: 1%;
            max-height: 80%;
            width: 86% !important;
            max-width: 86% !important;
            overflow-y: auto;

        }
        :global(.user_message) {
            font-size: 12px;
            margin-left: 50%;
        }  
        :global(.bot_message) {
            font-size: 12px;
            margin: 10px 10px 10px 0px !important; /* top right bottom left */
            padding-left: 0px !important;
            position: static; /* sikrer at den ikke er absolute */
}

}

@media (min-width: 601px) and (max-width: 1200px) {
            .chatbox {
            left: 21%;
            max-height: 80% !important;
            max-width: 80% !important;
            overflow-y: auto;


        }
        .chatbot_wrapper {
            width: 92.2%;
        }
        .chatbot_wrapper.shifted {
            margin-left: 200px;
            width: calc(99% - 200px);
        }
         :global(.user_message) {
            font-size: 15px;
            margin-left: 50%;
        }  
        :global(.bot_message) {
            position: static;
            right: 80px;
            top: 80px;
            font-size: 15px;

    
        } 
}

@media (min-width: 1200px) and (max-width: 1800px) {
        .chatbox {
            left: 23%;
            max-height: 83%;
            max-width: 60%;
            overflow-y: auto;


        }
        .chatbot_wrapper {
            width: 95.95%;
            border-color: var(--color-stein-50);
        }
        .chatbot_wrapper.shifted {
            margin-left: 200px;
            width: calc(99.2% - 200px);
        }
        
}
</style>