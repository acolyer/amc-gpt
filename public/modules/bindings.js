import { llmActivity } from './thinking.js';


var thoughtContent = '';
var answerContent = '';
var assumptionsContent = '';
var reflectionContent = '';
var followUpsContent = '';
var currentReplyContainer = null;
var singleColumnLayout = false;

const sectionConfig = {
    defaultSection: 'answer',
    sections: [
        {
            name: 'thoughts',
            header: '# Thoughts',
            processor: { newContent: addThoughts, finish: finishThoughts }
        },
        {
            name: 'answer',
            header: '# Answer',
            processor: { newContent: addAnswer, finish: finishAnswer }
        },
        {
            name: 'assumptions',
            header: '# Assumptions',
            processor: { newContent: addAssumptions, finish: finishAssumptions }
        },
        {
            name: 'reflection',
            header: '# Reflection',
            processor: { newContent: addReflections, finish: finishReflections }
        },
        {
            name: 'followUps',
            header: '# Follow-up questions',
            processor: { newContent: addFollowUps, finish: finishFollowUps }
        }
    ]
}

function initBindings() {
    setInterval(updateLLMActivity, 3000);
 
    const apiKeyInput = document.getElementById('openAIAPIKey');
    apiKeyInput.classList.add('required-missing');
    apiKeyInput.addEventListener('change', () => {
        if (apiKeyInput.value == '') { 
            apiKeyInput.classList.add('required-missing');
        } else {
            apiKeyInput.classList.remove('required-missing');
        }
    });

    const typewriter = document.getElementById('typewriter');
    typewriter.addEventListener('click', () => {
        if (!typewriter.checked) {
            const audio = document.querySelector("audio");
            audio.pause();
        }
    });

    const userMessage = document.getElementById('userMessage');
    userMessage.addEventListener('input', () => { 
        userMessage.style.height = 0;
        userMessage.style.height = (userMessage.scrollHeight) + 'px';
    });

    singleColumnLayout = window.matchMedia('screen and (max-width: 1200px)').matches;
}

function resetUserMessageSize() {
    const userMessage = document.getElementById('userMessage');
    userMessage.style.height = 0;
    userMessage.style.height = (userMessage.scrollHeight) + 'px';    
}

function addThoughts(thoughts) {
    if (thoughtContent == '') { 
        document.getElementById('thoughtsContainer').scrollIntoView(true);
    }
    thoughtContent += thoughts;
    setInnerText('thoughtsContainer', thoughtContent);
}

function finishThoughts() {
    setInnerText('thoughtsContainer', '');
    addMarkdownContenttoSection('thoughtsContainer', thoughtContent);
}

function addAnswer(answer) {
    if (singleColumnLayout)  {
        // only scroll the first time on single column layouts
        if (answerContent == '') {
          currentReplyContainer.scrollIntoView(true);
        }
    } else {
        document.getElementById('userMessage').scrollIntoView(true);      
    }
    answerContent += answer;
    currentReplyContainer.innerText = answerContent;
}

function finishAnswer() {
    currentReplyContainer.innerText = '';
    const targetContainer = currentReplyContainer.parentElement;
    addMarkdownContentToElement(
        targetContainer,
        answerContent,
        element => {
            addMessageMetadata(element);
            addAnkiEventListeners()
        });
}

function addAssumptions(assumptions) {
    if (assumptionsContent == '') { 
        document.getElementById('assumptionsContainer').scrollIntoView(true);
    }
    assumptionsContent += assumptions;
    setInnerText('assumptionsContainer', assumptionsContent);
}

function finishAssumptions() { 
    setInnerText('assumptionsContainer', '');
    addMarkdownContenttoSection('assumptionsContainer', assumptionsContent);
}

function addReflections(reflections) {
    if (reflectionContent == '') { 
        document.getElementById('reflectionsContainer').scrollIntoView(true);
    }
    reflectionContent += reflections;
    setInnerText('reflectionsContainer', reflectionContent);
}

function finishReflections() { 
    setInnerText('reflectionsContainer', '');
    addMarkdownContenttoSection('reflectionsContainer', reflectionContent);
}

function addFollowUps(followUps) {
    if (followUpsContent == '') { 
        document.getElementById('followUpsContainer').scrollIntoView(true);
    }
    followUpsContent += followUps;
    setInnerText('followUpsContainer', followUpsContent);
}

function finishFollowUps() {
    setInnerText('followUpsContainer', '');
    addMarkdownContenttoSection(
        'followUpsContainer',
         followUpsContent,
         _element => registerQuestionHandlers()
    );
}

function askQuestion(question) {
    const userMessage = document.getElementById('userMessage');
    userMessage.value = question;
    userMessage.scrollIntoView(true);
    resetUserMessageSize();
}


function showUserChatMessage(message) {
    const chatMessageContainer = createChatMessageContainer('user');
    addMarkdownContentToElement(chatMessageContainer, message);
    addMessageMetadata(chatMessageContainer);
    document.getElementById('chatHistory').appendChild(chatMessageContainer);
    document.getElementById('userMessage').value = '';
    resetUserMessageSize();
    chatMessageContainer.scrollIntoView(true);
}

