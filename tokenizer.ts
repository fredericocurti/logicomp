import { Token, TokenType } from "./token";

export class Tokenizer {
    origin: string; /** Código fonte que será tokenizado */
    position: number; /** Posição atual que o tokenizer está separando */
    actual: Token; /** O último token separando */
    reservedKeywords = ['print', 'if', 'while', 'else', 'scan', 'int', 'bool', 'main', 'true', 'false']

    constructor(origin: string) {
        this.origin = origin
        this.position = 0
        this.actual = this.selectNext()
    }

    /** Lê o próximo token e atualiza o atributo actual */    
    selectNext(): Token {
        const getNext = () => {
            let char = null
            let nextChar = null
            let number = ''
            let str = ''

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

                // Stack identifier
                if (char && char.match(/[a-z0-9]/i)) {
                    str += char
                    if (nextChar === undefined || !nextChar.match(/[a-z0-9]/i)) {
                        // @ts-ignore
                        if (this.reservedKeywords.includes(str)) {
                            this.actual = new Token(str.toUpperCase() as TokenType['type'], str)
                        } else {
                            this.actual = new Token('IDENTIFIER', str)
                        }
                        return this.actual
                    }
                    continue
                }

                if (char === '=' && nextChar === '=') {
                    this.actual = new Token('COMPARISON', '==')
                    this.position++
                    return this.actual
                }

                if (char === '&' && nextChar === '&') {
                    this.actual = new Token('AND', '&&')
                    this.position++
                    return this.actual
                }

                if (char === '|' && nextChar === '|') {
                    this.actual = new Token('OR', '||')
                    this.position++
                    return this.actual
                }

                if (char === '=') {
                    this.actual = new Token('ASSIGNMENT', '=')
                    return this.actual
                }

                if (char === '>') {
                    this.actual = new Token('COMPARISON', '>')
                    return this.actual
                }

                if (char === '<') {
                    this.actual = new Token('COMPARISON', '<')
                    return this.actual
                }

                if (char === '{') {
                    this.actual = new Token('OPEN_BRACKETS', '{')
                    return this.actual
                }

                if (char === '}') {
                    this.actual = new Token('CLOSE_BRACKETS', '}')
                    return this.actual
                }

                if (char === ';') {
                    this.actual = new Token('SEMICOLON', ';')
                    return this.actual
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
    
        let token = getNext()

        if (process.env.DEBUG_TOKEN) {
            console.log(token)
        }

        return token
    }

    /** For debugging */
    parseAll() {
        let token = this.selectNext()
        while (token.type !== 'EOF') {
            token = this.selectNext()
        }
    }
}