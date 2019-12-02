import { SymbolTable } from "./symboltable"
import { stat } from "fs";

const globalSymbolTable = new SymbolTable()
let currentSymbolTable = globalSymbolTable
const util = require('util')
const readlineSync = require('readline-sync');

export const print = (arg: any) => console.log(util.inspect(arg,  {showHidden: false, depth: null}, true, true))

export class Node {
    value: any
    children: Node[]
    evaluate: () => any
    id: number
    static count: number = 0

    constructor() {
        Node.count += 1
        this.evaluate = () => new NoOp()
        this.children = []
        this.id = Node.count
    }
}

export class BinOp extends Node {
    constructor(value: '+' | '-' | '*' | '/' | '&&' | '||' | '==' | '>' | '<', children: Node[] = []) {
        super()
        this.children = children
        this.value = value
    }

    evaluate = () => {
        let first = this.children[0].evaluate()
        let second = this.children[1].evaluate()
        if (typeof first !== 'number' || typeof first !== 'number') {
            throw new Error(`BinOp evaluating value with type != number`)
        }

        if (this.value === '+') {
            return first + second
        } else if (this.value === '-') {
            return first - second
        } else if (this.value === '*') {
            return first * second
        } else if (this.value === '/') {
            return first / second
        } else if (this.value === '=') {
            return first === second
        } else if (this.value === '>') {
            return first > second
        } else if (this.value === '<') {
            return first < second
        } else if (this.value === '&&') {
            return first && second
        } else if (this.value === '||') {
            return first || second
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
        let entry = currentSymbolTable.get(this.value)
        
        if (!entry) {
            throw new Error(`Requested value for unitialized variable ${this.value}`)
        }

        if (entry.value !== null && entry.value !== undefined) {
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
        let entry = currentSymbolTable.get(this.children[0].value)
        if (!entry) {
            throw new Error(`Missing type declaration for variable ${this.children[0].value}`)
        }
        currentSymbolTable.setValue(this.children[0].value, this.children[1].evaluate())
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
        currentSymbolTable.setType(this.children[0].value, this.type)
    }
}

export class FunctionDeclaration extends Node {
    constructor() {
        super()
    }

    evaluate = () => {
        globalSymbolTable.setValue(this.children[0].value, this)
        globalSymbolTable.setType(this.children[0].value, 'function')
    }
}

/** The children in this node are the function arguments */
export class FunctionCall extends Node {
    value: string
    symbolTable: SymbolTable
    previousSymbolTable: SymbolTable
    constructor(value: string) {
        super()
        this.value = value;
        this.symbolTable = new SymbolTable()
        this.previousSymbolTable = new SymbolTable()
    }

    evaluate = () => {
        let parameters: any
        let statements
        let retval = null
        let fnDeclaration: null | FunctionDeclaration = null
        try {
            fnDeclaration = globalSymbolTable.get(this.value).value
        } catch (error) {
            throw new Error(`Called undefined function ${this.value}`)
        }

        if (fnDeclaration) {
            this.previousSymbolTable = currentSymbolTable
            this.symbolTable.scope = fnDeclaration.children[0].value
        
            parameters = fnDeclaration.children.slice(1, fnDeclaration.children.length - 1)
            statements = fnDeclaration.children[fnDeclaration.children.length - 1]
    
            /** pass arguments to function's scope symbol table */ 
            this.children.forEach((arg, index) => {
                this.symbolTable.setValue(parameters[index].children[0].value, this.children[index].evaluate())
            })

            this.symbolTable.setValue(this.symbolTable.scope, null)
            this.symbolTable.setType(this.symbolTable.scope, 'int')

            /** temporarily switch symbol tables */
            currentSymbolTable = this.symbolTable
            
            statements.evaluate()

            retval = this.symbolTable.get(this.symbolTable.scope)

            /** Revert ST */
            currentSymbolTable = this.previousSymbolTable

            if (retval) {
                return retval.value
            }

        } else {
            throw new Error(`Called undefined function ${this.value}`)
        }
    }
}

/** Children[0] is the return value */
export class Return extends Node {
    constructor(value: Node) {
        super()
        this.children[0] = value
    }

    evaluate = () => {
        if (this.children[0]) {
            currentSymbolTable.setValue(currentSymbolTable.scope, this.children[0].evaluate())
            currentSymbolTable.setType(currentSymbolTable.scope, 'int')
            return currentSymbolTable.get(currentSymbolTable.scope).value
        } else {
            throw new Error(`Return has empty statement`)
        }
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