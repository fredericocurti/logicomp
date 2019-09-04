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
    constructor(value: '+' | '-' | '*' | '/', children: Node[] = []) {
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