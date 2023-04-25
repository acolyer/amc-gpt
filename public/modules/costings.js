const COST_PER_1K_PROMPT_TOKENS = 0.03;
const COST_PER_1K_RESPONSE_TOKENS = 0.06;
const COST_PER_IMAGE_GENERATION = 0.018;

var totalConversationCost = 0.0;

function resetCosts() {
    totalConversationCost = 0.0;
}

function getConversationCost() {
    return totalConversationCost;
}

function addResponseCost(usage, numImages=0) {
    const promptCost = usage.prompt_tokens * COST_PER_1K_PROMPT_TOKENS / 1000.0;
    const responseCost = usage.completion_tokens * COST_PER_1K_RESPONSE_TOKENS / 1000.0;
    const imageCost = numImages * COST_PER_IMAGE_GENERATION;
    const totalCost = promptCost + responseCost + imageCost;
    totalConversationCost += totalCost;
    return totalCost;
}

export { resetCosts, addResponseCost, getConversationCost,
         COST_PER_1K_PROMPT_TOKENS,
         COST_PER_1K_RESPONSE_TOKENS,
         COST_PER_IMAGE_GENERATION }