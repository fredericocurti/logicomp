import { SymbolTable } from "./symboltable"
import { Assembler } from "./assembler";
const readlineSync = require('readline-sync');

export class Node {
    static idCounter = 0
    value: any
    children: Node[]
    evaluate: () => any
    id: number

    constructor() {
        Node.idCounter++
        this.id = Node.idCounter
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
        // if (typeof this.children[0].evaluate() !== 'number' || typeof this.children[1].evaluate() !== 'number') {
        //     throw new Error(`BinOp evaluating value with type != number`)
        // }

        if (process.env.ASSEMBLE) {
            let first = this.children[0].evaluate()
            Assembler.append(`  PUSH EBX\n`);
            let second = this.children[1].evaluate()
            Assembler.append(`  POP EAX\n`);
            if (this.value === '+') {
                Assembler.append(`  ADD EBX, EAX\n`)
                return first + second
            } else if (this.value === '-') {
                Assembler.append(`  SUB EAX, EBX\n`)
                Assembler.append(`  MOV EBX, EAX\n`)
                return first - second
            } else if (this.value === '*') {
                Assembler.append(`  IMUL EBX\n`)
                Assembler.append(`  MOV EBX, EAX\n`)
                return first * second
            } else if (this.value === '/') {
                Assembler.append(`  IDIV EBX\n`)
                Assembler.append(`  MOV EBX, EAX\n`)
                return first / second
            } else if (this.value === '==') {
                Assembler.append(`  CMP EAX, EBX\n`)
                Assembler.append(`  CALL binop_je\n`)
                return first === second
            } else if (this.value === '>') {
                Assembler.append(`  CMP EAX, EBX\n`)
                Assembler.append(`  CALL binop_jg\n`)
                return first > second
            } else if (this.value === '<') {
                Assembler.append(`  CMP EAX, EBX\n`)
                Assembler.append(`  CALL binop_jl\n`)
                return first < second
            } else if (this.value === '&&') {
                Assembler.append(`  AND EBX, EAX\n`)
                return first && second
            } else if (this.value === '||') {
                Assembler.append(`  OR EBX, EAX\n`)
                return first || second
            } else {
                throw new Error('Invalid value on evaluate BinOp')
            }

        } else {
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
        Assembler.append(`  MOV EBX, ${this.value}\n`)
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
        
        Assembler.append(`  MOV EBX, [EBP-${entry.offset}]\n`)
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
        Assembler.append(`  PUSH EBX\n`)
        Assembler.append(`  CALL print\n`)
        Assembler.append(`  POP EBX\n`)
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
        // console.log(SymbolTable.symbolTable)
        Assembler.append(`  MOV [EBP-${entry.offset}], EBX\n`)
    }
}

export class Declaration extends Node {
    type: 'int' | 'bool'
    offset: number
    static offsetCounter: number = 4

    constructor(type: 'int' | 'bool') {
        super()
        this.children = []
        this.type = type
        this.offset = Declaration.offsetCounter
        Declaration.offsetCounter += 4
    }
    
    evaluate = () => {
        SymbolTable.setType(this.children[0].value, this.type)
        SymbolTable.setOffset(this.children[0].value, this.offset)
        Assembler.append(`  PUSH DWORD 0\n`)
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
        const condition = this.children[0].evaluate()
        if (typeof condition !== 'boolean') {
            throw new Error(`Expected boolean at IF statement, found ${this.children[0].evaluate()}`)
        }

        if (process.env.ASSEMBLE) {
            Assembler.append(`  CMP EBX, False\n`)
            Assembler.append(`  JE ELSE_${this.id}\n`)
            this.children[1].evaluate()
            Assembler.append(`  JMP ENDIF_${this.id}\n`)
            Assembler.append(`  ELSE_${this.id}:\n`)
            this.children[2].evaluate()
            Assembler.append(`  ENDIF_${this.id}:\n`)
        } else {
            if (condition) {
                this.children[1].evaluate()
                return
            }

            if (this.children[2]) {
                this.children[2].evaluate()
            }
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
        if (process.env.ASSEMBLE) {
            Assembler.append(`\n  WHILE_${this.id}:\n`)
            let condition = this.children[0].evaluate()
            if (typeof condition === 'boolean') {
                Assembler.append(`  CMP EBX, False\n`)
                Assembler.append(`  JE EXIT_${this.id}\n`)
                this.children[1].evaluate()
                Assembler.append(`  JMP WHILE_${this.id}\n`)
                Assembler.append(`  EXIT_${this.id}:\n`)
            } else {
                throw new Error(`Expected boolean at WHILE`)
            }
            
        } else {
            while (this.children[0].evaluate()) {
                this.children[1].evaluate()
            }
        }
    }
}