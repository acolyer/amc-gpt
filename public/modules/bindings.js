function addMarkdownContentToElement(element, markdown) {
    const markdownDiv = document.createElement('div');
    showdowns.makeHtml(markdown).then(html => {
        markdownDiv.innerHTML = html;
    }).catch(error => {
        console.log(`Showdowns rendering error: {error}`);
        markdownDiv.innerHTML = error;
    });
    element.appendChild(markdownDiv);
}

function addMarkdownContenttoSection(elementId, markdown) {
    const element = document.getElementById(elementId);
    addMarkdownContentToElement(element, markdown);
}

function showThoughts(thoughts) {
    addMarkdownContenttoSection('thoughts', thoughts);
}

function showReflection(reflection) { 
    addMarkdownContenttoSection('reflection', reflection);
}

function showAssumptions(assumptions) {
    addMarkdownContenttoSection('assumptions', assumptions);
}

function showFollowUps(followUps) { 
    addMarkdownContenttoSection('follow-ups', followUps);
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
      metadata += `         ${usage.total_tokens} tokens, ${numImages} images, message cost: \$${cost}`;
    }
    metadataElement.textContent = metadata;
    container.appendChild(metadataElement);
}

function showChatMessage(role, message, usage, numImages, cost) {
    const chatMessageContainer = createChatMessageContainer(role);
    addMarkdownContentToElement(chatMessageContainer, message);
    addMessageMetadata(chatMessageContainer, role, usage, numImages, cost);
    document.getElementById('chatHistory').appendChild(chatMessageContainer);
}

export { showThoughts, showReflection, showAssumptions, showFollowUps, showChatMessage }