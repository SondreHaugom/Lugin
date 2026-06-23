import { error } from "@sveltejs/kit";

const speakWithoutMarkdown = (markdown) => {
    // Fjerner markdown-syntaks for å få ren tekst
    return markdown
        .replace(/!\[.*?\]\(.*?\)/g, '') // Fjerner bilder
        .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1') // Fjerner lenker, beholder teksten
        .replace(/[#>*_`~\-]+/g, '') // Fjerner markdown-tegn
        .replace(/\n+/g, ' ') // Erstatter nye linjer med mellomrom
        .trim();
}

// funksjon som bruker web speech API for å lese opp respons fra chatten. Bruker Microsoft Sonia Online hvis tilgjengelig, ellers standard engelsk stemme.
export const speakMessage = (message) => {
    let plainTextMessage = speakWithoutMarkdown(message); // Fjerner markdown for tale
    const utterance = new SpeechSynthesisUtterance(plainTextMessage);
    utterance.lang = 'en-GB'; // Setter språk til engelsk (Storbritannia)

    const voices = window.speechSynthesis.getVoices();
    const voice = 
    voices.find(v => v.name.includes("Microsoft Sonia Online")) 
    || voices.find(v => v.name.includes("sonia"))
    if (voice) {
        utterance.voice = voice;
    }

    document.addEventListener('keydown', (event) => {
        if (event.key.trim().toLowerCase() === 'm') {
            window.speechSynthesis.cancel();
            console.log("Speech cancelled");

        } else if (event.key.trim().toLowerCase() === 'p') {
            window.speechSynthesis.pause();
            console.log("Speech paused");

        } else if (event.key.trim().toLowerCase() === 'r') {
            window.speechSynthesis.resume();
            console.log("Speech resumed");
        } else {
            console.log("Du skrive melding");
        }
    })



    window.speechSynthesis.speak(utterance);
    console.log("Tale startet");

    if (!window.speechSynthesis) {
        console.error("Speech Synthesis API is not supported in this browser.");
        throw error(500, "Speech Synthesis API is not supported in this browser.");
    }
};