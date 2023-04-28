import { llmActivity } from './thinking.js';

function initBindings() {
    setInterval(updateLLMActivity, 3000);
    setInterval(blinkCursor, 600);
 
    const apiKeyInput = document.getElementById('openAIAPIKey');
    apiKeyInput.classList.add('required-missing');
    apiKeyInput.addEventListener('change', () => {
    if (apiKeyInput.value == '') { 
        apiKeyInput.classList.add('required-missing');
    } else {
        apiKeyInput.classList.remove('required-missing');
    }
    });
}

function updateLLMActivity() {
    const thinkingSpan = document.getElementById('llm-activity');
    thinkingSpan.innerText = llmActivity();
}

function blinkCursor() {
    const cursorElement = document.getElementById('streamingResponseCursor');
    if (cursorElement.innerText == '') {
        cursorElement.innerText = '...';
    } else {
        cursorElement.innerText = '';
    }
}

function addMarkdownContentToElement(element, markdown) {
    if (markdown.length == 0) { return; }
    const markdownDiv = document.createElement('div');
    showdowns.makeHtml(markdown).then(html => {
        markdownDiv.innerHTML = html;
        if (element.id == 'followUpsContainer') {
            registerQuestionHandlers();
        }
    }).catch(error => {
        console.log(`Showdowns rendering error: ${error}`);
        markdownDiv.innerHTML = error;
    });
    element.appendChild(markdownDiv);
    Prism.highlightAll();
}

function addMarkdownContenttoSection(elementId, markdown) {
    const element = document.getElementById(elementId);
    addMarkdownContentToElement(element, markdown);
}

function showThoughts(thoughts) {
    addMarkdownContenttoSection('thoughtsContainer', thoughts);
}

function showReflection(reflection) { 
    addMarkdownContenttoSection('reflectionsContainer', reflection);
}

function showAssumptions(assumptions) {
    addMarkdownContenttoSection('assumptionsContainer', assumptions);
}

function registerQuestionHandlers() {
    const questions = document.querySelectorAll('#followUpsContainer li');
    questions.forEach(question => {
        question.addEventListener('click', event => {
            askQuestion(question.innerText);
        });
    });
}

function askQuestion(question) {
    document.getElementById('userMessage').value = question;
}

function showFollowUps(followUps) { 
    addMarkdownContenttoSection('followUpsContainer', followUps);
}

function createChatMessageContainer(role) {
    const newArticle = document.createElement('article');
    newArticle.classList.add('chatMessage');
    newArticle.classList.add(role);
    const avatar = document.createElement('img');
    avatar.classList.add('avatar');
    if (role == 'user') {
        avatar.src = 'images/avatar-user.png';
    } else {
        avatar.src = 'images/openai-logo.png';
    }
    avatar.alt = "Avatar";
    newArticle.appendChild(avatar);
    return newArticle;
}

function addMessageMetadata(container, role, usage, numImages, cost) {
    const metadataElement = document.createElement("span");
    metadataElement.classList.add("metadata");
    var metadata = new Date().toTimeString().slice(0, 5);
    metadataElement.textContent = metadata;
    container.appendChild(metadataElement);
}

function showChatMessage(role, message, usage, numImages, cost) {
    const chatMessageContainer = createChatMessageContainer(role);
    addMarkdownContentToElement(chatMessageContainer, message);
    addMessageMetadata(chatMessageContainer, role, usage, numImages, cost);
    document.getElementById('chatHistory').appendChild(chatMessageContainer);
    if (role == 'user') {
        document.getElementById('userMessage').value = '';
    }
    chatMessageContainer.scrollIntoView(true);
}

function showSystemMessage(message) {
    document.getElementById('systemMessages').innerHTML = `<p>${message}</p>`
}

function clearGPTOutputs() {
    document.getElementById('thoughtsContainer').innerHTML = '';
    document.getElementById('assumptionsContainer').innerHTML = '';
    document.getElementById('reflectionsContainer').innerHTML = '';
    document.getElementById('followUpsContainer').innerHTML = '';
    document.getElementById('streamingResponseContent').innerText = '';
}

function clearSystemMessages() {
    document.getElementById('systemMessages').innerHTML = '';
}

function getUserInput() {
    return document.getElementById('userMessage').value;
}

function getApiKey() {
    return document.getElementById('openAIAPIKey').value;
}

function onSendMessage(handler) {
    document.getElementById('sendMessageButton').addEventListener('click', handler);
    document.getElementById('userMessage').addEventListener("keydown", event => {
        if ((event.metaKey || event.ctrlKey) && event.keyCode === 13) {
            event.preventDefault();
            handler();
        }
    });
}

function showWaiting() {
    document.getElementById('thinking').style.display = 'flex';
    document.getElementById('streamingResponse').style.display = 'flex';
}

function hideThinking() { 
    document.getElementById('thinking').style.display = 'none';
}

function hideStreamingResponse() { 
    document.getElementById('streamingResponse').style.display = 'none';
}

function addStreamingContent(content) { 
    document.getElementById('streamingResponseContent').innerText = content;
}

function showResponseMetadata(usage, numImages, cost) {
    const metadata = `  ${usage.total_tokens} tokens, ${numImages} images, message cost: \$${cost}`;
    const targetElement = document.querySelector('.metadata:last-of-type');
    targetElement.textContent = targetElement.textContent + metadata;
}




export { initBindings, showThoughts, showReflection, showAssumptions, showFollowUps, showChatMessage,
         onSendMessage, getUserInput, getApiKey, showSystemMessage, clearSystemMessages,
         showWaiting, hideThinking, hideStreamingResponse, clearGPTOutputs, addStreamingContent,
        showResponseMetadata }