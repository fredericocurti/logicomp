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
        var res = Parser.parseExpression();
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
            || token.type === 'INT') {
            if (token.type === 'INT') {
                node = new node_1.IntVal(token.value);
                Parser.tokens.selectNext();
                return node;
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
            || Parser.tokens.actual.type === 'DIVISION') {
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
            }
        }
        return result;
    };
    /** Consome os tokens to Tokenizer e analisa se a sintaxe está
     * aderente à gramática proposta.
     * Retorna o resultado da expressão analisada
     */
    Parser.parseExpression = function () {
        var node;
        var result = Parser.parseTerm();
        while (Parser.tokens.actual.type === 'PLUS'
            || Parser.tokens.actual.type === 'MINUS') {
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
            }
        }
        return result;
    };
    return Parser;
}());
exports.Parser = Parser;
