import { parseResponse } from "../public/modules/response_parsing.js";

const modelResponse = `\
# Thoughts
Here are some thoughts on what I might do.

# Answer
And here is an answer.

# Assumptions

* Assumption one
* Assumption two

# Reflection
What a jolly fine answer that was

# Follow-up questions
* You should ask this
* And that
`;

describe('parseResponse', () => {
    it('returns empty sections given an empty message', () => {
        expect(parseResponse('')).toEqual({
            thoughts: '',
            answer: '',
            assumptions: '',
            reflection: '',
            followUps: ''   
        });
    });

    it('extracts sections given a model response', () => {
        expect(parseResponse(modelResponse)).toEqual({
           thoughts: 'Here are some thoughts on what I might do.\n',
           answer: 'And here is an answer.\n',
           assumptions: '\n* Assumption one\n* Assumption two\n',
           reflection: 'What a jolly fine answer that was\n',
           followUps: '* You should ask this\n* And that\n'
        });
    });
});