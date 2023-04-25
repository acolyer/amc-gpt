import { getSystemPrompt, getUserPrompt } from "../public/modules/prompt_engineering";

describe('system prompt', () => {
  it("should include David Shapiro's heuristic imperatives", () => {
    expect(getSystemPrompt()).toContain('three heuristic imperatives');
  });

  it('should include the current time and date', () => {
    const expectedDatePrefix = new Date().toDateString();
    expect(getSystemPrompt()).toContain(expectedDatePrefix);
  });

  it ('should contain instructions to generate replies in markdown format', () => {
    expect(getSystemPrompt()).toContain('markdown');
  });

  it('should contain instructions for charts and graphs', () => {
    expect(getSystemPrompt()).toContain('mermaid');
    expect(getSystemPrompt()).toContain('gantt chart');
    expect(getSystemPrompt()).toContain('pie chart');
    expect(getSystemPrompt()).toContain('graphviz');
  });

  it('should contain instructions for mindmaps', () => {
    expect(getSystemPrompt()).toContain('mindmap');
  });

  it('should contain instructions for formatting math', () => {
    expect(getSystemPrompt()).toContain('math');
  });

  it('should contain instructions for generating image descriptions', () => {
    expect(getSystemPrompt()).toContain('```image');
  });

  it('should ask for chain of thought reasoning', () => {
    expect(getSystemPrompt()).toContain('please show your thinking');
  });

  it('should ask for assumptions to be called out', () => {
    expect(getSystemPrompt()).toContain('list the assumptions');
  });

  it('should ask for the output to be divided into a series of markdown sections', () => {
    expect(getSystemPrompt()).toContain('structure your response');
  });

  it('should ask for self-reflection', () => {
    expect(getSystemPrompt()).toContain('critique');
  });

  it('should ask for a list of potential follow-up questions', () => {
    expect(getSystemPrompt()).toContain('follow-up questions');
  });
});

describe('user prompt', () => {
  it('should include the current time and date', () => {
    const expectedDatePrefix = new Date().toDateString();
    expect(getUserPrompt('question')).toContain(expectedDatePrefix);
  });

  it('should include the question the user asked', () => {
    expect(getUserPrompt('A question')).toContain('A question');
  });
});