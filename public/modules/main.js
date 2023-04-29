import { getChatMessages, logAssistantMessage, logSystemMessage, logUserMessage } from "./chat_log.js";
import { getSystemPrompt, getUserPrompt } from "./prompt_engineering.js"
import { initBindings, getApiKey, getUserInput, showUserChatMessage, onSendMessage, showSystemMessage, 
         clearSystemMessages, sectionConfig,
         clearGPTOutputs, showThinking, hideThinking,
         disableSending, enableSending, createAssistantChatMessage,
         startTyping, stopTyping, rememberContent } from "./bindings.js";
import { getChatCompletion, getStreamedContent } from "./openai.js";
import { initImagesExtension } from './showdown_images.js';
import { SectionParser } from "./parser.js";

console.log('amc-gpt starting');
showdowns.init();
initImagesExtension();
initBindings();
logSystemMessage(getSystemPrompt()); 
var sectionParser = null;


onSendMessage(async (event) => {
   event.preventDefault();
   clearSystemMessages();
   clearGPTOutputs();

   const message = getUserInput();
   showUserChatMessage( message);
   showThinking();

   const userPrompt = getUserPrompt(message);
   logUserMessage(userPrompt);

   const apiKey = getApiKey();
   if (apiKey == undefined || apiKey.length == 0) {
        showSystemMessage("API key is required");
        hideThinking();
        return;
   } 

   disableSending();
   createAssistantChatMessage();
   const response = getChatCompletion(getApiKey(), getChatMessages());
   const data = await response;
   if (data.status == 200) {
      sectionParser = new SectionParser(sectionConfig, contentStart, contentEnd);
      getStreamedContent(data, content => sectionParser.processChunk(content));
   } else {
      showSystemMessage(`Error returned from OpenAI API, status code: ${data.status}`);
      stopTyping();
      enableSending();
   }
});

function contentStart() {
   hideThinking();
   startTyping();
}

function contentEnd() {
   stopTyping();
   logAssistantMessage(sectionParser.getRawContent());
   rememberContent();
   enableSending();
}