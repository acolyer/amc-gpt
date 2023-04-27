import { getChatMessages, logAssistantMessage, logSystemMessage, logUserMessage } from "./chat_log.js";
import { getSystemPrompt, getUserPrompt } from "./prompt_engineering.js"
import { getApiKey, getUserInput, showChatMessage, onSendMessage, showSystemMessage, 
         clearSystemMessages, showThoughts, showAssumptions, showReflection, showFollowUps,
         clearGPTOutputs, showWaiting, hideThinking, hideStreamingResponse } from "./bindings.js";
import { getChatCompletion, getStreamedContent } from "./openai.js";
import { numImages, parseResponse } from "./response_parsing.js";
import { addResponseCost } from "./costings.js";
import { initImagesExtension } from './showdown_images.js';
import { resetContent, newContent } from "./streamed_response_parsing.js";

console.log('amc-gpt starting');
showdowns.init();
initImagesExtension();
logSystemMessage(getSystemPrompt()); 

onSendMessage(async (event) => {
   event.preventDefault();
   clearSystemMessages();
   clearGPTOutputs();

   const message = getUserInput();
   showChatMessage('user', message);
   resetContent();
   showWaiting();

   const userPrompt = getUserPrompt(message);
   logUserMessage(userPrompt);

   const apiKey = getApiKey();
   if (apiKey == undefined || apiKey.length == 0) {
        showSystemMessage("API key is required");
        hideThinking();
        hideStreamingResponse();
        return;
   } 
   const response = getChatCompletion(getApiKey(), getChatMessages());
   getStreamedContent(response, content => { newContent(content); });
});