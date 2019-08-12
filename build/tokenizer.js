"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var Tokenizer = /** @class */ (function () {
    function Tokenizer(origin) {
        this.origin = origin;
        this.position = 0;
        this.actual = null;
    }
    /** Lê o próximo token e atualiza o atributo actual */
    Tokenizer.prototype.selectNext = function () {
        var char = null;
        var token = new token_1.Token('EOF', null);
        var number = '';
        while (this.position < this.origin.length) {
            char = this.origin[this.position];
            this.position++;
            if (char === ' ') {
                if (number.length > 0) {
                    return new token_1.Token('INT', parseInt(number));
                }
            }
            else if (char === '+') {
                return new token_1.Token('PLUS', '+');
            }
            else if (char === '-') {
                return new token_1.Token('MINUS', '-');
            }
            else if (parseInt(char)) {
                number += char;
                continue;
            }
            else {
                throw new Error("Invalid character " + char + " at position " + (this.position - 1));
            }
        }
        if (number.length > 0) {
            return new token_1.Token('INT', parseInt(number));
        }
        return token;
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
