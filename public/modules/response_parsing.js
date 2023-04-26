function isSectionHeader(line) {
    return line.startsWith('# Thoughts') ||
           line.startsWith('# Answer') ||
           line.startsWith('# Assumptions') ||
           line.startsWith('# Reflection') || 
           line.startsWith('# Follow-up questions')
}

function extractSection(section, response) {
    var sectionBody = '';
    const lines = response.split('\n');

    const sectionStart = lines.findIndex((l) => {
        return l.startsWith(section);
    });

    if (sectionStart == -1) {
        return '';
    } else {
       sectionBody = lines.slice(sectionStart + 1);
       const sectionEnd = sectionBody.findIndex(isSectionHeader);
       if (sectionEnd != -1) { 
        sectionBody = sectionBody.slice(0, sectionEnd);
       }
    }
    return sectionBody.join('\n');
}

function contentUpToFirstSectionHeader(response) {
    const lines = response.split('\n');
    const sectionStart = lines.findIndex(isSectionHeader);
    if (sectionStart == -1) {
        return response;
    } 

    const sectionBody = lines.slice(0, sectionStart);
    return sectionBody.join('\n');    
}

function parseResponse(responseText) {
    const thoughts = extractSection("# Thoughts", responseText);
    var answer = extractSection('# Answer', responseText);
    if (answer == '') {
        answer = contentUpToFirstSectionHeader(responseText);
    }
    const assumptions = extractSection('# Assumptions', responseText);
    const reflections = extractSection('# Reflection', responseText);
    const followUps = extractSection('# Follow-up questions', responseText);
    return {
        thoughts: thoughts,
        answer: answer,
        assumptions: assumptions,
        reflection: reflections,
        followUps: followUps
    };
}

export { parseResponse }