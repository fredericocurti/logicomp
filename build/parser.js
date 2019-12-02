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
    Parser.run = function (code, filePath) {
        if (filePath === void 0) { filePath = null; }
        Parser.tokens = new tokenizer_1.Tokenizer(code);
        var program;
        if (process.env.PARSE_ALL) {
            Parser.tokens.parseAll();
            return new node_1.NoOp();
        }
        try {
            program = Parser.parseProgram();
        }
        catch (error) {
            var errorLine = Parser.tokens.origin.split('\n')[Parser.tokens.line - 1];
            console.log("\n\u001B[31mERROR: " + error.message + "\u001B[0m\n" + filePath + ":" + Parser.tokens.line + " " + errorLine);
            throw error;
        }
        if (Parser.tokens.actual.type !== 'EOF') {
            throw new Error('Finished chain without EOF token');
        }
        return program;
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
            || token.type === 'SCAN'
            || token.type === 'TRUE'
            || token.type === 'FALSE') {
            if (token.type === 'INT') {
                node = new node_1.IntVal(token.value);
                Parser.tokens.selectNext();
                return node;
            }
            if (token.type === 'FALSE') {
                node = new node_1.BoolVal(false);
                Parser.tokens.selectNext();
                return node;
            }
            if (token.type === 'TRUE') {
                node = new node_1.BoolVal(true);
                Parser.tokens.selectNext();
                return node;
            }
            if (token.type === 'IDENTIFIER') {
                node = new node_1.Identifier(token.value);
                token = Parser.tokens.selectNext();
                /** Is a function call */
                if (token.type === 'OPEN_BUCKET') {
                    Parser.tokens.selectNext();
                    node = new node_1.FunctionCall(node.value);
                    while (Parser.tokens.actual.type !== 'CLOSE_BUCKET') {
                        node.children.push(Parser.parseRelExpression());
                        token = Parser.tokens.actual;
                        if (token.type !== 'COMMA' && token.type !== 'CLOSE_BUCKET') {
                            throw new Error("Expected COMMA between arguments, found " + token.type);
                        }
                        if (token.type === 'COMMA') {
                            token = Parser.tokens.selectNext();
                        }
                    }
                    Parser.tokens.selectNext();
                }
                return node;
            }
            if (token.type === 'SCAN') {
                token = Parser.tokens.selectNext();
                node = new node_1.Scan();
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
            result.children.push(Parser.parseRelExpression());
            result.children.push(Parser.parseStatement());
            token = Parser.tokens.actual;
            if (token.type === 'ELSE') {
                token = Parser.tokens.selectNext();
                result.children.push(Parser.parseStatement());
            }
            return result;
        }
        else if (token.type === 'IDENTIFIER') {
            var relExp = Parser.parseRelExpression();
            result = new node_1.Assignment([relExp]);
            if (relExp.constructor.name === "FunctionCall") {
                result = relExp;
            }
            if (Parser.tokens.actual.type === 'ASSIGNMENT') {
                Parser.tokens.selectNext();
                result.children.push(Parser.parseRelExpression());
                token = Parser.tokens.actual;
                if (token.type === 'SEMICOLON') {
                    Parser.tokens.selectNext();
                    return result;
                }
                else {
                    throw new Error('Expected SEMICOLON token after Expression');
                }
            }
        }
        else if (token.type === 'DO') {
            token = Parser.tokens.selectNext();
            result = new node_1.While();
            result.children[1] = Parser.parseBlock();
            if (Parser.tokens.actual.type === 'WHILE') {
                Parser.tokens.selectNext();
                result.children[0] = Parser.parseRelExpression();
                return result;
            }
            else {
                throw new Error("Expected ~ before condtion at WHILE (@), found " + token.type);
            }
        }
        else if (token.type === 'PRINT') {
            token = Parser.tokens.selectNext();
            result = new node_1.Print([Parser.parseExpression()]);
            if (Parser.tokens.actual.type === 'SEMICOLON') {
                Parser.tokens.selectNext();
            }
            else {
                throw new Error('Expected SEMICOLON token after PRINT');
            }
            return result;
        }
        else if (token.type === 'INT') {
            token = Parser.tokens.selectNext();
            result = new node_1.Declaration('int');
            if (token.type === 'IDENTIFIER') {
                result.children.push(new node_1.Identifier(token.value));
                token = Parser.tokens.selectNext();
                if (token.type === 'SEMICOLON') {
                    Parser.tokens.selectNext();
                    return result;
                }
                else {
                    throw new Error("Expected SEMICOLON after IDENTIFIER, found " + token.type);
                }
            }
            else {
                throw new Error("Expected IDENTIFIER after DECLARATION(INT), found " + token.type);
            }
        }
        else if (token.type === 'BOOL') {
            token = Parser.tokens.selectNext();
            result = new node_1.Declaration('bool');
            if (token.type === 'IDENTIFIER') {
                result.children.push(new node_1.Identifier(token.value));
                token = Parser.tokens.selectNext();
                if (token.type === 'SEMICOLON') {
                    Parser.tokens.selectNext();
                    return result;
                }
                else {
                    throw new Error("Expected SEMICOLON after IDENTIFIER, found " + token.type);
                }
            }
            else {
                throw new Error("Expected IDENTIFIER after DECLARATION(BOOL), found " + token.type);
            }
        }
        else if (token.type === 'RETURN') {
            token = Parser.tokens.selectNext();
            result = new node_1.Return(Parser.parseRelExpression());
            if (Parser.tokens.actual.type === 'SEMICOLON') {
                Parser.tokens.selectNext();
            }
            else {
                throw new Error("Expected SEMICOLON after RETURN statement, found " + token.type);
            }
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
            throw new Error("Expected OPEN_BRACKETS at parseBlock, found " + Parser.tokens.actual.type);
        }
    };
    Parser.parseFunction = function () {
        var fnDeclaration = new node_1.FunctionDeclaration();
        if (Parser.tokens.actual.type === 'EOF')
            return null;
        if (Parser.tokens.actual.type !== 'FUNCTIONDECLARATION') {
            throw new Error("Expected token FUNCTIONDECLARATION(!) at start of function declaration, found " + Parser.tokens.actual.type);
        }
        Parser.tokens.selectNext();
        fnDeclaration.children.push(new node_1.Identifier(Parser.tokens.actual.value)); // function name
        // @ts-ignore
        if (Parser.tokens.actual.type !== 'IDENTIFIER') {
            throw new Error("Expected token IDENTIFIER as function declaration name, found " + Parser.tokens.actual.type);
        }
        Parser.tokens.selectNext();
        // @ts-ignore
        if (Parser.tokens.actual.type !== 'OPEN_BUCKET') {
            throw new Error("Expected token OPEN_BUCKET before function parameters, found " + Parser.tokens.actual.type);
        }
        Parser.tokens.selectNext();
        /** keep parsing function parameters, if any, before a CLOSE_PAR */
        // @ts-ignore
        while (Parser.tokens.actual.type !== 'CLOSE_BUCKET') {
            var parameter = new node_1.Declaration(Parser.tokens.actual.value);
            Parser.tokens.selectNext();
            // @ts-ignore
            if (Parser.tokens.actual.type !== 'IDENTIFIER') {
                throw new Error("Expected IDENTIFIER after DECLARATION as function parameter, found " + Parser.tokens.actual.type);
            }
            parameter.children.push(new node_1.Identifier(Parser.tokens.actual.value));
            Parser.tokens.selectNext();
            // @ts-ignore
            if (Parser.tokens.actual.type !== 'COMMA' && Parser.tokens.actual.type !== 'CLOSE_BUCKET') {
                throw new Error("Expected COMMA between parameters, found " + Parser.tokens.actual.type);
            }
            // @ts-ignore
            if (Parser.tokens.actual.type === 'COMMA') {
                Parser.tokens.selectNext();
            }
            fnDeclaration.children.push(parameter);
        }
        Parser.tokens.selectNext(); // consumes /
        // @ts-ignore
        if (Parser.tokens.actual.type !== 'RETURN') {
            throw new Error("Expected -> after CLOSE_BUCKET in function, found " + Parser.tokens.actual.type);
        }
        Parser.tokens.selectNext();
        // @ts-ignore
        if (Parser.tokens.actual.type !== 'INT') {
            throw new Error("Expected INT after RETURN arrow, found " + Parser.tokens.actual.type);
        }
        Parser.tokens.selectNext();
        fnDeclaration.children.push(Parser.parseBlock());
        return fnDeclaration;
    };
    Parser.parseProgram = function () {
        var program = new node_1.Statements();
        var fn = Parser.parseFunction();
        while (fn) {
            program.children.push(fn);
            fn = Parser.parseFunction();
        }
        program.children.push(new node_1.FunctionCall('main'));
        return program;
    };
    return Parser;
}());
exports.Parser = Parser;
