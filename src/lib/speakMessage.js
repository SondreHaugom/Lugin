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
    /*
    document.addEventListener('keydown', (event) => {
        if (event.key === 'm' || event.key === 'M') {
            window.speechSynthesis.cancel();
            console.log("Tale avbrutt");
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'p' || event.key === 'P') {
            window.speechSynthesis.pause();
            console.log("Tale satt på pause");
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'R') {
            window.speechSynthesis.resume();
            console.log("Tale gjenopptatt");
        }
    });
    */

    window.speechSynthesis.speak(utterance);
    console.log("Tale startet");

    if (!window.speechSynthesis) {
        console.error("Speech Synthesis API is not supported in this browser.");
        throw error(500, "Speech Synthesis API is not supported in this browser.");
    }
};