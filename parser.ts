import { Tokenizer } from './tokenizer'
import { IntVal, Node, UnOp, BinOp, NoOp, Identifier, Assignment, Print, Statements } from './node';

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
            || token.type === 'IDENTIFIER'
        ) {
            if (token.type === 'INT') {
                node = new IntVal(token.value as number)
                Parser.tokens.selectNext()
                return node
            }

            if (token.type === 'IDENTIFIER') {
                node = new Identifier(token.value as string)
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

    static parseStatement = (): Node => {
        let result = new NoOp()
        let token = Parser.tokens.actual
        if (token.type === 'IDENTIFIER') {
            result = new Assignment([Parser.parseExpression()])
            if (Parser.tokens.actual.type === 'ASSIGNMENT') {
                Parser.tokens.selectNext()
                result.children.push(Parser.parseExpression())
                token = Parser.tokens.actual
                if (token.type === 'SEMICOLON') {
                    Parser.tokens.selectNext()
                    return result
                } else {
                    throw new Error('Expected SEMICOLON token after Expression')
                }
            } else {
                throw new Error(`Expected ASSIGNMENT token after IDENTIFIER ${token.value}`)
            }
        }

        if (token.type === 'PRINT') {
            token = Parser.tokens.selectNext()
            if (token.type === 'OPEN_PAR') {
                token = Parser.tokens.selectNext()
                result = new Print([Parser.parseExpression()])
                if (Parser.tokens.actual.type === 'CLOSE_PAR') {
                    token = Parser.tokens.selectNext()
                    if (token.type === 'SEMICOLON') {
                        Parser.tokens.selectNext()
                    } else {
                        throw new Error('Expected SEMICOLON token after PRINT')
                    }
                } else {
                    throw new Error(`Expected CLOSE_PAR after PRINT, found ${token.type}`)
                }
            } else {
                throw new Error('Expected OPEN_PAR after PRINT')
            }
            return result
        }

        // Unsure
        if (token.type === 'SEMICOLON') {
            token = Parser.tokens.selectNext()
        }

        return result
    }

    /** Parseia um bloco de código delimitado pelos tokens { e } */
    static parseBlock = (): Node => {
        if (Parser.tokens.actual.type === 'OPEN_BRACKETS') {
            let result = new Statements()
            let token = Parser.tokens.selectNext()
            while (token.type !== 'CLOSE_BRACKETS') {
                result.children.push(Parser.parseStatement())
                token = Parser.tokens.actual
            }
            Parser.tokens.selectNext()
            return result
        } else {
            throw new Error('Expected OPEN_BRACKETS at beggining of file')
        }
    }
    
    /** Recebe o código fonte como argumento, inicializa um objeto
     * tokenizador e retorna o nó raiz de parseExpression().
     * Esse método será chamado pelo main()
     */
    static run(code: string) {
        Parser.tokens = new Tokenizer(code)
        Parser.tokens.parseAll()
        // let res = Parser.parseBlock()
        // if (Parser.tokens.actual.type !== 'EOF') {
        //     throw new Error('Finished chain without EOF token')
        // }
        // return res
    }
}