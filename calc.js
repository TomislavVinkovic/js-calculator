class Display {
    constructor(id, del, clear) {
        this.node = document.querySelector(`#${id}`);
        this.arithBuffer = {
            fst: "0",
            snd: "",
            op: null,
            clear: function() {
                this.fst = "0";
                this.op = null;
                this.snd = "";
            }
        };
        this.node.textContent = this.arithBuffer.fst;
        this.del = del;
        this.clear = clear;

        this.setFst = function(num, append = true) {
            if(append) {
                this.arithBuffer.fst += num;
                this.node.textContent += num;
            }
            else {
                this.arithBuffer.fst = num;
                this.updateScreen();
            }
        }

        this.setOp = function(op) {
            this.arithBuffer.op = op;
            if(op === null) {
                this.node.textContent = this.node.textContent.slice(0, -3);
                return;
            }
            this.updateScreen();
        }

        this.setSnd = function(num, append = true) {
            if(append) {
                this.arithBuffer.snd += num;
                this.node.textContent += num;
            }
            else {
                this.arithBuffer.snd = num;
                this.updateScreen();
            }
        }

        this.calculate = function(result) {
            this.arithBuffer.fst = result;
            this.node.textContent = result;
        }

        this.setResult = function(op){
            this.arithBuffer.snd = "";
            if(op !== null) {
                this.setOp(op);
                this.updateScreen();
            }
            else this.arithBuffer.op = null;
            this.updateScreen();
        }

        this.updateScreen = function() {
            this.clear(false);
            this.node.textContent += this.arithBuffer.fst;
            if(this.arithBuffer.op !== null) this.node.textContent += ` ${this.arithBuffer.op} `;
            this.node.textContent += this.arithBuffer.snd;
        }
    }
}

class NodeButton {
    constructor(id) {
        this.node = document.querySelector(`#${id}`);
        this.node.addEventListener('transitionend', (e) => {
            if (e.propertyName !== 'transform') return;
            e.target.classList.remove('active');
        });
    }
}

class ArithButton extends NodeButton {
    constructor(id, op) {
        super(id);
        this.op = op;
        this.node.addEventListener('click', (e) => {
            e.stopPropagation();
            this.node.classList.add('active');
            this.op()
        });
        this.click = function() {
            this.node.dispatchEvent(new Event('click'));
        }
    }
}

class NumberButton extends NodeButton {
    constructor(id, value) {
        super(id);
        this.value = value;
        this.node.addEventListener('click', (e) => {
            e.stopPropagation();
            this.node.classList.add('active');
            if(display.arithBuffer.op == null) {
                display.setFst(this.value, display.arithBuffer.fst === '0' ? false : true);
                return;
            }
            if(display.arithBuffer.op !== null) {
                display.setSnd(this.value);
                return;
            }
        });
        this.click = function() {
            this.node.dispatchEvent(new Event('click'));
        }
    }
}

const calculator = document.querySelector('#calculator');

//display declaration
const deleteFunc = function() {
    if(display.arithBuffer.snd === "") {
        if(display.arithBuffer.op === null) {
            if(display.arithBuffer.fst === "") return;
            else {
                display.setFst(display.arithBuffer.fst.slice(0, -1), false);
                return;
            }
        }
        else {
            display.setOp(null);
            return;
        }
    }
    else {
        display.setSnd(display.arithBuffer.snd.slice(0, -1), false);
    }
}

const clearFunc = function(clearBuffer = true) {
    if(clearBuffer) display.arithBuffer.clear();
    display.node.textContent = display.fst;
}

const display = new Display('display', deleteFunc, clearFunc);

//arithmetic button declarations
const addFunc = function() {
    if(display.arithBuffer.fst === "") return;
    if(display.arithBuffer.snd !== "") equalsFunc('+');
    else display.setOp('+');
}

const subFunc = function() {
    if(display.arithBuffer.fst === "") return;
    if(display.arithBuffer.snd !== "") equalsFunc('-');
    else display.setOp('-');
}

const multFunc = function() {
    if(display.arithBuffer.fst === "") return;
    if(display.arithBuffer.snd !== "") equalsFunc('*');
    else display.setOp('*');
}

const divFunc = function() {
    if(display.arithBuffer.fst === "") return;
    if(display.arithBuffer.snd !== "") equalsFunc('/');
    else display.setOp('/');
}

const equalsFunc = function(op = null) {
    if(
        display.arithBuffer.fst !== "" &&
        display.arithBuffer.op !== null &&
        display.arithBuffer.snd !== "" ||

        display.arithBuffer.fst !== "" && 
        display.arithBuffer.op === null
    ) calculate(op);
}

const calculate = function(passedOp=null) {
    if(display.arithBuffer.fst !== "" && display.arithBuffer.op === null) {
        return;
    }
    if(
        display.arithBuffer.fst !== "" &&
        display.arithBuffer.op !== null &&
        display.arithBuffer.snd !== ""
    ) {
        let fst = Number(display.arithBuffer.fst);
        let op = display.arithBuffer.op;
        let snd = Number(display.arithBuffer.snd);
        switch(op) {
            case '+':
                display.calculate((fst + snd).toString());
                break;

            case '-':
                display.calculate((fst - snd).toString());
                break;

            case '*':
                display.calculate((fst * snd).toString());
                break;

            case '/':
                display.calculate( (Math.round((fst / snd).toPrecision(10))/10000).toString() );
                break;
        }
        display.setResult(passedOp);
        
    }
}

const roundNumericStr = (numStr) => {
    if(!numStr.includes('.')) {
        return Number(numStr);
    }

}

const ac = new ArithButton('ac', display.clear);
const del = new ArithButton('del', display.del);

const mult = new ArithButton('mult', multFunc);
const add = new ArithButton('add', addFunc);
const sub = new ArithButton('sub', subFunc);
const div = new ArithButton('div', divFunc);
const equals = new ArithButton('equals', () => equalsFunc(null));

//number button declarations
const one = new NumberButton('one', 1);
const two = new NumberButton('two', 2);
const three = new NumberButton('three', 3);
const four = new NumberButton('four', 4);
const five = new NumberButton('five', 5);
const six = new NumberButton('six', 6);
const seven = new NumberButton('seven', 7);
const eight = new NumberButton('eight', 8);
const nine = new NumberButton('nine', 9);
const zero = new NumberButton('zero', 0);
const point = new NumberButton('point', '.');


//keyboard support
const keyboardMapper = new Proxy ({
    'Digit0|Numpad0' : zero,
    'Digit1|Numpad1' : one,
    'Digit2|Numpad2' : two,
    'Digit3|Numpad3' : three,
    'Digit4|Numpad4' : four,
    'Digit5|Numpad5' : five,
    'Digit6|Numpad6' : six,
    'Digit7|Numpad7' : seven,
    'Digit8|Numpad8' : eight,
    'Digit9|Numpad9' : nine,
    'NumpadDivide' : div,
    'NumpadMultiply' : mult,
    'NumpadSubtract' : sub,
    'NumpadAdd' : add,
    'Enter|NumpadEnter' : equals,
    'Backspace' : del,
    'ShiftLeft' : ac

}, {get : (t, p) => 
    Object.keys(t).reduce((r, v) => 
        r !== undefined ? r : (new RegExp(v).test(p) ? t[v] : undefined), undefined
    )
});

window.addEventListener('keydown', (e) => {
    if(keyboardMapper[e.code] !== undefined) {
        keyboardMapper[e.code].click();
    }
});