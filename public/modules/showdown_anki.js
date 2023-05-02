function renderAnkiElement(element) {
    const card = document.createElement('div');
    card.classList.add('anki');
    const cardText = element.innerText;
    const lines = cardText.split('\n');
    const { front, back } = parseCard(lines);

    const frontOfCard = document.createElement('div');
    frontOfCard.classList.add('front');
    const frontOfCardContent = document.createElement('p');
    frontOfCardContent.innerHTML = front;
    frontOfCard.appendChild(frontOfCardContent);
    card.appendChild(frontOfCard);

    const backOfCard = document.createElement('div');
    backOfCard.classList.add('back');
    const backOfCardContent = document.createElement('p');
    backOfCardContent.innerHTML = back;
    backOfCard.appendChild(backOfCardContent);
    card.appendChild(backOfCard);

    const flip = document.createElement('button');
    flip.innerText = 'Flip card';
    card.appendChild(flip);

    element.parentElement.replaceWith(card);
}

function parseCard(lines) {
    const frontIndex = lines.findIndex(l => l.trim().startsWith('Front:'));
    const backIndex = lines.findIndex(l => l.trim().startsWith('Back:'));
    if (frontIndex == -1 || backIndex == -1) {
        // do our best with a badly formed card
        return { front: lines.join('\n'), back: '' }
    }
    const frontLines = lines.slice(frontIndex, backIndex);
    const front = frontLines.map(l => l.trim().replace('Front:',''));
    const backLines = lines.slice(backIndex);
    const back = backLines.map(l => l.trim().replace('Back:',''));
    return { front: front.join('\n'), back:  back.join('\n') };
}

function ankiExtension() {
    const parser = new DOMParser();
    return [
        {
            type: 'output',
            filter: function(html) {
                const doc = parser.parseFromString(html, 'text/html');
                const wrapper = typeof doc.body !== 'undefined' ? doc.body : doc;
                const elements = wrapper.querySelectorAll('code.anki.language-anki')
                elements.forEach(element => {
                    renderAnkiElement(element);
                });
                return wrapper.innerHTML;
            }
        }
    ];
}

function initAnkiExtension() { 
    showdowns.addExtension('anki', ankiExtension);
}

export { initAnkiExtension }