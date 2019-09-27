import { SymbolTable } from "./symboltable"
const readlineSync = require('readline-sync');

export class Node {
    value: any
    children: Node[]
    evaluate: () => any

    constructor() {
        this.children = []
        this.evaluate = () => new NoOp()
    }
}

export class BinOp extends Node {
    constructor(value: '+' | '-' | '*' | '/' | '&&' | '||' | '==' | '>' | '<', children: Node[] = []) {
        super()
        this.children = children
        this.value = value
    }

    evaluate = () => {
        if (this.value === '+') {
            return this.children[0].evaluate() + this.children[1].evaluate()
        } else if (this.value === '-') {
            return this.children[0].evaluate() - this.children[1].evaluate()
        } else if (this.value === '*') {
            return this.children[0].evaluate() * this.children[1].evaluate()
        } else if (this.value === '/') {
            return this.children[0].evaluate() / this.children[1].evaluate()
        } else if (this.value === '==') {
            return this.children[0].evaluate() === this.children[1].evaluate()
        } else if (this.value === '>') {
            return this.children[0].evaluate() > this.children[1].evaluate()
        } else if (this.value === '<') {
            return this.children[0].evaluate() < this.children[1].evaluate()
        } else {
            throw new Error('Invalid value on evaluate BinOp')
        }

    }
}

export class UnOp extends Node {
    constructor(value: '+' | '-', children: Node[] = []) {
        super()
        this.children = children
        this.value = value
    }
    evaluate = (): any => this.value === '+' ? this.children[0].evaluate() : -this.children[0].evaluate()
}

export class IntVal extends Node {
    constructor(value: number) {
        super()
        this.children.length = 0
        this.value = value
    }

    evaluate = () => {
        return this.value
    }
}

export class NoOp extends Node {
    constructor() {
        super()
        this.children.length = 0
    }
}

export class Identifier extends Node {
    constructor(value: string) {
        super()
        this.value = value
    }

    evaluate = () => {
        let value = SymbolTable.get(this.value)
        if (typeof value === "number") {
            return value
        }
        throw new Error(`Requested value for unitialized variable ${this.value}`)
    }
}

export class Print extends Node {
    constructor(children: Node[]) {
        super()
        this.children = children
    }

    evaluate = () => {
        console.log(this.children[0].evaluate())
    }
}

export class Statements extends Node {
    constructor() {
        super()
    }

    evaluate = () => {
        this.children.forEach(c => {
            c.evaluate()
        })
    }
}

export class Assignment extends Node {
    constructor(children: Node[]) {
        super()
        this.children = children
    }

    evaluate = () => {
        SymbolTable.set(this.children[0].value, this.children[1].evaluate())
    }
}

export class Scan extends Node {
    constructor() {
        super()
    }

    evaluate = () => {
        let input = readlineSync.question("")
        let number = parseInt(input)
        if (number) {
            return parseInt(input)
        } else {
            throw new Error(`scan() method expected number, received: ${input}`)
        }
    }
}

export class If extends Node {
    children: (BinOp | UnOp)[]
    constructor() {
        super()
        this.children = []
    }

    evaluate = () => {
        if (this.children[0].evaluate()) {
            this.children[1].evaluate()
            return
        }

        if (this.children[2]) {
            this.children[2].evaluate()
        }
    }
}

export class While extends Node {
    children: (BinOp | UnOp)[]
    constructor() {
        super()
        this.children = []
    }

    evaluate = () => {
        while (this.children[0].evaluate()) {
            this.children[1].evaluate()
        }
    }
}