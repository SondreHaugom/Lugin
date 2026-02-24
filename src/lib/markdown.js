// Denne filen håndterer markdown rendering, inkludert kodeblokker og KaTeX for matematiske uttrykk

// Importerer nødvendige biblioteker for markdown rendering og syntaksutheving
import hljs from "highlight.js"
import markdownit from "markdown-it"
import "highlight.js/styles/a11y-light.min.css"
import "katex/dist/katex.min.css"
import markdownKatex from "@vscode/markdown-it-katex"

// funksjoen for å pakke inn kode i pre og code tagger for riktig formatering i markdown
export const wrapInPreCode = (code) => {
    return `${code}`
};

// Funksjoen for generell markdown rendering, som også håndterer syntaksutheving for kodeblokker og KaTeX for matematiske uttrykk
export const md = markdownit({
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return wrapInPreCode(hljs.highlight(str, { language: lang, ignoreIllegals: true }).value)
            } catch (err) {
                console.error("Error highlighting code:", err) 

            }
        }
        return wrapInPreCode(md.utils.escapeHtml(str))
    }
});

md.use(markdownKatex.default || markdownKatex )

// Denne funksjonen legger til KaTeX-støtte for matematiske uttrykk i markdown-tekst, og sørger for at det ikke påvirker kodeblokker
export const addKaTexToMathStrings = (text) => {
    const lines = text.split("\n")
    let isInCodeBlock = false
    const linesWithKaTex = []
    for (let line of lines) {
        if (line.includes("```")) {
            isInCodeBlock = !isInCodeBlock
        }
        if (!isInCodeBlock && (line.includes("\\[") || line.includes("\\(") || line.includes("\\]") || line.includes("\\)"))) {
            line = line.replaceAll("\\[", "$$").replaceAll("\\]", "$$")
			line = line.replaceAll("\\(", "$").replaceAll("\\)", "$")
			linesWithKaTex.push(line) // Add the modified line
			continue
        }
        linesWithKaTex.push(line) // Add the original line
    }
    return linesWithKaTex.join("\n")
}

export const renderMarkdown = (markdownText) => {
    const textWithKaTex = addKaTexToMathStrings(markdownText)
    return md.render(textWithKaTex)
};
