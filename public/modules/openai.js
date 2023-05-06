import { GPT_35_TURBO } from "./model_names.js";

const DEFAULT_COMPLETION_MODEL = GPT_35_TURBO;
const OPENAI_CHAT_COMPLETION_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_IMAGE_GENERATION_ENDPOINT = 'https://api.openai.com/v1/images/generations';

async function getChatCompletion(apiKey, messages, model=DEFAULT_COMPLETION_MODEL) {
    return await fetch(OPENAI_CHAT_COMPLETION_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            stream: true
        }),
        redirect: 'follow'
    });
}

async function getImage(apiKey, imageSpec) {
    return await fetch(OPENAI_IMAGE_GENERATION_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            'prompt': imageSpec,
            'size': '512x512'
        }),
        redirect: 'follow'
    });
}

async function getStreamedContent(data, contentHandler) {
    const reader = data.body.getReader();
    const decoder = new TextDecoder('utf-8');
    while (true) {
        const { done, value } = await reader.read();
        if (done) { break; }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        lines.forEach(line => {
            const lineData = line.slice(6);  // 'data: '  
            if (lineData.length > 0 && !lineData.startsWith('[DONE]')) {
                const json = JSON.parse(lineData);
                const firstChoice = json.choices[0];
                if (firstChoice.delta.content) {
                    contentHandler(firstChoice.delta.content);
                }
            }
        });
    }
    contentHandler('[DONE]');
    return '';
}

export { getChatCompletion, getImage, getStreamedContent }