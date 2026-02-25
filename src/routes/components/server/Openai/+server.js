import {env} from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import OpenAI from "openai";

// Bruk systemInstruks fra systeminstruks.js, eller fallback til standardverdi


const openai_api_key = env.OPENAI_API_KEY;

const VC_STORE_ID = env.VC_STORE_ID; // ID for Vector Store, hentet fra miljøvariabler

const client = new OpenAI({
    apiKey: openai_api_key
});




/** @type {import('./$types').requestHandler} */

export async function POST(request) {
    try {
        const { message, previousResponseId, systemInstruks } = await request.request.json();

        const response = await client.responses.create({
            model: "gpt-5-nano-2025-08-07",
            instructions: systemInstruks || "Du er en hjelpsom assistent med dine svar skal du altid bruke markdown format.", 
            input: [
                {
                    role: "user",
                    content: message,
                },
            ],
            previous_response_id: previousResponseId
        });

        return json({ 
            response: response.output_text,
            responseId: response.id 
    });
    } catch (error) {
        console.error("Error in OpenAI API call:", error);
        return json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
    
}

console.log("System")