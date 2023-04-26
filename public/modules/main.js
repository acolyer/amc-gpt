import { getChatMessages, logAssistantMessage, logSystemMessage, logUserMessage } from "./chat_log.js";
import { getSystemPrompt, getUserPrompt } from "./prompt_engineering.js"
import { getApiKey, getUserInput, showChatMessage, onSendMessage, showSystemMessage, clearSystemMessages, showThoughts, showAssumptions, showReflection, showFollowUps } from "./bindings.js";
import { getChatCompletion } from "./openai.js";
import { parseResponse } from "./response_parsing.js";

console.log('amc-gpt starting');
showdowns.init();
logSystemMessage(getSystemPrompt());

onSendMessage(async (event) => {
   event.preventDefault();
   clearSystemMessages();
   // TODO: clear supplementary areas

   const message = getUserInput();
   showChatMessage('user', message);

   const userPrompt = getUserPrompt(message);
   logUserMessage(userPrompt);

   const apiKey = getApiKey();
   if (apiKey == undefined || apiKey.length == 0) {
        showSystemMessage("API key is required");
        return;
   } 
   const response = await getChatCompletion(getApiKey(), getChatMessages());
   const responseData = await response.json();
   console.log(responseData);

   const usage = responseData.usage;
   const responseText = responseData.choices[0].message.content;
   console.log(responseText);
   logAssistantMessage(responseText);

   const parsedReply = parseResponse(responseText);
   showChatMessage('assistant', parsedReply.answer, responseData.usage, 0, 0);
   showThoughts(parsedReply.thoughts);
   showAssumptions(parsedReply.assumptions);
   showReflection(parsedReply.reflection);
   showFollowUps(parsedReply.followUps);
});