const chatLog = [];

function logChatMessage(messageType, text) {
    chatLog.push({
        role: messageType,
        content: text
    });
}

function logSystemMessage(text) { 
    logChatMessage("system", text);
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