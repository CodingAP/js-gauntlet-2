current = { x: 0, y: 0 };

const parseLocation = () => {
    let str = document.querySelector('#piece-location').innerHTML;
    let numbers = str.split(/[\(\)]/g)[1].split(', ').map(Number);
    return { x: numbers[0], y: numbers[1] }
}

const moveTo = (x, y) => {
    let dx = Math.abs(current.x - x);
    let dy = Math.abs(current.y - y);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    for (let i = 0; i < dx; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: (current.x < x) ? 'ArrowRight' : 'ArrowLeft' }));
    }

    for (let i = 0; i < dy; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: (current.y < y) ? 'ArrowDown' : 'ArrowUp' }));
    }

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    for (let i = 0; i < dx; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: (current.x < x) ? 'ArrowLeft' : 'ArrowRight' }));
    }

    for (let i = 0; i < dy; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: (current.y < y) ? 'ArrowUp' : 'ArrowDown' }));
    }
}

const setCurrent = (x, y) => {
    let dx = Math.abs(current.x - x);
    let dy = Math.abs(current.y - y);

    for (let i = 0; i < dx; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: (current.x < x) ? 'ArrowRight' : 'ArrowLeft' }));
    }

    for (let i = 0; i < dy; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: (current.y < y) ? 'ArrowDown' : 'ArrowUp' }));
    }

    current.x = x;
    current.y = y;
}

window.addEventListener('keydown', event => {
    let pos = parseLocation();
    if (event.key == 'r' && (current.x !== pos.x || current.y !== pos.y)) {
        moveTo(pos.x, pos.y);
    }

    if (event.key == 'w' && current.y != 0) {
        setCurrent(current.x, current.y - 1);
    }

    if (event.key == 'a' && current.x != 0) {
        setCurrent(current.x - 1, current.y);
    }

    if (event.key == 's' && current.y != 19) {
        setCurrent(current.x, current.y + 1);
    }

    if (event.key == 'd' && current.x != 31) {
        setCurrent(current.x + 1, current.y);
    }
});