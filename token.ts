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
    | TokenIf
    | TokenElse
    | TokenWhile
    | TokenScan
    | TokenComparison
    | TokenAnd
    | TokenOr
    | TokenMain
    | TokenBool
    | TokenTrue
    | TokenFalse
    | TokenComma
    | TokenReturn
    | TokenFunctionDeclaration
    | TokenOpenBucket
    | TokenCloseBucket
    | TokenDo

type TokenFunctionDeclaration = {
    type: 'FUNCTIONDECLARATION'
    value: '!'
}

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

type TokenBool = {
    type: 'BOOL'
    value: boolean
}

type TokenTrue = {
    type: 'TRUE'
    value: true
}

type TokenFalse = {
    type: 'FALSE'
    value: false
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

type TokenAnd = {
    type: 'AND'
    value: '&&'
}

type TokenOr = {
    type: 'OR'
    value: '||'
}

type TokenOpenPar = {
    type: 'OPEN_PAR'
    value: '('
}

type TokenClosePar = {
    type: 'CLOSE_PAR'
    value: ')'
}

type TokenOpenBucket = {
    type: 'OPEN_BUCKET'
    value: '\\'
}

type TokenCloseBucket = {
    type: 'CLOSE_BUCKET'
    value: '/'
}

type TokenOpenBrackets = {
    type: 'OPEN_BRACKETS'
    value: '['
}

type TokenCloseBrackets = {
    type: 'CLOSE_BRACKETS'
    value: ']'
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

type TokenWhile = {
    type: 'WHILE'
    value: '~'
}

type TokenDo = {
    type: 'DO',
    value: '@'
}

type TokenIf = {
    type: 'IF'
    value: 'if'
}

type TokenElse = {
    type: 'ELSE'
    value: 'else'
}

type TokenScan = {
    type: 'SCAN'
    value: 'scan'
}

type TokenComparison = {
    type: 'COMPARISON'
    value: '==' | '>' | '<'
}

type TokenMain = {
    type: 'MAIN'
    value: 'main'
}

type TokenComma = {
    type: 'COMMA'
    value: ','
}

type TokenReturn = {
    type: 'RETURN'
    value: 'return'
}