import { Tokenizer } from './tokenizer'

export class Parser {
    static tokens: Tokenizer

    /** Consome os tokens to Tokenizer e analisa se a sintaxe está
     * aderente à gramática proposta.
     * Retorna o resultado da expressão analisada
     */
    static parseExpression = ():number => {
        let token = Parser.tokens.selectNext()
        let result = 0;
        let op = '+';
        while (token.type !== 'EOF') {
            console.log(token)
            switch (token.type) {
                case 'MULTIPLY':
                    op = token.value as string
                    break
                case 'DIVISION':
                    op = token.value as string
                    break
                case 'MINUS':
                    op = token.value as string
                    break
                case 'PLUS':
                    op = token.value as string
                    break
                case 'INT':
                    if (op === '+') {
                        result += token.value as number
                    }
                    if (op === '-') {
                        result -= token.value as number 
                    }
                    if (op === '*') {
                        result *= token.value as number
                    }
                    if (op === '/') {
                        result /= token.value as number
                    }
                    break
            }
            token = Parser.tokens.selectNext()
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