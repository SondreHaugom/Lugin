import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";
import { systemInstruks as defaultSystemInstruks } from '$lib/openAISystemInstruks.js';

// Bruk systemInstruks fra systeminstruks.js, eller fallback til standardverdi

// Hent OpenAI API-nøkkel fra miljøvariabler
const openai_api_key = env.OPENAI_API_KEY;

const VC_STORE_ID = env.VC_STORE_ID; // ID for Vector Store, hentet fra miljøvariabler
// Oppretter en OpenAI-klient med API-nøkkelen
const client = new OpenAI({
    apiKey: openai_api_key
});



// Denne funksjonen håndterer POST-forespørsler til OpenAI-endpointet, sender melding og instruksjoner til OpenAI API, og returnerer svaret og response ID
/** @type {import('./$types').requestHandler} */

// Håndterer POST-forespørsler, sender melding og instruksjoner til OpenAI API, og returnerer svaret og response ID
export async function POST(request) {
    try {
        // henter melding, tidligere response ID og systeminstruksjoner fra forespørselen
        const { message, previousResponseId, systemInstruks } = await request.request.json();

        // Oppretter en forespørsel til OpenAI API med melding, systeminstruksjoner og tidligere response ID, og mottar svaret
        const response = await client.responses.create({
            model: "gpt-5-nano-2025-08-07",
            instructions: systemInstruks || defaultSystemInstruks, 
            tools: [
                { type: "web_search" },
            ],
            input: [
                {
                    role: "user",
                    content: message,
                },
            ],
            previous_response_id: previousResponseId
        });
        // returnerer svaret og response ID i JSON-format
        console.log ('systemInstruks:', systemInstruks || defaultSystemInstruks);
        return json({ 
            response: response.output_text,
            responseId: response.id 
    });
    } catch (error) { // håndterer eventuelle feil som oppstår under API-kallet og returnerer en feilmelding
        console.error("Error in OpenAI API call:", error);
        return json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
    
}

console.log("System")