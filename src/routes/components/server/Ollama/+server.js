import { Ollama } from "ollama";
import {env} from '$env/dynamic/private';
import { json } from "@sveltejs/kit";
import crypto from 'crypto';

const ollama = new Ollama({
    host: "https://ollama.com",
    headers: {'Authorization': 'Bearer ' + env.OLLAMA_API_KEY}
})

/** @type {import('./$types').requestHandler} */

export async function POST({ request}) {
    try {
        const { message, conversationHistory = [] } = await request.json();
        
        // Legg til ny brukermelding
        conversationHistory.push({ role: 'user', content: message });
        
        const respons = await ollama.chat({
            model: 'gpt-oss:120b-cloud',
            messages: conversationHistory, 
        });

        const content = respons.message?.content || respons.content || '';
        
        // Legg til AI-svar
        conversationHistory.push({ role: 'assistant', content: content });

        return json({ 
            response: content,
            conversationHistory: conversationHistory // Send tilbake oppdatert historikk
        });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
} 