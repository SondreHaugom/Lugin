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
        const { message, agentResponseIds, previousResponseId } = await request.json();
        
        // Bruk messages fra agentResponseIds hvis de finnes
        const messages = agentResponseIds?.messages || [{ role: 'user', content: message }];

        const respons = await ollama.chat({
            model: 'gpt-oss:120b-cloud',
            instructions: "Du er en hjelpsom assistent...",
            messages: messages,  // Send hele samtalehistorikken

            previousResponseId: previousResponseId // Send tidligere response ID hvis den finnes
        });

        const content = respons.message?.content || respons.content || '';

        return json({ 
            response: content,
            responseId: crypto.randomUUID()
        });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}