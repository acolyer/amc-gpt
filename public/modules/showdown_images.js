import { getImage } from "./openai.js";
import { getApiKey } from "./bindings.js";

var imageNum = 0;

function setImageUrl(imgId, description) {
    getImage(getApiKey(), description).then(response => {
        response.json().then(json => {
           document.getElementById(imgId).src = json.data[0].url;
        });
    });
}

function renderImageElement(element) {
    const img = document.createElement('img');
    img.classList.add('openai');
    const id = `openai-image-${++imageNum}`;
    img.id = id;
    const imageDescription = element.innerText;
    img.alt = imageDescription;
    element.parentElement.replaceWith(img);
    const imgURL = setImageUrl(id, imageDescription);
}

function imageExtension() {
    const parser = new DOMParser();
    return [
        {
            type: 'output',
            filter: function(html) {
                const doc = parser.parseFromString(html, 'text/html');
                const wrapper = typeof doc.body !== 'undefined' ? doc.body : doc;
                const elements = wrapper.querySelectorAll('code.image.language-image')
                elements.forEach(element => {
                    renderImageElement(element);
                });
                return wrapper.innerHTML;
            }
        }
    ];
}

function initImagesExtension() { 
    showdowns.addExtension('image', imageExtension);
}

export { initImagesExtension }