import { Tokenizer } from './tokenizer'

export class Parser {
    constructor() {

    }

    static tokens: Tokenizer
    /** Consome os tokens to Tokenizer e analisa se a sintaxe está
     * aderente à gramática proposta.
     * Retorna o resultado da expressão analisada
     */
    static parseExpression = () => {
        let token = Parser.tokens.selectNext()
        while (token.type !== 'EOF') {
            console.log(token)
            token = Parser.tokens.selectNext()
        }
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