import { getChatMessages, logAssistantMessage, logSystemMessage, logUserMessage } from "./chat_log.js";
import { getSystemPrompt, getUserPrompt } from "./prompt_engineering.js"
import { getApiKey, getUserInput, showChatMessage, onSendMessage, showSystemMessage, 
         clearSystemMessages, showThoughts, showAssumptions, showReflection, showFollowUps,
         showSpinner, hideSpinner, clearGPTOutputs} from "./bindings.js";
import { getChatCompletion } from "./openai.js";
import { parseResponse } from "./response_parsing.js";
import { addResponseCost } from "./costings.js";

console.log('amc-gpt starting');
showdowns.init();
logSystemMessage(getSystemPrompt());

const sampleMessage=`\
Emma Woodhouse, handsome, clever, and rich, with a comfortable home and happy disposition, seemed to unite some of the best blessings of existence; and had lived nearly twenty-one years in the world with very little to distress or vex her.
She was the youngest of the two daughters of a most affectionate, indulgent father; and had, in consequence of her sister’s marriage, been mistress of his house from a very early period. Her mother had died too long ago for her to have more than an indistinct remembrance of her caresses; and her place had been supplied by an excellent woman as governess, who had fallen little short of a mother in affection.
`;
showChatMessage('user',sampleMessage);
showChatMessage('assistant','A response from ChatGPT', {total_tokens: 1000}, 0, 0.03);

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
        return;
   } 
   const response = await getChatCompletion(getApiKey(), getChatMessages());
   const responseData = await response.json();
   console.log(responseData);

   const usage = responseData.usage;
   const cost = addResponseCost(usage);
   const responseText = responseData.choices[0].message.content;
   console.log(responseText);
   logAssistantMessage(responseText);

   const parsedReply = parseResponse(responseText);
   hideSpinner();
   showChatMessage('assistant', parsedReply.answer, responseData.usage, 0, cost);
   showThoughts(parsedReply.thoughts);
   showAssumptions(parsedReply.assumptions);
   showReflection(parsedReply.reflection);
   showFollowUps(parsedReply.followUps);
});