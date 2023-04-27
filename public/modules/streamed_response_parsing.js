import { addStreamingContent, hideThinking, hideStreamingResponse,
         showChatMessage, showThoughts, showAssumptions, showReflection, showFollowUps,
         showResponseMetadata } from "./bindings.js";
import { logAssistantMessage } from "./chat_log.js";
import { addResponseCost } from "./costings.js";


const sectionHeaders = [
    { header: '# Thoughts', fn: thoughts },
    { header: '# Answer', fn: answer },
    { header: '# Assumptions', fn: assumptions },
    { header: '# Reflection', fn: reflections },
    { header: '# Follow-up questions', fn: followups }
];
var nextHeaderIndex = 0;
var streamedContent = '';
var answer = '';

function resetContent() {
    streamedContent = '';
    nextHeaderIndex = 0;
    answer = '';
}

function isSectionHeader(line) {
    return line.startsWith('# Thoughts') ||
           line.startsWith('# Answer') ||
           line.startsWith('# Assumptions') ||
           line.startsWith('# Reflection') || 
           line.startsWith('# Follow-up questions')
}

function extractSection(section) {
    var sectionBody = '';
    const lines = streamedContent.split('\n');

    const sectionStart = lines.findIndex((l) => {
        return l.startsWith(section);
    });

    if (sectionStart == -1) {
        return '';
    } else {
       sectionBody = lines.slice(sectionStart + 1);
       const sectionEnd = sectionBody.findIndex(isSectionHeader);
       if (sectionEnd != -1) { 
        sectionBody = sectionBody.slice(0, sectionEnd);
       }
    }
    return sectionBody.join('\n');
}

function thoughts() {
    const thoughts = extractSection('# Thoughts');
    showThoughts(thoughts);
}

function answer() {
    answer = extractSection('# Answer');
    showChatMessage('assistant', answer );
}

function assumptions() {
    const assumptions = extractSection('# Assumptions');
    showAssumptions(assumptions);
}

function reflections() {
    const reflections = extractSection('# Reflection');
    showReflection(reflections);
}

function followups() {
    const followups = extractSection('# Follow-up questions');
    showFollowUps(followups);
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
    followups();
    logAssistantMessage(streamedContent);
    hideStreamingResponse();
    console.log(streamedContent);

    if (answer == '') {
        showChatMessage('assistant', streamedContent);
    }
}

function checkForNextSectionHeader() { 
    if (nextHeaderIndex >= sectionHeaders.length) { return; }

    if (streamedContent.indexOf(sectionHeaders[nextHeaderIndex].header) != -1) {
        if (nextHeaderIndex > 0) {
            sectionHeaders[nextHeaderIndex - 1].fn(); // previous section completed
        }
        nextHeaderIndex++;
    }
}

function newContent(content) {
    hideThinking();
    if (content == '[DONE]') {
        contentComplete();
    } else {
        streamedContent += content;
        addStreamingContent(last80Chars(content).replace(/\n/g,' '));
        checkForNextSectionHeader()
    }
}

export { resetContent, newContent }