"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var Tokenizer = /** @class */ (function () {
    function Tokenizer(origin) {
        this.origin = origin;
        this.position = 0;
        this.actual = null;
        if (this.origin.split('').filter(function (c) { return c !== '\n'; }).length === 0) {
            throw new Error("Couldn't find any valid tokens with input: " + origin);
        }
    }
    /** Lê o próximo token e atualiza o atributo actual */
    Tokenizer.prototype.selectNext = function () {
        var char = null;
        var nextChar = null;
        var number = '';
        while (this.position < this.origin.length) {
            char = this.origin[this.position];
            nextChar = this.origin[this.position + 1];
            this.position++;
            // Skip whitespace or newline character
            if (char === ' ' || char === '\n') {
                continue;
            }
            // Stack number
            if (char && char.match(/[0-9]/)) {
                number += char;
                if (nextChar === undefined || !nextChar.match(/[0-9]/)) {
                    this.actual = new token_1.Token('INT', parseInt(number));
                    return this.actual;
                }
                continue;
            }
            // Operators
            if (char === '+') {
                this.actual = new token_1.Token('PLUS', '+');
                return this.actual;
            }
            if (char === '-') {
                this.actual = new token_1.Token('MINUS', '-');
                return this.actual;
            }
            if (char === '*') {
                this.actual = new token_1.Token('MULTIPLY', '*');
                return this.actual;
            }
            if (char === '/') {
                this.actual = new token_1.Token('DIVISION', '/');
                return this.actual;
            }
            throw new Error("Unhandled character " + char + " at position " + (this.position - 1));
        }
        this.actual = new token_1.Token('EOF', null);
        return this.actual;
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
