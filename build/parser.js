"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("./tokenizer");
var node_1 = require("./node");
var Parser = /** @class */ (function () {
    function Parser() {
    }
    /** Recebe o código fonte como argumento, inicializa um objeto
     * tokenizador e retorna o nó raiz de parseExpression().
     * Esse método será chamado pelo main()
     */
    Parser.run = function (code) {
        Parser.tokens = new tokenizer_1.Tokenizer(code);
        if (process.env.PARSE_ALL) {
            Parser.tokens.parseAll();
        }
        var res = Parser.parseBlock();
        if (Parser.tokens.actual.type !== 'EOF') {
            throw new Error('Finished chain without EOF token');
        }
        return res;
    };
    /** Consome operadores unários e parênteses */
    Parser.parseFactor = function () {
        var node;
        var token = Parser.tokens.actual;
        var result;
        if (token.type === 'PLUS'
            || token.type === 'MINUS'
            || token.type === 'OPEN_PAR'
            || token.type === 'INT'
            || token.type === 'IDENTIFIER'
            || token.type === 'SCAN') {
            if (token.type === 'INT') {
                node = new node_1.IntVal(token.value);
                Parser.tokens.selectNext();
                return node;
            }
            if (token.type === 'IDENTIFIER') {
                node = new node_1.Identifier(token.value);
                Parser.tokens.selectNext();
                return node;
            }
            if (token.type === 'SCAN') {
                token = Parser.tokens.selectNext();
                if (token.type === 'OPEN_PAR') {
                    token = Parser.tokens.selectNext();
                    if (token.type === 'CLOSE_PAR') {
                        token = Parser.tokens.selectNext();
                        node = new node_1.Scan();
                        return node;
                    }
                    else {
                        throw new Error('Expected CLOSE_PAR after scan(');
                    }
                }
                else {
                    throw new Error('Expected OPEN_PAR after scan');
                }
            }
            if (token.type === 'PLUS') {
                Parser.tokens.selectNext();
                node = new node_1.UnOp('+', [Parser.parseFactor()]);
                return node;
            }
            if (token.type === 'MINUS') {
                Parser.tokens.selectNext();
                node = new node_1.UnOp('-', [Parser.parseFactor()]);
                return node;
            }
            if (token.type === 'OPEN_PAR') {
                Parser.tokens.selectNext();
                result = Parser.parseExpression();
                if (Parser.tokens.actual.type === 'CLOSE_PAR') {
                    Parser.tokens.selectNext();
                    return result;
                }
                else {
                    throw new Error('Expected CLOSE_PAR after OPEN_PAR');
                }
            }
        }
        else {
            throw new Error("Invalid token " + Parser.tokens.actual.type + " at parseFactor");
        }
        return new node_1.NoOp();
    };
    /** Consome os termos */
    Parser.parseTerm = function () {
        var result = Parser.parseFactor();
        while (Parser.tokens.actual.type === 'MULTIPLY'
            || Parser.tokens.actual.type === 'DIVISION'
            || Parser.tokens.actual.type === 'AND') {
            var token = Parser.tokens.actual;
            switch (token.type) {
                case 'MULTIPLY':
                    Parser.tokens.selectNext();
                    result = new node_1.BinOp('*', [result]);
                    result.children.push(Parser.parseFactor());
                    break;
                case 'DIVISION':
                    Parser.tokens.selectNext();
                    result = new node_1.BinOp('/', [result]);
                    result.children.push(Parser.parseFactor());
                    break;
                case 'AND':
                    Parser.tokens.selectNext();
                    result = new node_1.BinOp('&&', [result]);
                    result.children.push(Parser.parseTerm());
                    break;
            }
        }
        return result;
    };
    /** Consome os tokens to Tokenizer e analisa se a sintaxe está
     * aderente à gramática proposta.
     * Retorna o resultado da expressão analisada
     */
    Parser.parseExpression = function () {
        var result = Parser.parseTerm();
        while (Parser.tokens.actual.type === 'PLUS'
            || Parser.tokens.actual.type === 'MINUS'
            || Parser.tokens.actual.type === 'OR') {
            var token = Parser.tokens.actual;
            switch (token.type) {
                case 'MINUS':
                    Parser.tokens.selectNext();
                    result = new node_1.BinOp('-', [result]);
                    result.children.push(Parser.parseTerm());
                    break;
                case 'PLUS':
                    Parser.tokens.selectNext();
                    result = new node_1.BinOp('+', [result]);
                    result.children.push(Parser.parseTerm());
                    break;
                case 'OR':
                    Parser.tokens.selectNext();
                    result = new node_1.BinOp('||', [result]);
                    result.children.push(Parser.parseTerm());
                    break;
            }
        }
        return result;
    };
    Parser.parseRelExpression = function () {
        var result = Parser.parseExpression();
        var token = Parser.tokens.actual;
        if (token.type === 'COMPARISON') {
            result = new node_1.BinOp(token.value, [result]);
            token = Parser.tokens.selectNext();
            result.children.push(Parser.parseExpression());
        }
        return result;
    };
    Parser.parseStatement = function () {
        var result = new node_1.NoOp();
        var token = Parser.tokens.actual;
        if (token.type === 'IF') {
            result = new node_1.If();
            token = Parser.tokens.selectNext();
            if (token.type === 'OPEN_PAR') {
                Parser.tokens.selectNext();
                result.children.push(Parser.parseRelExpression());
                if (Parser.tokens.actual.type === 'CLOSE_PAR') {
                    token = Parser.tokens.selectNext();
                    result.children.push(Parser.parseStatement());
                    token = Parser.tokens.actual;
                    if (token.type === 'ELSE') {
                        token = Parser.tokens.selectNext();
                        result.children.push(Parser.parseStatement());
                    }
                    return result;
                }
                else {
                    throw new Error('Expected CLOSE_PAR after IF condition');
                }
            }
            else {
                throw new Error('Expected OPEN_PAR after IF');
            }
        }
        else if (token.type === 'IDENTIFIER') {
            result = new node_1.Assignment([Parser.parseExpression()]);
            if (Parser.tokens.actual.type === 'ASSIGNMENT') {
                Parser.tokens.selectNext();
                result.children.push(Parser.parseExpression());
                token = Parser.tokens.actual;
                if (token.type === 'SEMICOLON') {
                    Parser.tokens.selectNext();
                    return result;
                }
                else {
                    throw new Error('Expected SEMICOLON token after Expression');
                }
            }
            else {
                throw new Error("Expected ASSIGNMENT token after IDENTIFIER " + token.value);
            }
        }
        else if (token.type === 'WHILE') {
            token = Parser.tokens.selectNext();
            result = new node_1.While();
            if (token.type === 'OPEN_PAR') {
                Parser.tokens.selectNext();
                result.children.push(Parser.parseRelExpression());
                if (Parser.tokens.actual.type === 'CLOSE_PAR') {
                    token = Parser.tokens.selectNext();
                    result.children.push(Parser.parseStatement());
                    return result;
                }
                else {
                    throw new Error('Expected CLOSE_PAR after WHILE condition');
                }
            }
            else {
                throw new Error('Expected OPEN_PAR after WHILE');
            }
        }
        else if (token.type === 'PRINT') {
            token = Parser.tokens.selectNext();
            if (token.type === 'OPEN_PAR') {
                token = Parser.tokens.selectNext();
                result = new node_1.Print([Parser.parseExpression()]);
                if (Parser.tokens.actual.type === 'CLOSE_PAR') {
                    token = Parser.tokens.selectNext();
                    if (token.type === 'SEMICOLON') {
                        Parser.tokens.selectNext();
                    }
                    else {
                        throw new Error('Expected SEMICOLON token after PRINT');
                    }
                }
                else {
                    throw new Error("Expected CLOSE_PAR after PRINT, found " + token.type);
                }
            }
            else {
                throw new Error('Expected OPEN_PAR after PRINT');
            }
            return result;
        }
        else if (token.type === 'SEMICOLON') {
            token = Parser.tokens.selectNext();
        }
        else {
            return Parser.parseBlock();
        }
        return result;
    };
    /** Parseia um bloco de código delimitado pelos tokens { e } */
    Parser.parseBlock = function () {
        if (Parser.tokens.actual.type === 'OPEN_BRACKETS') {
            var result = new node_1.Statements();
            var token = Parser.tokens.selectNext();
            while (token.type !== 'CLOSE_BRACKETS') {
                result.children.push(Parser.parseStatement());
                token = Parser.tokens.actual;
            }
            Parser.tokens.selectNext();
            return result;
        }
        else {
            throw new Error('Expected OPEN_BRACKETS at parseBlock');
        }
    };
    return Parser;
}());
exports.Parser = Parser;
