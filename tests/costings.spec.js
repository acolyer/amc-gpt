import { resetCosts, getConversationCost, addResponseCost, COST_PER_1K_PROMPT_TOKENS,
         COST_PER_1K_RESPONSE_TOKENS, COST_PER_IMAGE_GENERATION } from "../public/modules/costings.js";

beforeEach(() => {
    resetCosts();
});

describe('addResponseCost', () => {
    it('should cost nothing when no tokens or images are used', () => {
        const usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
        expect(addResponseCost(usage)).toBe(0);
    });

    it('should calculate the cost of prompt tokens', () => {
        var usage = { prompt_tokens: 1000, completion_tokens: 0, total_tokens: 1000 };
        expect(addResponseCost(usage)).toEqual(COST_PER_1K_PROMPT_TOKENS);

        usage = { prompt_tokens: 2000, completion_tokens: 0, total_tokens: 2000 };
        expect(addResponseCost(usage)).toEqual(COST_PER_1K_PROMPT_TOKENS * 2);
    });

    it('should calculate the cost of response tokens', () => {
        var usage = { prompt_tokens: 0, completion_tokens: 1000, total_tokens: 1000 };
        expect(addResponseCost(usage)).toEqual(COST_PER_1K_RESPONSE_TOKENS);

        usage = { prompt_tokens: 0, completion_tokens: 5000, total_tokens: 5000 };
        expect(addResponseCost(usage)).toEqual(COST_PER_1K_RESPONSE_TOKENS * 5);
    });

    it('should calculate the cost of image generations', () => {
        const usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
        var numImages = 1;
        expect(addResponseCost(usage, numImages)).toEqual(COST_PER_IMAGE_GENERATION);

        numImages = 3;
        expect(addResponseCost(usage, numImages)).toEqual(3 * COST_PER_IMAGE_GENERATION);
    });

    it('should combine all response component costs', () => {
        const usage = { prompt_tokens: 2000, completion_tokens: 3000, total_tokens: 5000 };
        const numImages = 2;
        const expectedCost = (2 * COST_PER_1K_PROMPT_TOKENS) +
                             (3 * COST_PER_1K_RESPONSE_TOKENS) +
                             (2 * COST_PER_IMAGE_GENERATION);
        expect(addResponseCost(usage, numImages)).toEqual(expectedCost);
    });
});

describe('getConversationCost', () => {
    it('should start at zero', () => {
        expect(getConversationCost()).toBe(0.0);
    });

    it('should increase by the cost of the response with every response', () => {
        addResponseCost({ prompt_tokens: 1000, completion_tokens: 0, total_tokens: 1000 });
        expect(getConversationCost()).toEqual(COST_PER_1K_PROMPT_TOKENS);
        addResponseCost({ prompt_tokens: 1000, completion_tokens: 2000, total_tokens: 3000 });
        const expectedCost = (2 * COST_PER_1K_PROMPT_TOKENS) + (2* COST_PER_1K_RESPONSE_TOKENS);
        expect(getConversationCost()).toEqual(expectedCost);
    });
});

describe('resetCosts', () => {
    it('should reset the conversation cost back to zero', () => {
        addResponseCost({ prompt_tokens: 1000, completion_tokens: 0, total_tokens: 1000 });
        expect(getConversationCost()).not.toBe(0.0);
        resetCosts();
        expect(getConversationCost()).toBe(0.0);
    });
})