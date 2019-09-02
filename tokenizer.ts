import { Token } from "./token";

export class Tokenizer {
    origin: string; /** Código fonte que será tokenizado */
    position: number; /** Posição atual que o tokenizer está separando */
    actual: Token; /** O último token separando */
    constructor(origin: string) {
        this.origin = origin
        this.position = 0
        this.actual = this.selectNext()
    }

    /** Lê o próximo token e atualiza o atributo actual */    
    selectNext(): Token {
        let char = null
        let nextChar = null
        let number = ''
    
        while (this.position < this.origin.length) {
            char = this.origin[this.position]
            nextChar = this.origin[this.position + 1]
            this.position++

            // Skip whitespace or newline character
            if (char === ' ' || char === '\n') {
                continue
            }

            // Stack number
            if (char && char.match(/[0-9]/)) {
                number += char
                if (nextChar === undefined || !nextChar.match(/[0-9]/)) {
                    this.actual = new Token('INT', parseInt(number))
                    return this.actual
                }
                continue
            }

            // Parenthesis
            if (char === '(') {
                this.actual = new Token('OPEN_PAR', '(')
                return this.actual
            }

            if (char === ')') {
                this.actual = new Token('CLOSE_PAR', ')')
                return this.actual
            }
            
            // Operators
            if (char === '+') {
                this.actual = new Token('PLUS', '+')
                return this.actual
            }

            if (char === '-') {
                this.actual = new Token('MINUS', '-')
                return this.actual
            }

            if (char === '*') {
                this.actual = new Token('MULTIPLY', '*')
                return this.actual
            }

            if (char === '/') {
                this.actual = new Token('DIVISION', '/')
                return this.actual
            }

            throw new Error(`Unhandled character ${char} at position ${this.position - 1}`)            
        }

        this.actual = new Token('EOF', null)
        return this.actual
    }
}