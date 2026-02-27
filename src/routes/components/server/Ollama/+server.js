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
        const { message, previousResponseId } = await request.json();

        const respons = await ollama.chat({
            model: 'ministral-3:3b-cloud',
            instructions: "Du er en hjelpsom assistent. Vis du får spørsmålet Hvilke modell er du, så skal du svare gpt-oss.120b",
            messages: [
                { role: 'user', content: message }
            ],
            previousResponseId: previousResponseId
        });

        console.log('Ollama full response:', JSON.stringify(respons, null, 2));
        
        
        // Ollama response structure is usually respons.message.content
        const content = respons.message?.content || respons.content || '';
        console.log('Extracted content:', content);

        return json({ response: content});
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
}