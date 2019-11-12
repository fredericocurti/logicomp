import { Tokenizer } from './tokenizer'
import { IntVal, Node, UnOp, BinOp, NoOp, Identifier, Assignment, Print, Statements, Scan, If, While, Declaration, BoolVal, FunctionDeclaration, print, FunctionCall } from './node';

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
            || token.type === 'SCAN'
            || token.type === 'TRUE'
            || token.type === 'FALSE'
        ) {
            if (token.type === 'INT') {
                node = new IntVal(token.value as number)
                Parser.tokens.selectNext()
                return node
            }

            if (token.type === 'FALSE') {
                node = new BoolVal(false)
                Parser.tokens.selectNext()
                return node
            }

            if (token.type === 'TRUE') {
                node = new BoolVal(true)
                Parser.tokens.selectNext()
                return node
            }

            if (token.type === 'IDENTIFIER') {
                node = new Identifier(token.value as string)
                token = Parser.tokens.selectNext()

                /** Is a function call */ 
                if (token.type === 'OPEN_PAR') {
                    Parser.tokens.selectNext()
                    node = new FunctionCall(node.value as string)
                    while (Parser.tokens.actual.type !== 'CLOSE_PAR') {
                        node.children.push(Parser.parseRelExpression())
                    
                        token = Parser.tokens.actual

                        if (token.type !== 'COMMA' && token.type !== 'CLOSE_PAR') {
                            throw new Error(`Expected COMMA between arguments, found ${token.type}`)
                        }
            
                        if (token.type === 'COMMA') {
                            token = Parser.tokens.selectNext()
                        }
                    }
                    Parser.tokens.selectNext()
                }
                return node
            }

            if (token.type === 'SCAN') {
                token = Parser.tokens.selectNext()
                if (token.type === 'OPEN_PAR') {
                    token = Parser.tokens.selectNext()
                    if (token.type === 'CLOSE_PAR') {
                        token = Parser.tokens.selectNext()
                        node = new Scan()
                        return node
                    } else {
                        throw new Error('Expected CLOSE_PAR after scan(')    
                    }
                } else {
                    throw new Error('Expected OPEN_PAR after scan')
                }
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
        || Parser.tokens.actual.type === 'DIVISION'
        || Parser.tokens.actual.type === 'AND') {
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
                case 'AND':
                    Parser.tokens.selectNext()
                    result = new BinOp('&&', [result])
                    result.children.push(Parser.parseTerm())
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
        let result = Parser.parseTerm()
        while (Parser.tokens.actual.type === 'PLUS' 
        || Parser.tokens.actual.type === 'MINUS'
        || Parser.tokens.actual.type === 'OR') {
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
                case 'OR':
                    Parser.tokens.selectNext()
                    result = new BinOp('||', [result]) 
                    result.children.push(Parser.parseTerm())
                    break
            }
        }
        return result
    }

    static parseRelExpression = (): Node => {
        let result = Parser.parseExpression()
        let token = Parser.tokens.actual
        if (token.type === 'COMPARISON') {
            result = new BinOp(token.value as '==' | '>' | '<', [result])
            token = Parser.tokens.selectNext()
            result.children.push(Parser.parseExpression())
        }
        return result
    }


    static parseStatement = (): Node => {
        let result = new NoOp()
        let token = Parser.tokens.actual
        if (token.type === 'IF') {
            result = new If()
            token = Parser.tokens.selectNext()
            if (token.type === 'OPEN_PAR') {
                Parser.tokens.selectNext()
                result.children.push(Parser.parseRelExpression())
                if (Parser.tokens.actual.type === 'CLOSE_PAR') {
                    token = Parser.tokens.selectNext()
                    result.children.push(Parser.parseStatement())
                    token = Parser.tokens.actual
                    if (token.type === 'ELSE') {
                        token = Parser.tokens.selectNext()
                        result.children.push(Parser.parseStatement())
                    }
                    return result
                } else {
                    throw new Error('Expected CLOSE_PAR after IF condition')
                }

            } else {
                throw new Error('Expected OPEN_PAR after IF')
            }
        } else if (token.type === 'IDENTIFIER') {
            result = new Assignment([Parser.parseRelExpression()])
            if (Parser.tokens.actual.type === 'ASSIGNMENT') {
                Parser.tokens.selectNext()
                result.children.push(Parser.parseRelExpression())
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
        } else if (token.type === 'WHILE') {
            token = Parser.tokens.selectNext()
            result = new While();
            if (token.type === 'OPEN_PAR') {
                Parser.tokens.selectNext()
                result.children.push(Parser.parseRelExpression())
                if (Parser.tokens.actual.type === 'CLOSE_PAR') {
                    token = Parser.tokens.selectNext()
                    result.children.push(Parser.parseStatement())
                    return result
                } else {
                    throw new Error('Expected CLOSE_PAR after WHILE condition')
                }

            } else {
                throw new Error('Expected OPEN_PAR after WHILE')
            }
        } else if (token.type === 'PRINT') {
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
        } else if (token.type === 'INT') {
            token = Parser.tokens.selectNext()
            result = new Declaration('int')
            if (token.type === 'IDENTIFIER') {
                result.children.push(new Identifier(token.value as string))
                token = Parser.tokens.selectNext()
                if (token.type === 'SEMICOLON') {
                    Parser.tokens.selectNext()
                    return result
                }  else {
                    throw new Error(`Expected SEMICOLON after IDENTIFIER, found ${token.type}`)    
                }
            } else {
                throw new Error(`Expected IDENTIFIER after DECLARATION(INT), found ${token.type}`)
            }
        } else if (token.type === 'BOOL') {
            token = Parser.tokens.selectNext()
            result = new Declaration('bool')
            if (token.type === 'IDENTIFIER') {
                result.children.push(new Identifier(token.value as string))
                token = Parser.tokens.selectNext()
                if (token.type === 'SEMICOLON') {
                    Parser.tokens.selectNext()
                    return result
                }  else {
                    throw new Error(`Expected SEMICOLON after IDENTIFIER, found ${token.type}`)    
                }
            } else {
                throw new Error(`Expected IDENTIFIER after DECLARATION(BOOL), found ${token.type}`)
            }
        } else if (token.type === 'RETURN') {
            token = Parser.tokens.selectNext()
            if (token.type === 'OPEN_PAR') {
                token = Parser.tokens.selectNext()

                result = Parser.parseRelExpression()
                token = Parser.tokens.actual
                if (token.type !== 'CLOSE_PAR') {
                    throw new Error(`Expected CLOSE_PAR at end of RETURN, found ${token.type} ${token.value}`)
                }
                token = Parser.tokens.selectNext()
                if (token.type === 'SEMICOLON') {
                    Parser.tokens.selectNext()
                }  else {
                    throw new Error(`Expected SEMICOLON after RETURN statement, found ${token.type}`)    
                }
            } else {
                throw new Error(`Expected OPEN_PAR after RETURN, found ${token.type}`)
            }
        } else if (token.type === 'SEMICOLON') {
            token = Parser.tokens.selectNext()    
        } else {
            return Parser.parseBlock()
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
            throw new Error('Expected OPEN_BRACKETS at parseBlock')
        }
    }
    
    static parseFunction = (): Node | null => {
        let fnDeclaration = new FunctionDeclaration()
        let token = Parser.tokens.actual

        if (token.type === 'EOF') return null

        if (token.type !== 'INT') {
            throw new Error(`Expected token INT at start of function declaration, found ${token.type}`)
        }
        token = Parser.tokens.selectNext()
        fnDeclaration.children.push(new Identifier(token.value as string)) // function name
        if (token.type !== 'IDENTIFIER') {
            throw new Error(`Expected token IDENTIFIER as function declaration name, found ${token.type}`)
        }

        token = Parser.tokens.selectNext()
        if (token.type !== 'OPEN_PAR') {
            throw new Error(`Expected token OPEN_PAR before function parameters, found ${token.type}`)
        }

        token = Parser.tokens.selectNext()
        /** keep parsing function parameters, if any, before a CLOSE_PAR */
        while (token.type !== 'CLOSE_PAR') {
            let parameter = new Declaration(token.value as 'bool' | 'int')
            token = Parser.tokens.selectNext()
            if (token.type !== 'IDENTIFIER') {
                throw new Error(`Expected IDENTIFIER after DECLARATION as function parameter, found ${token.type}`)
            }

            parameter.children.push(new Identifier(token.value as string))
            token = Parser.tokens.selectNext()

            if (token.type !== 'COMMA' && token.type !== 'CLOSE_PAR') {
                throw new Error(`Expected COMMA between parameters, found ${token.type}`)
            }

            if (token.type === 'COMMA') {
                token = Parser.tokens.selectNext()
            }

            fnDeclaration.children.push(parameter)
        }

        
        Parser.tokens.selectNext() // consumes )
        fnDeclaration.children.push(Parser.parseBlock())

        return fnDeclaration
    }

    static parseProgram = (): Node => {
        let program = new Statements()
        let fn = Parser.parseFunction();
        while (fn) {
            program.children.push(fn)
            fn = Parser.parseFunction();
        }
        program.children.push(new FunctionCall('main'))
        return program
    }
    
    /** Recebe o código fonte como argumento, inicializa um objeto
     * tokenizador e retorna o nó raiz de parseExpression().
     * Esse método será chamado pelo main()
     */
    static run(code: string) {
        Parser.tokens = new Tokenizer(code)

        if (process.env.PARSE_ALL) {
            Parser.tokens.parseAll()
            return new NoOp()
        }
        
        let res = Parser.parseProgram()
        // print(res)
        if (Parser.tokens.actual.type !== 'EOF') {
            throw new Error('Finished chain without EOF token')
        }

        print(res)

        return res
    }
}