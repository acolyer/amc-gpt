import { SectionParser } from '../public/modules/parser.js'

class SectionProcessor {
    constructor(name) {
        this.name = name;
        this.content = '';
        this.completed = false;
    }

    newContent(text) {
        this.content += text;
    }

    getContent() {
        return this.content;
    }

    finish() {
        this.completed = true;
    }

    getCompleted() {
        return this.completed;
    }
}

function getSectionConfig() {
    const thoughts = new SectionProcessor('thoughts');
    const answers = new SectionProcessor('answer'); 
    const assumptions = new SectionProcessor('assumptions');
    const reflections = new SectionProcessor('reflections');
    const followUps = new SectionProcessor('followUps');

    return {
        defaultSection: 'answer',
        sections: [
            {
                name: 'thoughts',
                header: '# Thoughts',
                processor: thoughts
            },
            {
                name: 'answer',
                header: '# Answer',
                processor: answers
            },
            {
                name: 'assumptions',
                header: '# Assumptions',
                processor: assumptions
            },
            {
                name: 'reflections',
                header: '# Reflection',
                processor: reflections
            },
            {
                name: 'followUps',
                header: '# Follow-up questions',
                processor: followUps
            }          
        ]
    }
}

var sectionConfig = null;
var sectionParser = null;

beforeEach(() => { 
    sectionConfig = getSectionConfig();
    sectionParser = new SectionParser(sectionConfig);
});

function processorFor(name) {
    return sectionConfig.sections.find(section => section.name == name).processor;
}

describe('SectionParser', () => {
    it('collects the raw content passed to it', () => {
        sectionParser.processChunk('Hello ');
        sectionParser.processChunk('World!');
        sectionParser.finish();
        expect(sectionParser.getRawContent()).toEqual('Hello World!');
    });

    it('sends all text to the default section in the absence of any headings', () => {
        sectionParser.processChunk('Hello ');
        sectionParser.processChunk('World!');
        sectionParser.finish();
        expect(processorFor('answer').getContent()).toEqual('Hello World!');
        expect(processorFor('answer').getCompleted()).toBe(true);
    });

    it('sends preamble before the first heading to the default section', () => {
        sectionParser.processChunk('Hello World!\n');
        sectionParser.processChunk('# Thoughts');
        sectionParser.finish();
        const answerProcessor = processorFor('answer');
        expect(answerProcessor.getContent()).toEqual('Hello World!\n');
        expect(answerProcessor.getCompleted()).toBe(true);
    });

    it ('adds preamble to the default section if it is later present', () => {
        sectionParser.processChunk('Hello World!\n');
        sectionParser.processChunk('# Thoughts\n');
        sectionParser.processChunk('Some thoughts...\n');
        sectionParser.processChunk('# Answer\n');
        sectionParser.processChunk('More answer.');
        sectionParser.finish();
        const answerProcessor = processorFor('answer');
        expect(answerProcessor.getContent()).toEqual('Hello World!\nMore answer.');
        expect(answerProcessor.getCompleted()).toBe(true);
    });

    it ('copes with headers split across chunks', () => {
        sectionParser.processChunk('# Thoughts\n');
        sectionParser.processChunk('A thought\n');
        sectionParser.processChunk('# An');
        sectionParser.processChunk('swer\nSome answer text');
        sectionParser.finish();
        const answerProcessor = processorFor('answer');
        const thoughtProcessor = processorFor('thoughts');
        expect(answerProcessor.getCompleted()).toBe(true);
        expect(thoughtProcessor.getCompleted()).toBe(true);
        expect(answerProcessor.getContent()).toEqual('Some answer text');
        expect(thoughtProcessor.getContent()).toEqual('A thought\n');
    });

    it ('parses text with all the expected headings', () => {
        sectionParser.processChunk('# Thoughts\nA thought\n# Ans');
        sectionParser.processChunk('wer\nAn answer\n');
        sectionParser.processChunk('# Assumptions\n * An assumption\n');
        sectionParser.processChunk('# Reflection\nA reflection\n');
        sectionParser.processChunk('# Follow-up questions\n');
        sectionParser.processChunk('* The end\n');
        sectionParser.finish();
        expect(processorFor('thoughts').getCompleted()).toBe(true);
        expect(processorFor('answer').getCompleted()).toBe(true);
        expect(processorFor('assumptions').getCompleted()).toBe(true);
        expect(processorFor('reflections').getCompleted()).toBe(true);
        expect(processorFor('followUps').getCompleted()).toBe(true);
        expect(processorFor('thoughts').getContent()).toEqual('A thought\n');
        expect(processorFor('answer').getContent()).toEqual('An answer\n');
        expect(processorFor('assumptions').getContent()).toEqual('* An assumption\n');
        expect(processorFor('reflections').getContent()).toEqual('A reflection\n');
        expect(processorFor('followUps').getContent()).toEqual('* The end\n');
    });
});