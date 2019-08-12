import { Token } from "./token";

export class Tokenizer {
    origin: string; /** Código fonte que será tokenizado */
    position: number; /** Posição atual que o tokenizer está separando */
    actual: Token | null; /** O último token separando */
    constructor(origin: string) {
        this.origin = origin
        this.position = 0
        this.actual = null
    }

    /** Lê o próximo token e atualiza o atributo actual */    
    selectNext(): Token {
        let char = null
        let token = new Token('EOF', null)
        let number = ''

        while (this.position < this.origin.length) {
            char = this.origin[this.position]
            this.position++
            if (char === ' ') {
                if (number.length > 0) {
                    return new Token('INT', parseInt(number))
                }
            } else if (char === '+') {
                return new Token('PLUS', '+')
            } else if (char === '-') {
                return new Token('MINUS', '-')
            } else if (parseInt(char)) {
                number += char
                continue
            } else {
                throw new Error(`Invalid character ${char} at position ${this.position - 1}`)
            }
        }

        if (number.length > 0) {
            return new Token('INT', parseInt(number))
        }

        return token
    }
}