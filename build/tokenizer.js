"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var Tokenizer = /** @class */ (function () {
    function Tokenizer(origin) {
        this.reservedKeywords = ['print', 'if', 'while', 'else'];
        this.origin = origin;
        this.position = 0;
        this.actual = this.selectNext();
    }
    /** Lê o próximo token e atualiza o atributo actual */
    Tokenizer.prototype.selectNext = function () {
        var _this = this;
        var getNext = function () {
            var char = null;
            var nextChar = null;
            var number = '';
            var str = '';
            while (_this.position < _this.origin.length) {
                char = _this.origin[_this.position];
                nextChar = _this.origin[_this.position + 1];
                _this.position++;
                // Skip whitespace or newline character
                if (char === ' ' || char === '\n') {
                    continue;
                }
                // Stack number
                if (char && char.match(/[0-9]/)) {
                    number += char;
                    if (nextChar === undefined || !nextChar.match(/[0-9]/)) {
                        _this.actual = new token_1.Token('INT', parseInt(number));
                        return _this.actual;
                    }
                    continue;
                }
                // Stack identifier
                if (char && char.match(/[a-z0-9]/i)) {
                    str += char;
                    if (nextChar === undefined || !nextChar.match(/[a-z0-9]/i)) {
                        // @ts-ignore
                        if (_this.reservedKeywords.includes(str)) {
                            _this.actual = new token_1.Token(str.toUpperCase(), str);
                        }
                        else {
                            _this.actual = new token_1.Token('IDENTIFIER', str);
                        }
                        return _this.actual;
                    }
                    continue;
                }
                if (char === '=' && nextChar === '=') {
                    _this.actual = new token_1.Token('COMPARISON', '==');
                    _this.position++;
                    return _this.actual;
                }
                if (char === '=') {
                    _this.actual = new token_1.Token('ASSIGNMENT', '=');
                    return _this.actual;
                }
                if (char === '>') {
                    _this.actual = new token_1.Token('COMPARISON', '>');
                    return _this.actual;
                }
                if (char === '<') {
                    _this.actual = new token_1.Token('COMPARISON', '<');
                    return _this.actual;
                }
                if (char === '{') {
                    _this.actual = new token_1.Token('OPEN_BRACKETS', '{');
                    return _this.actual;
                }
                if (char === '}') {
                    _this.actual = new token_1.Token('CLOSE_BRACKETS', '}');
                    return _this.actual;
                }
                if (char === ';') {
                    _this.actual = new token_1.Token('SEMICOLON', ';');
                    return _this.actual;
                }
                // Parenthesis
                if (char === '(') {
                    _this.actual = new token_1.Token('OPEN_PAR', '(');
                    return _this.actual;
                }
                if (char === ')') {
                    _this.actual = new token_1.Token('CLOSE_PAR', ')');
                    return _this.actual;
                }
                // Operators
                if (char === '+') {
                    _this.actual = new token_1.Token('PLUS', '+');
                    return _this.actual;
                }
                if (char === '-') {
                    _this.actual = new token_1.Token('MINUS', '-');
                    return _this.actual;
                }
                if (char === '*') {
                    _this.actual = new token_1.Token('MULTIPLY', '*');
                    return _this.actual;
                }
                if (char === '/') {
                    _this.actual = new token_1.Token('DIVISION', '/');
                    return _this.actual;
                }
                throw new Error("Unhandled character " + char + " at position " + (_this.position - 1));
            }
            _this.actual = new token_1.Token('EOF', null);
            return _this.actual;
        };
        var token = getNext();
        return token;
    };
    /** For debugging */
    Tokenizer.prototype.parseAll = function () {
        var token = this.selectNext();
        while (token.type !== 'EOF') {
            console.log(token);
            token = this.selectNext();
        }
    };
    return Tokenizer;
}());
exports.Tokenizer = Tokenizer;