function createAssistantChatMessage() {
    const chatMessageContainer = createChatMessageContainer('assistant');
    document.getElementById('chatHistory').appendChild(chatMessageContainer);
    currentReplyContainer = document.createElement('div');
    chatMessageContainer.appendChild(currentReplyContainer);
    chatMessageContainer.scrollIntoView(true);
}

function showSystemMessage(message) {
    document.getElementById('systemMessages').innerHTML = `<p>${message}</p>`
}

function clearGPTOutputs() {
    thoughtContent = '';
    answerContent = '';
    assumptionsContent = '';
    reflectionContent = '';
    followUpsContent = '';
    document.getElementById('thoughtsContainer').innerHTML = thoughtContent;
    document.getElementById('assumptionsContainer').innerHTML = assumptionsContent;
    document.getElementById('reflectionsContainer').innerHTML = reflectionContent;
    document.getElementById('followUpsContainer').innerHTML = followUpsContent;
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
        if ((event.metaKey || event.ctrlKey) && event.key == 'Enter') {
            if (document.getElementById('sendMessageButton').disabled == false) {
                handler(event);
            }
        }
    });
}

function disableSending() {
    document.getElementById('sendMessageButton').disabled = true;
}

function enableSending() {
    document.getElementById('sendMessageButton').disabled = false;
}

function showThinking() {
    document.getElementById('thinking').style.display = 'flex';
}

function hideThinking() { 
    document.getElementById('thinking').style.display = 'none';
}

function startTyping() {
    const audio = document.querySelector("audio");
    if (document.getElementById('typewriter').checked) {
        audio.play();
    }
}

function stopTyping() {
    const audio = document.querySelector("audio");
    audio.pause();
}

function rememberContent() {
    const contentComponents = getAssistantMessageComponents();
    currentReplyContainer.parentElement.addEventListener('click', () => {
        setInnerText('thoughtsContainer', '');
        setInnerText('assumptionsContainer', '');
        setInnerText('reflectionsContainer', '');
        setInnerText('followUpsContainer', '');
        addMarkdownContenttoSection('thoughtsContainer', contentComponents.thoughts)
        addMarkdownContenttoSection('assumptionsContainer', contentComponents.assumptions);
        addMarkdownContenttoSection('reflectionsContainer', contentComponents.reflections);
        addMarkdownContenttoSection('followUpsContainer', contentComponents.followUps,
                                     _element => registerQuestionHandlers());
    });
}

function getAssistantMessageComponents() {
    return {
        thoughts: thoughtContent.slice(),
        answer: answerContent.slice(),
        assumptions: assumptionsContent.slice(),
        reflections: reflectionContent.slice(),
        followUps: followUpsContent.slice()
    }
}

function registerQuestionHandlers() {
    const questions = document.querySelectorAll('#followUpsContainer li');
    questions.forEach(question => {
        question.addEventListener('click', event => {
            askQuestion(question.innerText);
        });
    });
}

function updateLLMActivity() {
    const thinkingSpan = document.getElementById('llm-activity');
    thinkingSpan.innerText = llmActivity();
}

function addMarkdownContentToElement(element, markdown, postProcessor=null) {
    if (markdown.length == 0) { return; }
    const markdownDiv = document.createElement('div');
    element.appendChild(markdownDiv);
    showdowns.makeHtml(markdown).then(html => {
        markdownDiv.innerHTML = html;
        Prism.highlightAll();
        if (postProcessor) { 
            postProcessor(element);
        }
    }).catch(error => {
        console.log(`Showdowns rendering error: ${error}`);
        markdownDiv.innerHTML = error;
    });
}

function addMarkdownContenttoSection(elementId, markdown, postProcessor=null) {
    const element = document.getElementById(elementId);
    addMarkdownContentToElement(element, markdown, postProcessor);
}

function setInnerText(containerId, content) {
    const container = document.getElementById(containerId);
    container.innerText = content;
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

function addMessageMetadata(container) {
    const metadataElement = document.createElement("span");
    metadataElement.classList.add("metadata");
    var metadata = new Date().toTimeString().slice(0, 5);
    metadataElement.textContent = metadata;
    container.appendChild(metadataElement);
}

function addAnkiEventListeners() {
    //console.log('Adding Anki listeners')
    const ankiCards = document.querySelectorAll('.anki');
    ankiCards.forEach(card => {
       // console.log(`adding listener to card ${card}`)
        const front = card.querySelector('.front');
        const back = card.querySelector('.back');
        const flipButton = card.querySelector('button');
        flipButton.addEventListener('click', _ => {
            if (front.style.display != 'none') {
                front.style.display = 'none';
                back.style.display = 'block';
            } else {
                front.style.display = 'block';
                back.style.display = 'none';
            }
        });
    });
}

function getModelName() {
    const customModel = document.getElementById('fineTunedModelId').value;
    if (customModel && customModel != '') {
        return customModel;
    }
    return document.getElementById('modelNameSelect').value;
}


export { initBindings, askQuestion, showUserChatMessage, createAssistantChatMessage,
         clearGPTOutputs, showSystemMessage, clearSystemMessages,
         getUserInput, getApiKey, onSendMessage,
         showThinking, hideThinking, disableSending, enableSending, 
         startTyping, stopTyping, rememberContent, getModelName, sectionConfig  }