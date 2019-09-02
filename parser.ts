import { Tokenizer } from './tokenizer'

export class Parser {
    static tokens: Tokenizer

    /** Consome operadores unários e parênteses */
    static parseFactor = (): number => {
        let token = Parser.tokens.actual
        let result = 0

        if (token.type === 'PLUS'
            || token.type === 'MINUS'
            || token.type === 'OPEN_PAR'
            || token.type === 'INT'
        ) {
            if (token.type === 'INT') {
                result = token.value as number
                Parser.tokens.selectNext()
            }

            if (token.type === 'PLUS') {
                Parser.tokens.selectNext()
                return Parser.parseFactor()
            }

            if (token.type === 'MINUS') {
                Parser.tokens.selectNext()
                return -1 * Parser.parseFactor()
            }

            if (token.type === 'OPEN_PAR') {
                Parser.tokens.selectNext()
                result = Parser.parseExpression()
                if (Parser.tokens.actual!.type === 'CLOSE_PAR') {
                    Parser.tokens.selectNext()
                } else {
                    throw new Error('Expected CLOSE_PAR after OPEN_PAR')
                }
            }
        } else {
            throw new Error(`Invalid token ${Parser.tokens.actual.type} at parseFactor`)
        }
        
        return result
    }
    
    /** Consome os termos */
    static parseTerm = (): number => {
        let result = Parser.parseFactor()
        
        while (Parser.tokens.actual.type === 'MULTIPLY' 
        || Parser.tokens.actual.type === 'DIVISION') {
            let token = Parser.tokens.actual
            switch (token.type) {
                case 'MULTIPLY':
                    Parser.tokens.selectNext()
                    result *= Parser.parseFactor()
                    break
                case 'DIVISION':
                    Parser.tokens.selectNext()
                    result /= Parser.parseFactor()
                    break
            }
        }
        return result
    }

    /** Consome os tokens to Tokenizer e analisa se a sintaxe está
     * aderente à gramática proposta.
     * Retorna o resultado da expressão analisada
     */
    static parseExpression = ():number => {
        let result = Parser.parseTerm()
        while (Parser.tokens.actual.type === 'PLUS' 
        || Parser.tokens.actual.type === 'MINUS') {
            let token = Parser.tokens.actual
            switch (token.type) {
                case 'MINUS':
                    Parser.tokens.selectNext()
                    result -= Parser.parseTerm()
                    break
                case 'PLUS':
                    Parser.tokens.selectNext()
                    result += Parser.parseTerm()
                    break
            }
        }

        return result
    }

    /** Recebe o código fonte como argumento, inicializa um objeto
     * tokenizador e retorna o resultado do parseExpression().
     * Esse método será chamado pelo main()
     */
    static run(code: string) {
        Parser.tokens = new Tokenizer(code)
        let res = Parser.parseExpression()
        if (Parser.tokens.actual.type !== 'EOF') {
            throw new Error('Finished chain without EOF token')
        }
        return res
    }
}