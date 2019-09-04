import { Tokenizer } from './tokenizer'
import { IntVal, Node, UnOp, BinOp, NoOp } from './node';

export class Parser {
    static tokens: Tokenizer

    /** Consome operadores unários e parênteses */
    static parseFactor = (): Node => {
        let node: Node
        let token = Parser.tokens.actual
        let result: Node

        if (token.type === 'PLUS'
            || token.type === 'MINUS'
            || token.type === 'OPEN_PAR'
            || token.type === 'INT'
        ) {
            if (token.type === 'INT') {
                node = new IntVal(token.value as number)
                Parser.tokens.selectNext()
                return node
            }

            if (token.type === 'PLUS') {
                Parser.tokens.selectNext()
                node = new UnOp('+', [Parser.parseFactor()])
                return node
            }

            if (token.type === 'MINUS') {
                Parser.tokens.selectNext()
                node = new UnOp('-', [Parser.parseFactor()])
                return node
            }

            if (token.type === 'OPEN_PAR') {
                Parser.tokens.selectNext()
                result = Parser.parseExpression()
                if (Parser.tokens.actual!.type === 'CLOSE_PAR') {
                    Parser.tokens.selectNext()
                    return result
                } else {
                    throw new Error('Expected CLOSE_PAR after OPEN_PAR')
                }
            }
        } else {
            throw new Error(`Invalid token ${Parser.tokens.actual.type} at parseFactor`)
        }
        return new NoOp()
    }
    
    /** Consome os termos */
    static parseTerm = (): Node => {
        let result = Parser.parseFactor()
        while (Parser.tokens.actual.type === 'MULTIPLY' 
        || Parser.tokens.actual.type === 'DIVISION') {
            let token = Parser.tokens.actual
            switch (token.type) {
                case 'MULTIPLY':
                    Parser.tokens.selectNext()
                    result = new BinOp('*', [result])
                    result.children.push(Parser.parseFactor())
                    break
                case 'DIVISION':
                    Parser.tokens.selectNext()
                    result = new BinOp('/', [result])
                    result.children.push(Parser.parseFactor())
                    break
            }
        }
        return result
    }

    /** Consome os tokens to Tokenizer e analisa se a sintaxe está
     * aderente à gramática proposta.
     * Retorna o resultado da expressão analisada
     */
    static parseExpression = (): Node => {
        let node: Node
        let result = Parser.parseTerm()
        while (Parser.tokens.actual.type === 'PLUS' 
        || Parser.tokens.actual.type === 'MINUS') {
            let token = Parser.tokens.actual
            switch (token.type) {
                case 'MINUS':
                    Parser.tokens.selectNext()
                    result = new BinOp('-', [result])
                    result.children.push(Parser.parseTerm())
                    break
                case 'PLUS':
                    Parser.tokens.selectNext()
                    result = new BinOp('+', [result]) 
                    result.children.push(Parser.parseTerm())
                    break
            }
        }
        return result
    }

    /** Recebe o código fonte como argumento, inicializa um objeto
     * tokenizador e retorna o nó raiz de parseExpression().
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