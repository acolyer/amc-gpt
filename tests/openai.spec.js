import { getChatCompletion, getImage } from "../public/modules/openai.js";
import fetchMocks from 'jest-fetch-mock';

fetchMocks.enableFetchMocks();

beforeEach(() => {
    fetchMocks.resetMocks();
})

describe('getChatCompletion', () => {
    it('should POST to the OpenAI chat/completions endpoint', () => {
        fetchMocks.mockResponseOnce({status: 200});
        const result = getChatCompletion('api-key',[{role: 'user', content: 'A message'}]);
        const apiCall = fetch.mock.calls[0];
        const fetchedURL = apiCall[0];
        expect(fetchedURL).toEqual('https://api.openai.com/v1/chat/completions');
        const callParameters = apiCall[1];
        expect(callParameters.method).toEqual('POST');
    });

    it('should create a bearer token using the api key', () => {
        fetchMocks.mockResponseOnce({status: 200});
        const result = getChatCompletion('api-key',[{role: 'user', content: 'A message'}]);
        const apiCall = fetch.mock.calls[0];
        const callParameters = apiCall[1];
        expect(callParameters.headers['Authorization']).toEqual('Bearer api-key');
    });

    it('should include the model and messages parameters in the body', () => {
        fetchMocks.mockResponseOnce({status: 200});
        const result = getChatCompletion('api-key',[{role: 'user', content: 'A message'}]);
        const apiCall = fetch.mock.calls[0];
        const callParameters = apiCall[1];
        const expectedBody = JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'A message' }],
            stream: true
        });
        expect(callParameters.body).toEqual(expectedBody);
    });
});

describe('getImage', () => {
    it('should POST to the OpenAI image generation endpoint', () => {
        fetchMocks.mockResponseOnce({status: 200});
        const result = getImage('api-key', 'a picture of a giraffe');
        const apiCall = fetch.mock.calls[0];
        const fetchedURL = apiCall[0];
        expect(fetchedURL).toEqual('https://api.openai.com/v1/images/generations');
        const callParameters = apiCall[1];
        expect(callParameters.method).toEqual('POST');        
    });

    it('should create a bearer token using the api key', () => {
        fetchMocks.mockResponseOnce({status: 200});
        const result = getImage('api-key', 'a picture of a giraffe');
        const apiCall = fetch.mock.calls[0];
        const callParameters = apiCall[1];
        expect(callParameters.headers['Authorization']).toEqual('Bearer api-key');
    });    

    it('should request a 512x512 image with the given spec', () => {
        fetchMocks.mockResponseOnce({status: 200});
        const result = getImage('api-key', 'a picture of a giraffe');
        const apiCall = fetch.mock.calls[0];
        const callParameters = apiCall[1];
        const expectedBody = JSON.stringify({
            prompt: 'a picture of a giraffe',
            size: '512x512'
        });
        expect(callParameters.body).toEqual(expectedBody);
    });
});