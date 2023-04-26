import { llmActivity } from './thinking.js';

function updateLLMActivity() {
    const thinkingSpan = document.getElementById('llm-activity');
    thinkingSpan.innerText = llmActivity();
}

setInterval(updateLLMActivity, 3000);

function addMarkdownContentToElement(element, markdown) {
    const markdownDiv = document.createElement('div');
    showdowns.makeHtml(markdown).then(html => {
        markdownDiv.innerHTML = html;
    }).catch(error => {
        console.log(`Showdowns rendering error: ${error}`);
        markdownDiv.innerHTML = error;
    });
    element.appendChild(markdownDiv);
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
    if (role == 'assistant') {
      metadata += `  ${usage.total_tokens} tokens, ${numImages} images, message cost: \$${cost}`;
    }
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
}

function showSpinner() {
    document.getElementById('thinking').style.display = 'flex';
}

function hideSpinner() { 
    document.getElementById('thinking').style.display = 'none';
}

const apiKeyInput = document.getElementById('openAIAPIKey');
apiKeyInput.classList.add('required-missing');
apiKeyInput.addEventListener('change', () => {
   if (apiKeyInput.value == '') { 
    apiKeyInput.classList.add('required-missing');
   } else {
    apiKeyInput.classList.remove('required-missing');
   }
});


export { showThoughts, showReflection, showAssumptions, showFollowUps, showChatMessage,
         onSendMessage, getUserInput, getApiKey, showSystemMessage, clearSystemMessages,
        showSpinner, hideSpinner, clearGPTOutputs }