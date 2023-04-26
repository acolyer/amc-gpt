import { getChatMessages, logAssistantMessage, logSystemMessage, logUserMessage } from "./chat_log.js";
import { getSystemPrompt, getUserPrompt } from "./prompt_engineering.js"
import { getApiKey, getUserInput, showChatMessage, onSendMessage, showSystemMessage, 
         clearSystemMessages, showThoughts, showAssumptions, showReflection, showFollowUps,
         showSpinner, hideSpinner, clearGPTOutputs} from "./bindings.js";
import { getChatCompletion } from "./openai.js";
import { numImages, parseResponse } from "./response_parsing.js";
import { addResponseCost } from "./costings.js";
import { initImagesExtension } from './showdown_images.js';

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
   showSpinner();

   const userPrompt = getUserPrompt(message);
   logUserMessage(userPrompt);

   const apiKey = getApiKey();
   if (apiKey == undefined || apiKey.length == 0) {
        showSystemMessage("API key is required");
        hideSpinner();
        return;
   } 
   const response = await getChatCompletion(getApiKey(), getChatMessages());
   const responseData = await response.json();
   console.log(responseData);

   const usage = responseData.usage;
   const responseText = responseData.choices[0].message.content;
   console.log(responseText);
   const images = numImages(responseText);
   const cost = addResponseCost(usage, images);
   logAssistantMessage(responseText);

   const parsedReply = parseResponse(responseText);
   hideSpinner();
   showChatMessage('assistant', parsedReply.answer, responseData.usage, 0, cost);
   showThoughts(parsedReply.thoughts);
   showAssumptions(parsedReply.assumptions);
   showReflection(parsedReply.reflection);
   showFollowUps(parsedReply.followUps);
});