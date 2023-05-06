/*
 * Config format:
 * {
 *    defaultSection: 'section name',
 *    sections: [
 *      { 
 *         name: 'name',
 *         header: '# Header',
 *         processor: { newContent: fn, finish: fn }
 *      },
 *      ...
 *    ]
 * }
 */

class SectionParser {
    #config;
    #buffer = '';
    #rawContent = '';
    #currentSection = null;
    #preamble = true;
    #defaultSectionFinished = false;
    #headerRegex = null; 
    #sectionProcessor = null;
    #allHeaders = null;
    #startHandler = null;
    #endHandler = null;

    constructor(sectionConfig, startHandler, endHandler) {
        this.#config = sectionConfig;
        this.#currentSection = sectionConfig.defaultSection;
        this.#startHandler = startHandler;
        this.#endHandler = endHandler;
     }

     processChunk(chunkOfText) {
        if (this.#rawContent == '') { this.#startHandler() }
        if (chunkOfText == '[DONE]') {
            this.finish();
            this.#endHandler(this.getRawContent());
            return;
        }
        
        this.#rawContent += chunkOfText;
        this.#buffer += chunkOfText;
        var match = null;

        while ((match = this.#matchHeaders()) !== null) {
            const sectionStart = match.index;
            const sectionHeader = match[0];
            const sectionText = this.#buffer.slice(0,sectionStart);
            this.#completeSection(sectionText);

            this.#buffer = this.#buffer.slice(sectionStart + sectionHeader.length);
            this.#buffer = this.#buffer.trimStart();
            this.#newSectionStart(sectionHeader);
            this.#headerRegex.lastIndex = 0;
        }

        // push out whatever is left after header processing, being wary of partial headings...
        if (!this.#endsWithHeaderPrefix(this.#buffer)) {
            this.#addContent(this.#buffer);
            this.#buffer = '';
        }
     }

     getRawContent() {
        return this.#rawContent;
     }

     finish() { 
        this.#preamble = false;
        this.#completeSection(this.#buffer);
        if (!this.#defaultSectionFinished) {
            this.#configFor(this.#config.defaultSection).processor.finish();
        }
     }

     #matchHeaders() {
        if (this.#headerRegex == null) {
            const headers = this.#config.sections.map(section => section.header);
            const pattern = `(${headers.join('|')})`;
            this.#headerRegex = new RegExp(pattern,'g');
        }
        return this.#headerRegex.exec(this.#buffer);
     }

     #newSectionStart(header) {
        const sectionConfig = this.#config.sections.find(section => section.header == header);
        this.#currentSection = sectionConfig.name;
        this.#sectionProcessor = sectionConfig.processor;
     }

     #completeSection(sectionText) {
        this.#addContent(sectionText);
        if (this.#preamble) {
            this.#preamble = false; // made it to the first heading in the content
        } else {
            this.#finishSection();
        }
     }

     #addContent(content) {
        this.#processor().newContent(content);
     }

     #finishSection() {
        this.#processor().finish();
        if (this.#currentSection == this.#config.defaultSection) {
            this.#defaultSectionFinished = true;
        }
     }

     #processor() {
        if (this.#sectionProcessor == null) {
            const sectionConfig = this.#configFor(this.#currentSection);
            this.#sectionProcessor = sectionConfig.processor;
        }
        return this.#sectionProcessor;  
     }

     #configFor(sectionName) {
        return this.#config.sections.find(section => section.name == sectionName);
     }

     #endsWithHeaderPrefix(contentFragment) {
        const lines = contentFragment.split('\n');
        const lastLine = lines[lines.length - 1];
        if (lastLine.length == 0) { return false; }
        if (this.#allHeaders == null) {
            this.#allHeaders = this.#config.sections.map(section => section.header);
        }
        return this.#allHeaders.some(header => header.startsWith(lastLine));
    }
}

export { SectionParser }