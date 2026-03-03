import { Ollama } from "ollama";
import {env} from '$env/dynamic/private';
import { json } from "@sveltejs/kit";

const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {'Authorization': 'Bearer ' + env.OLLAMA_API_KEY}
})

/** @type {import('./$types').requestHandler} */

export async function POST({ request}) {
    try {
        const { message, conversationHistory = [] } = await request.json();

        const MAX_MSGS = 8
        const trimmedHistory = conversationHistory.slice(-MAX_MSGS); // Behold kun de siste MAX_MSGS meldingene
        // Legg til ny brukermelding
        trimmedHistory.push({ role: 'user', content: message });
        
        const respons = await ollama.chat({
            model: 'ministral-3:3b-cloud',
            
            messages: [
                {
                    role: 'system', content: 'Du er en hjelpsom assistent som alltid svarer på norsk (bokmål). Svar rolig, høflig og ærlig. Vær tydelig og praktisk. Hold svar korte og konsise med mindre brukeren ber om mer detaljer. Hvis noe er uklart, still ett kort oppfølgingsspørsmål.'
                },
                {
                    role: 'user', content: trimmedHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
                }

            ],
            options: {
                num_ctx: 600,
                num_predict: 250,
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