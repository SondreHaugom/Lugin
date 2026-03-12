import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";
import { systemInstruks as defaultSystemInstruks } from '$lib/openAISystemInstruks.js';

// Bruk systemInstruks fra systeminstruks.js, eller fallback til standardverdi

// Hent OpenAI API-nøkkel fra miljøvariabler
const openai_api_key = env.OPENAI_API_KEY;

const VC_STORE_ID = env.VC_STORE_ID; // ID for Vector Store, hentet fra miljøvariabler

if (!VC_STORE_ID) {
    console.error("VC_STORE_ID is not set in environment variables.");
    throw new Error("VC_STORE_ID is required");
}

// Oppretter en OpenAI-klient med API-nøkkelen
const client = new OpenAI({
    apiKey: openai_api_key
});

if (!openai_api_key) {
    console.error("OPENAI_API_KEY is not set in environment variables.");
    throw new Error("OPENAI_API_KEY is required");
}


// Denne funksjonen håndterer POST-forespørsler til OpenAI-endpointet, sender melding og instruksjoner til OpenAI API, og returnerer svaret og response ID
/** @type {import('./$types').requestHandler} */

// Håndterer POST-forespørsler, sender melding og instruksjoner til OpenAI API, og returnerer svaret og response ID
export async function POST(request) {
    try {
        // henter melding, tidligere response ID og systeminstruksjoner fra forespørselen
        const { message, previousResponseId, systemInstruks } = await request.request.json();

        if (!message && !systemInstruks) {
            return json({ error: 'Message and system instructions are required' }, { status: 400 });
        };

        // Oppretter en forespørsel til OpenAI API med melding, systeminstruksjoner og tidligere response ID, og mottar svaret
        const response = await client.responses.create({
            model: "gpt-5.4",
            instructions: systemInstruks || defaultSystemInstruks, 
            input: [
                {
                    role: "user",
                    content: message,
                },
            ],
            max_output_tokens: 1045, // setter en grense for hvor mange tokens som kan brukes i svaret, for å unngå at modellen bruker for mye ressurser
            reasoning: {
                effort: "medium",
            },
            // legger til netsøk som funksjonalitet. 
            tools: [
                {
                    type: "web_search",
                    parameters: {
                        query: message,
                        num_results: 3, // Antall søkeresultater å hente
                    },
                }
            ],
            previous_response_id: previousResponseId,
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