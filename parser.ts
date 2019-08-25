import { Tokenizer } from './tokenizer'
import { Token } from './token';

export class Parser {
    static tokens: Tokenizer

    /** Consome os termos */
    static parseTerm = (): number => {
        let op = null
        let result = 0
        Parser.tokens.selectNext()
        
        while (Parser.tokens.actual 
            && (Parser.tokens.actual.type === 'MULTIPLY' 
            || Parser.tokens.actual.type === 'DIVISION'
            || Parser.tokens.actual.type === 'INT')
        ) {
            let token = Parser.tokens.actual
            // console.log('Parse term', token)
            switch(token.type) {
                case 'MULTIPLY':
                    op = token.value as string
                    // Parser.tokens.selectNext()
                    break
                case 'DIVISION':
                    op = token.value as string
                    // Parser.tokens.selectNext()
                    break
                case 'INT':
                    if (op === '*') {
                        result *= token.value as number
                    } else if (op === '/') {
                        result /= token.value as number
                    } else {
                        result = token.value as number
                    }
                    break
            }
            Parser.tokens.selectNext()
        }
        return result
    }

    /** Consome os tokens to Tokenizer e analisa se a sintaxe está
     * aderente à gramática proposta.
     * Retorna o resultado da expressão analisada
     */
    static parseExpression = ():number => {
        let result = Parser.parseTerm()
        let op = '+'
        while (Parser.tokens.actual && Parser.tokens.actual.type !== 'EOF') {
            let token = Parser.tokens.actual
            switch (token.type) {
                case 'MINUS':
                    result -= Parser.parseTerm()
                    break
                case 'PLUS':
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
        return Parser.parseExpression()
    }
}