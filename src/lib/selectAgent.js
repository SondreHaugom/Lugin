// Denne funksjonen sender en melding til den valgte agenten og returnerer både svaret og response ID
export const selectAgent = async (message, agentType, systemInstruks = "", previousResponseId = null) => {
    // Bestem endpoint basert på agentType
    let endpoint = '/components/server/Ollama';
    if (agentType === 'Openai') endpoint = '/components/server/Openai';


    // Sjekk at agentType er gyldig
    if (!agentType) {
        console.error('Agent type is not specified.');
        return {response: 'Error: Agent type is not specified.', responseId: null};
    }

    console.log(`Sending message to ${agentType} endpoint: ${endpoint}`);

    // Sender og motar melding til riktig endpoint basert på agentType
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            message: message, 
            systemInstruks: systemInstruks, // Send instruksjonene med
            previousResponseId: previousResponseId,
            conversationHistory: previousResponseId  // For Ollama er dette samtalehistorikken
        })
    });

    // Oppretter en payload variabel for å håndtere både OpenAI og MistralAI svar, og returnerer både svaret og response ID
    const payload = await response.json();
    
    console.log(`Full payload from ${agentType}:`, JSON.stringify(payload, null, 2));

    // Håndterer både OpenAI og MistralAI svar, og returnerer både svaret og response ID
    const raw = payload.response ??
        payload.choices?.[0]?.message?.content ?? '';

    // Returner både svar og response ID
    return {
        response: raw || 'Beklager, ingen respons mottatt.',
        responseId: payload.responseId,
        conversationHistory: payload.conversationHistory // For Ollama, returner oppdatert samtalehistorikk

    };
}