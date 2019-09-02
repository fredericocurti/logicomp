"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizer_1 = require("./tokenizer");
var Parser = /** @class */ (function () {
    function Parser() {
    }
    /** Recebe o código fonte como argumento, inicializa um objeto
     * tokenizador e retorna o resultado do parseExpression().
     * Esse método será chamado pelo main()
     */
    Parser.run = function (code) {
        Parser.tokens = new tokenizer_1.Tokenizer(code);
        return Parser.parseExpression();
    };
    /** Consome os termos */
    Parser.parseTerm = function () {
        var op = null;
        var result = 0;
        Parser.tokens.selectNext();
        while (Parser.tokens.actual
            && (Parser.tokens.actual.type === 'MULTIPLY'
                || Parser.tokens.actual.type === 'DIVISION'
                || Parser.tokens.actual.type === 'INT')) {
            var token = Parser.tokens.actual;
            // console.log('Parse term', token)
            switch (token.type) {
                case 'MULTIPLY':
                    op = token.value;
                    token = Parser.tokens.selectNext();
                    if (token.type === 'EOF') {
                        throw new Error("Unexpected EOF after * token");
                    }
                    break;
                case 'DIVISION':
                    op = token.value;
                    token = Parser.tokens.selectNext();
                    if (token.type === 'EOF') {
                        throw new Error("Unexpected EOF after / token");
                    }
                    break;
                case 'INT':
                    if (op === '*') {
                        result *= token.value;
                    }
                    else if (op === '/') {
                        result /= token.value;
                    }
                    else {
                        result = token.value;
                    }
                    Parser.tokens.selectNext();
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
        var op = '+';
        while (Parser.tokens.actual && Parser.tokens.actual.type !== 'EOF') {
            var token = Parser.tokens.actual;
            switch (token.type) {
                case 'MINUS':
                    result -= Parser.parseTerm();
                    break;
                case 'PLUS':
                    result += Parser.parseTerm();
                    break;
            }
        }
        return result;
    };
    return Parser;
}());
exports.Parser = Parser;
