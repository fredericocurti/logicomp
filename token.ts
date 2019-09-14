export class Token {
    type: TokenType['type']
    value: TokenType['value']
    constructor(type: TokenType['type'], value: TokenType['value'])  {
        this.type = type
        this.value = value
    }
}

export type TokenType = 
    TokenPlus 
    | TokenMinus 
    | TokenInt 
    | TokenEOF 
    | TokenMultiply 
    | TokenDivision 
    | TokenClosePar 
    | TokenOpenPar 
    | TokenCloseBrackets 
    | TokenOpenBrackets
    | TokenSemicolon
    | TokenIdentifier
    | TokenAssignment
    | TokenPrint

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

type TokenOpenPar = {
    type: 'OPEN_PAR'
    value: '('
}

type TokenClosePar = {
    type: 'CLOSE_PAR'
    value: ')'
}

type TokenOpenBrackets = {
    type: 'OPEN_BRACKETS'
    value: '{'
}

type TokenCloseBrackets = {
    type: 'CLOSE_BRACKETS'
    value: '}'
}

type TokenSemicolon = {
    type: 'SEMICOLON'
    value: ';'
}

type TokenIdentifier = {
    type: 'IDENTIFIER'
    value: string
}

type TokenAssignment = {
    type: 'ASSIGNMENT'
    value: '='
}

type TokenPrint = {
    type: 'PRINT'
    value: 'print'
}