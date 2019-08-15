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
    /** Consome os tokens to Tokenizer e analisa se a sintaxe está
     * aderente à gramática proposta.
     * Retorna o resultado da expressão analisada
     */
    Parser.parseExpression = function () {
        var token = Parser.tokens.selectNext();
        var result = 0;
        var op = '+';
        while (token.type !== 'EOF') {
            console.log(token);
            switch (token.type) {
                case 'MULTIPLY':
                    op = token.value;
                    break;
                case 'DIVISION':
                    op = token.value;
                    break;
                case 'MINUS':
                    op = token.value;
                    break;
                case 'PLUS':
                    op = token.value;
                    break;
                case 'INT':
                    if (op === '+') {
                        result += token.value;
                    }
                    if (op === '-') {
                        result -= token.value;
                    }
                    if (op === '*') {
                        result *= token.value;
                    }
                    if (op === '/') {
                        result /= token.value;
                    }
                    break;
            }
            token = Parser.tokens.selectNext();
        }
        return result;
    };
    return Parser;
}());
exports.Parser = Parser;
