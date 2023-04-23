import { clearChatLog, getChatMessages, logSystemMessage, logUserMessage, logAssistantMessage } from '../public/modules/chat_log.js';

beforeEach(() => {
    clearChatLog();
});

describe('chat log', () => {
    it('logs system messages in OpenAI API format', () => {
        logSystemMessage('A system message');
        const log = getChatMessages();
        expect(log).toEqual([{role: 'system', content: 'A system message'}]);
    });

    it('logs user messages in OpenAI API format', () => {
        logUserMessage('A user message');
        const log = getChatMessages();
        expect(log).toEqual([{role: 'user', content: 'A user message'}]);
    });

    it('logs assistant messages in OpenAI API format', () => {
        logAssistantMessage('A ChatGPT message');
        const log = getChatMessages();
        expect(log).toEqual([{role: 'assistant', content: 'A ChatGPT message'}]);
    });   

    it('maintains a history of messages in order', () => {
        logSystemMessage('A system message');
        logUserMessage('A user message');
        logAssistantMessage('An assistant message');
        const log = getChatMessages();
        expect(log).toEqual([
            {role: 'system', content: 'A system message'},
            {role: 'user', content: 'A user message'},
            {role: 'assistant', content: 'An assistant message'}
        ]);
    });
});