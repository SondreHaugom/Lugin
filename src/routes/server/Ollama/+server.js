import { Ollama } from "ollama";
import {env} from '$env/dynamic/private';
import { json } from "@sveltejs/kit";

const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {'Authorization': 'Bearer ' + env.OLLAMA_API_KEY}
})

if (!env.OLLAMA_API_KEY) {
    console.error("OLLAMA_API_KEY is not set in environment variables.");
    throw new Error("OLLAMA_API_KEY is required");
}

/** @type {import('./$types').requestHandler} */

export async function POST({ request}) {
    try {
        const { message, conversationHistory = [] } = await request.json();

        if (!message) {
            return json({ error: 'Message is required' }, { status: 400 });
        }

        const MAX_MSGS = 8
        const trimmedHistory = conversationHistory.slice(-MAX_MSGS); // Behold kun de siste MAX_MSGS meldingene
        // Legg til ny brukermelding
        trimmedHistory.push({ role: 'user', content: message });
        
        const respons = await ollama.chat({
            model: 'mistral-large-3:675b-cloud',
            
            messages: [
                {
                    role: 'system', content: 'Du er en hjelpsom assistent som alltid svarer kun på engelsk uansett hvilke språk brukeren skriver på. Svar rolig, høflig og ærlig. Vær tydelig og praktisk. Hold svar korte og konsise med mindre brukeren ber om mer detaljer. Hvis noe er uklart, still ett kort oppfølgingsspørsmål.'
                },
                {
                    role: 'user', content: trimmedHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
                }

            ],
            options: {
                // Setter en grense for hvor mange tokens som kan brukes for både kontekst og prediksjon, for å unngå at modellen bruker for mye ressurser
                num_ctx: 2045,
                num_predict: 2050,
                'temperature': 0.10, // Justerer kreativiteten i svarene, hvor høyere verdi gir mer kreative svar
            }
        });

        const content = respons.message?.content || respons.content || '';
        
        // Legg til AI-svar
        trimmedHistory.push({ role: 'assistant', content: content });

        return json({ 
            response: content,
            conversationHistory: trimmedHistory // Send tilbake oppdatert historikk
        });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
} 