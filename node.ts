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
        if (typeof this.children[0].evaluate() !== 'number' || typeof this.children[1].evaluate() !== 'number') {
            throw new Error(`BinOp evaluating value with type != number`)
        }

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
        } else if (this.value === '&&') {
            return this.children[0].evaluate() && this.children[1].evaluate()
        } else if (this.value === '||') {
            return this.children[0].evaluate() || this.children[1].evaluate()
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
    type = 'int'
    constructor(value: number) {
        super()
        this.children.length = 0
        this.value = value
    }

    evaluate = () => {
        return this.value
    }
}

export class BoolVal extends Node {
    type = 'bool'
    constructor(value: boolean) {
        super()
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
        let entry = SymbolTable.get(this.value)
        
        if (!entry) {
            throw new Error(`Requested value for unitialized variable ${this.value}`)
        }

        if (entry.value) {
            if (entry.type === 'int' && typeof entry.value !== 'number') {
                throw new Error(`Variable ${this.value} of type ${entry.type} has value ${entry.value}`)
            }

            if (entry.type === 'bool' && typeof entry.value !== 'boolean') {
                throw new Error(`Variable ${this.value} of type ${entry.type} has value ${entry.value}`)
            }
        } else {
            throw new Error(`Requested value for unassigned variable ${this.value}`)
        }
        
        return entry.value
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
        let entry = SymbolTable.get(this.children[0].value)
        if (!entry) {
            throw new Error(`Missing type declaration for variable ${this.children[0].value}`)
        }
        SymbolTable.setValue(this.children[0].value, this.children[1].evaluate())
    }
}

export class Declaration extends Node {
    type: 'int' | 'bool'

    constructor(type: 'int' | 'bool') {
        super()
        this.children = []
        this.type = type
    }
    
    evaluate = () => {
        SymbolTable.setType(this.children[0].value, this.type)
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
        if (typeof this.children[0].evaluate() !== 'boolean') {
            throw new Error(`Expected boolean at IF statement, found ${this.children[0].evaluate()}`)
        }

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