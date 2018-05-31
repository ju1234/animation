function $(id) {
    return document.getElementById(id);
}

const inputList = [];
const inputs = $('inputs'), toggle = $('toggle'), ripple = $('ripple'), inputBody = $('inputBody');
const type = 'text';


class Ele {
    constructor(tagName, classList) {
        this.el = document.createElement(tagName);
        this.el.classList.add(classList);
    }

    fadeIn() {
        this.el.classList.remove('fadeOut');
        this.el.classList.add('fadeIn');
    }

    fadeOut() {
        this.el.classList.remove('fadeIn');
        this.el.classList.add('fadeOut');
    }

    hide() {
        this.el.classList.remove('show');
        this.el.classList.add('hide');
    }

    show() {
        this.el.classList.remove('hide');
        this.el.classList.add('show');
    }
}

class Input {
    constructor(type, value) {
        this.type = type;
        this.input = new Ele('input', 'input');
        this.inputWrap = new Ele('div', 'input-wrap');
        this.filler = new Ele('div', 'filler');
        this.inputEl = this.input.el;

        this.inputEl.value = value;

        this.inputWrap.el.appendChild(this.inputEl);
        this.inputWrap.el.appendChild(this.filler.el);

        this.filler.hide();
        this.input[type === 'password' ? 'hide' : 'show']();

        this.inputEl.addEventListener('keydown', (e) => {
            if (e.keyCode === 8 && e.target.value === '') {
                this.remove();
            }
        });

        this.inputEl.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value && this.type === 'password') {
                this.filler.show();
            }
        });

    }

    switch() {
        const { type } = this;
        this.input[type === 'password' ? 'fadeIn' : 'fadeOut']();
        if (this.value()) {
            this.filler[type === 'password' ? 'fadeOut' : 'fadeIn']();
        }
        this.type = type === 'password' ? 'text' : 'password';
    }

    value() {
        return this.inputEl.value;
    }

    setValue(value) {
        this.inputEl.value = value;
    }

    append(parent) {
        if (this.parent || !(parent instanceof HTMLElement)) return;
        this.parent = parent;
        this.parent.appendChild(this.inputWrap.el);
        this.focus();
    }

    remove() {
        if (!this.parent) return;
        this.parent.removeChild(this.inputEl);
    }

    focus() {
        this.inputEl.focus();
    }

    blur() {
        this.inputEl.blur();
    }

    on(eventName, handle) {
        this.inputEl.addEventListener(eventName, handle);
    }
}


window.onload = function () {
    const defaultValue = 'password'.split('');
    for (let item of defaultValue) {
        appendNewInput(item);
    }

    inputs.addEventListener('click', function (e) {
        if (e.target === this) {
            const inputListLength = inputList.length;
            if (inputListLength > 0 && inputList[inputListLength - 1].value() === '') {
                inputList[inputList.length - 1].focus();
            } else {
                appendNewInput();
            }
        }
    });


    ripple.addEventListener('animationend', function () {
        this.classList.remove('ripple');
    });
    inputBody.addEventListener('animationend', function () {
        this.classList.remove('vibrate');
    });
    toggle.addEventListener('click', function () {
        ripple.classList.add('ripple');
        inputBody.classList.add('vibrate');

        inputList.forEach((item, i) => {
            setTimeout(() => {
                item.switch();
            }, i * 30);
        });
    });
};

/**
 * input标签输入之后
 * @param e
 */
function afterInput(input, e) {
    const value = e.target.value;
    console.log(value);
    if (value !== '') {
        this.value = value;
        this.blur();
        appendNewInput();
    } else {
        input.remove();
    }
}

/**
 * 插入新的Input
 */
function appendNewInput(value = '') {
    const input = new Input(type, value);
    input.on('input', afterInput.bind(input.inputEl, input));
    input.append(inputs);
    input.focus();
    inputList.push(input);
}