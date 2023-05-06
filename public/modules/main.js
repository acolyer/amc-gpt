import { getChatMessages, logAssistantMessage, logSystemMessage, logUserMessage } from "./chat_log.js";
import { getSystemPrompt, getUserPrompt } from "./prompt_engineering.js"
import { initBindings, getApiKey, getUserInput, showUserChatMessage, onSendMessage, showSystemMessage, 
         clearSystemMessages, sectionConfig,
         clearGPTOutputs, showThinking, hideThinking,
         disableSending, enableSending, createAssistantChatMessage,
         startTyping, stopTyping, rememberContent, getModelName } from "./bindings.js";
import { getChatCompletion, getStreamedContent } from "./openai.js";
import { initImagesExtension } from './showdown_images.js';
import { initAnkiExtension } from "./showdown_anki.js";
import { SectionParser } from "./parser.js";

console.log('amc-gpt starting');
logSystemMessage(getSystemPrompt()); 

initialiseShowdowns();
initBindings();

// register a handler for when the user sends a message, then sit back and wait!
onSendMessage(async (event) => {
   event.preventDefault();  
   if (!checkForApiKey()) { return }

   const message = getUserInput();
   prepareUIForNewMessageExchange(message);

   // the user prompt may contain additional system instructions alongside the
   // message the user entered
   const userPrompt = getUserPrompt(message);
   logUserMessage(userPrompt);

   sendMessageAndStreamResponse();
});

/**
 * The first chunk of the streaming response has arrived, we can expect
 * content to be flowing in from this point onwards.
 */
function contentStart() {
   hideThinking();
   startTyping();
}

/**
 * The last chunk of the streaming response has arrived, and hence there
 * will be no more new content for this reply. 
 */
function contentEnd(rawContent) {
   stopTyping();
   logAssistantMessage(rawContent);
   rememberContent();
   enableSending();
}

function initialiseShowdowns() { 
   showdowns.init();
   initImagesExtension();
   initAnkiExtension();
}

function checkForApiKey() {
   const apiKey = getApiKey();
   if (apiKey == undefined || apiKey.length == 0) {
        showSystemMessage("API key is required");
        return false;
   } 
   return true;
}

function prepareUIForNewMessageExchange(userMessage) {
   // remove any content relating to the previous exchange
   clearSystemMessages();
   clearGPTOutputs();

   showUserChatMessage(userMessage);
   showThinking();

   // block concurrent requests, and create a placeholder for the reply
   disableSending();
   createAssistantChatMessage();
}

async function sendMessageAndStreamResponse() {
   const response = getChatCompletion(getApiKey(), getChatMessages(), getModelName());
   const data = await response;
   if (data.status == 200) {
      const sectionParser = new SectionParser(sectionConfig, contentStart, contentEnd);
      getStreamedContent(data, content => sectionParser.processChunk(content));
   } else {
      showSystemMessage(`Error returned from OpenAI API, status code: ${data.status}`);
      stopTyping();
      enableSending();
   }
}