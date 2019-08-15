export class Token {
    type: TokenType['type']
    value: TokenType['value']
    constructor(type: TokenType['type'], value: TokenType['value'])  {
        this.type = type
        this.value = value
    }
}

type TokenType = TokenPlus | TokenMinus | TokenInt | TokenEOF | TokenMultiply | TokenDivision

type TokenPlus = {
    type: 'PLUS'
    value: '+'
}

type TokenMinus = {
    type: 'MINUS'
    value: '-'
}

type TokenInt = {
    type: 'INT'
    value: number
}

type TokenEOF = {
    type: 'EOF'
    value: null
}

type TokenMultiply = {
    type: 'MULTIPLY'
    value: '*'
}

type TokenDivision = {
    type: 'DIVISION'
    value: '/'
}