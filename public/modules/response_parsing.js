import { response } from "express";

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

function parseResponse(responseText) {
    const thoughts = extractSection("# Thoughts", responseText);
    const answer = extractSection('# Answer', responseText);
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