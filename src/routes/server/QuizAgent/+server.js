import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";
import { quizAgentSystemInstruks as defaultSystemInstruks } from '$lib/openAISystemInstruks.js';

// Bruk systemInstruks fra systeminstruks.js, eller fallback til standardverdi

// Hent OpenAI API-nøkkel fra miljøvariabler
const openai_api_key = env.TFK_OPENAI_API_KEY;

const vector_store_id = env.VECTOR_STORE_ID; 

// Oppretter en OpenAI-klient med API-nøkkelen
const client = new OpenAI({
    apiKey: openai_api_key2
});

if (!openai_api_key) {
    console.error("TFK_OPENAI_API_KEY is not set in environment variables.");
    throw new Error("TFK_OPENAI_API_KEY is required");
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
            // legger til fil-søk som funksjonalitet. 
            tools: [
                {
                    type: "file_search",
                    vector_store_ids: [vector_store_id], // Bruk VECTOR_STORE_ID fra miljøvariabler
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