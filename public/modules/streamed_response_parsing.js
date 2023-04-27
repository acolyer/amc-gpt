import { addStreamingContent, hideThinking, hideStreamingResponse,
         showChatMessage, showThoughts, showAssumptions, showReflection, showFollowUps } from "./bindings.js";
import { logAssistantMessage } from "./chat_log.js";
import { addResponseCost } from "./costings.js";
import { parseResponse } from "./response_parsing.js";

var streamedContent = '';
var currentSection = 'answer';

function resetContent() {
    streamedContent = '';
    currentSection = 'answer';
}

function last80Chars() {
    const contentLength = streamedContent.length;
    const index = contentLength >= 80 ? contentLength - 80 : 0;
    return streamedContent.slice(index);
}

function numImages() {
    const lines = streamedContent.split('\n');
    const images = lines.filter((l) => {return l.startsWith('```image')});
    return images.length
}

function calculateUsage() {
    // TODO
    return { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0};
}

function contentComplete() {
    logAssistantMessage(streamedContent);
    const images = numImages();
    const usage = calculateUsage()
    const cost = addResponseCost(usage, images);
    hideStreamingResponse();
    console.log(streamedContent);

    const parsedReply = parseResponse(streamedContent);
    showChatMessage('assistant', parsedReply.answer, usage, images, cost);
    showThoughts(parsedReply.thoughts);
    showAssumptions(parsedReply.assumptions);
    showReflection(parsedReply.reflection);
    showFollowUps(parsedReply.followUps);
}

function newContent(content) {
    hideThinking();
    if (content == '[DONE]') {
        contentComplete();
    } else {
        streamedContent += content;
        addStreamingContent(last80Chars(content).replace(/\n/g,' ')); 
    }
}

export { resetContent, newContent }