import { GPT_35_TURBO, GPT_4 } from "./model_names.js";

const chatLog = [];

function logChatMessage(messageType, text) {
    chatLog.push({
        role: messageType,
        content: text
    });
}

/**
 * For gpt-3.5-turbo model family it is currently recommended to use the 'user'
 * role rather than the 'system' role for the initial instructions.
 * See https://platform.openai.com/docs/guides/chat/introduction
 */
function logSystemMessage(text, model=GPT_35_TURBO) { 
    const role = (model == GPT_4) ? 'system' : 'user';
    logChatMessage(role, text);
}

function logAssistantMessage(text) { 
    logChatMessage("assistant", text);
}

function logUserMessage(text) {
    logChatMessage("user", text);
}

function getChatMessages() {
    return chatLog;
}

function clearChatLog() {
    chatLog.length = 0;
}

export { logSystemMessage, logAssistantMessage, logUserMessage, getChatMessages, clearChatLog };