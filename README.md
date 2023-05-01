# amc-gpt

`amc-gpt` is the ChatGPT client that I wanted once I realised I could do client-side 'plugins' by asking ChatGPT to render its responses in markdown using the range of markdown extensions available for diagrams etc. Over and above the online ChatGPT and OpenAI
playground interfaces it provides for:

* Rich output, with the ability to render basic text styles (markdown), math, and some charts and  
  diagrams e.g. pie charts, gantt charts, mindmaps, flow diagrams etc. (mermaid). It also simulates
  multi-modal *output* (but not input) by asking ChatGPT to describe images that it would like to accompany its responses, and then having those images generated and rendered inline.
* Commentary on the main answer, by asking ChatGPT to show its thinking and any assumptions that
  were made in producing the answer. ChatGPT is also asked to critique the answer which highlights useful things to be aware of in some circumstances.
* Suggestions for follow-up questions you might like to ask, clicking on any of these copies it into
  the message box ready for you to send to ChatGPT
* You can use newlines in your message just with the enter key, and then Cmd-Enter will send it (or you can click on the button if you prefer)
* A print stylesheet so that you can easily print your full chat history!

## Usage

`amc-gpt` is designed as a static web site. To use it you need to provide an API key. But be careful! [OpenAI API keys](https://platform.openai.com/account/api-keys) are linked to your credit card and should be kept safe. I recommend creating a new named key (so that you can revoke it independently of any other API keys you may be using) and ensuring that you [set spending alerts and limits](https://platform.openai.com/account/billing/limits). Just because someone tells you they will only use your key for the purposes you expected, that doesn't make it so. Since amc-gpt is open source you can review the code to see exactly what happens with your key (it is never stored anywhere, and sent only to the OpenAI API endpoints under https in an Authorization header). Furthermore, by inpecting the GH Action workflow in [static.yml](./.gitub/workflows/static.yml) and the [commit hash of the latest build](https://github.com/acolyer/amc-gpt) you can satisfy yourself that the code running at [https://acolyer.github.io/amc-gpt/](https://acolyer.github.io/amc-gpt/) (should you choose to experiment with the hosted version rather than run it locally yourself) is what you have inspected. The software is provided "as is" in accordance with the [MIT License](LICENSE.md).

You just need to paste a key into the api key input field, and it will be read directly from the page. If you refresh the page or load another tab you will have to re-enter your key.

`amc-gpt` works by asking ChatGPT to generate responses in a certain format (markdown with extensions, and responses divided into sections with thoughts, assumption, the final answer, reflection on that answer, and a suggested set of follow-up questions). These replies are then parsed as they are received to format them (including any math, charts, tables, images etc.) and the different content sections are sent to different parts of the UI.

The "final answers" show in your main chat history. The thoughts, assumptions, reflections (critique) and follow-up questions (collectively, the "commentary") go into a sidebar. If you go back in history through your chat and click on any answer, the commentary associated with that answer will load. It is designed to work best on larger screens where the commentary is placed to the right of the main chat. There are [example screenshots](#examples-of-amc-gpt-in-action) below.

Sometimes ChatGPT doesn't adhere to the requested structures in its replies. In that case amc-gpt defaults to putting the content into the answer (main chat log), but you may also see cases where content that shouldn't ends up in the commentary section. In the future I will experiment with automatically reminding ChatGPT to use the requested format in cases when it hasn't.

For visualisations etc., it often seems to help to explictly ask for e.g. "a pie-chart showing that information". For images it can help to ask ChatGPT to "describe the image in an image block." I've found things such as "Can you give me a mindmap of the key points in this conversation" to work well. Sometimes the markup ChatGPT generates for charts, graphs, and mindmaps isn't quite correct. In this case you will see a rendering error reported. In the future amc-gpt might experiment with sending the error details back to ChatGPT and asking it to try again. ChatGPT 4 might also be better in this regard (currently amc-gpt using the 3.5 model series).

## Installation

* git clone
* yarn install
* yarn start

Or try out the hosted version at [https://acolyer.github.io/amc-gpt/](https://acolyer.github.io/amc-gpt/).

## Built with

The idea was to keep the codebase as light as possible. It is a single page static site using vanilla HTML, CSS and Javascript, and served from 'public' by express (for loading of ESM modules).

* Prism.js is used for rendering code blocks
* Showndowns is used for rendering markdown and the mermaid, graphviz and math extensions to markdown
* The OpenAI API is used for chat completions and image generation

## Examples of amc-gpt in action

### The main setup, illustrating the answer, commentary, and follow-ups sections

![Main view](screenshots/Asides.png)

Just click on any of the questions to ask them!

### A simple clean style

![Chat history](screenshots/CleanInterface.png)

### Inline rendering of charts

![Chart example](screenshots/InlineRenderingOfCharts.png)

### Inline rendering of images

This is done by asking ChatGPT to describe  the image it would like to include in its response if it
could. The image is created in an "image" code block, and a showdown (markdown rendering) extension
takes the text and sends it to DALL-E to produce an image that is then rendered inline.

![Image example](screenshots/InlineImageGeneration.png)

### Mindmaps

Another example of an inline chart, it is often helpful to ask ChatGPT to create a mindmap outlining
key points in your conversation.

![Mindmap example](screenshots/Mindmaps.png)

### Math

Math can be escaped with $ and $$ and will be rendered correctly. ChatGPT is instructed to quote math
as needed in these delimiters.

![Math example](screenshots/Math.png)


## Roadmap

Bugs, TODOs and future features all moved to GitHub issues.

  ## Credits

  * Typewriter sound effect trimmed from an original at pixabay
  * Meerkat icon from https://iconarchive.com