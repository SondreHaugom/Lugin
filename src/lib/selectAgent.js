// Denne funksjonen sender en melding til den valgte agenten og returnerer både svaret og response ID
export const selectAgent = async (message, agentType, systemInstruks = "", previousResponseId = null) => {
    // Bestem endpoint basert på agentType
    let endpoint = '/components/server/Openai';

    // Sjekk at agentType er gyldig
    if (!agentType) {
        console.error('Agent type is not specified.');
        return {response: 'Error: Agent type is not specified.', responseId: null};
    }

    console.log(`Sending message to ${agentType} endpoint:`);

    // Sender og motar melding til riktig endpoint basert på agentType
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            message: message, 
            systemInstruks: systemInstruks, // Send instruksjonene med
            previousResponseId: previousResponseId
        })
    });
    // Oppretter en payload variabel for å håndtere både OpenAI og MistralAI svar, og returnerer både svaret og response ID
    const payload = await response.json();

    // Håndterer både OpenAI og MistralAI svar, og returnerer både svaret og response ID
    const raw = payload.response ??
        payload.choices?.[0]?.message?.content ?? '';

    // Returner både svar og response ID
    return {
        response: raw || 'Beklager, ingen respons mottatt.',
        responseId: payload.responseId 
    };
}