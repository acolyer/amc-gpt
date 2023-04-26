import { GPT_35_TURBO } from "./model_names.js";

const DEFAULT_COMPLETION_MODEL = GPT_35_TURBO;
const OPENAI_CHAT_COMPLETION_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_IMAGE_GENERATION_ENDPOINT = 'https://api.openai.com/v1/images/generations';

async function getChatCompletion(apiKey, messages, model=DEFAULT_COMPLETION_MODEL) {
    console.log(messages);
    return await fetch(OPENAI_CHAT_COMPLETION_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            'model': model,
            'messages': messages
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

export { getChatCompletion, getImage }