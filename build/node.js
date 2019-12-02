"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var symboltable_1 = require("./symboltable");
var globalSymbolTable = new symboltable_1.SymbolTable();
var currentSymbolTable = globalSymbolTable;
var util = require('util');
var readlineSync = require('readline-sync');
exports.print = function (arg) { return console.log(util.inspect(arg, { showHidden: false, depth: null }, true, true)); };
var Node = /** @class */ (function () {
    function Node() {
        Node.count += 1;
        this.evaluate = function () { return new NoOp(); };
        this.children = [];
        this.id = Node.count;
    }
    Node.count = 0;
    return Node;
}());
exports.Node = Node;
var BinOp = /** @class */ (function (_super) {
    __extends(BinOp, _super);
    function BinOp(value, children) {
        if (children === void 0) { children = []; }
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            var first = _this.children[0].evaluate();
            var second = _this.children[1].evaluate();
            if (typeof first !== 'number' || typeof first !== 'number') {
                throw new Error("BinOp evaluating value with type != number");
            }
            if (_this.value === '+') {
                return first + second;
            }
            else if (_this.value === '-') {
                return first - second;
            }
            else if (_this.value === '*') {
                return first * second;
            }
            else if (_this.value === '/') {
                return first / second;
            }
            else if (_this.value === '=') {
                return first === second;
            }
            else if (_this.value === '>') {
                return first > second;
            }
            else if (_this.value === '<') {
                return first < second;
            }
            else if (_this.value === '&&') {
                return first && second;
            }
            else if (_this.value === '||') {
                return first || second;
            }
            else {
                throw new Error('Invalid value on evaluate BinOp');
            }
        };
        _this.children = children;
        _this.value = value;
        return _this;
    }
    return BinOp;
}(Node));
exports.BinOp = BinOp;
var UnOp = /** @class */ (function (_super) {
    __extends(UnOp, _super);
    function UnOp(value, children) {
        if (children === void 0) { children = []; }
        var _this = _super.call(this) || this;
        _this.evaluate = function () { return _this.value === '+' ? _this.children[0].evaluate() : -_this.children[0].evaluate(); };
        _this.children = children;
        _this.value = value;
        return _this;
    }
    return UnOp;
}(Node));
exports.UnOp = UnOp;
var IntVal = /** @class */ (function (_super) {
    __extends(IntVal, _super);
    function IntVal(value) {
        var _this = _super.call(this) || this;
        _this.type = 'int';
        _this.evaluate = function () {
            return _this.value;
        };
        _this.children.length = 0;
        _this.value = value;
        return _this;
    }
    return IntVal;
}(Node));
exports.IntVal = IntVal;
var BoolVal = /** @class */ (function (_super) {
    __extends(BoolVal, _super);
    function BoolVal(value) {
        var _this = _super.call(this) || this;
        _this.type = 'bool';
        _this.evaluate = function () {
            return _this.value;
        };
        _this.value = value;
        return _this;
    }
    return BoolVal;
}(Node));
exports.BoolVal = BoolVal;
var NoOp = /** @class */ (function (_super) {
    __extends(NoOp, _super);
    function NoOp() {
        var _this = _super.call(this) || this;
        _this.children.length = 0;
        return _this;
    }
    return NoOp;
}(Node));
exports.NoOp = NoOp;
var Identifier = /** @class */ (function (_super) {
    __extends(Identifier, _super);
    function Identifier(value) {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            var entry = currentSymbolTable.get(_this.value);
            if (!entry) {
                throw new Error("Requested value for unitialized variable " + _this.value);
            }
            if (entry.value !== null && entry.value !== undefined) {
                if (entry.type === 'int' && typeof entry.value !== 'number') {
                    throw new Error("Variable " + _this.value + " of type " + entry.type + " has value " + entry.value);
                }
                if (entry.type === 'bool' && typeof entry.value !== 'boolean') {
                    throw new Error("Variable " + _this.value + " of type " + entry.type + " has value " + entry.value);
                }
            }
            else {
                throw new Error("Requested value for unassigned variable " + _this.value);
            }
            return entry.value;
        };
        _this.value = value;
        return _this;
    }
    return Identifier;
}(Node));
exports.Identifier = Identifier;
var Print = /** @class */ (function (_super) {
    __extends(Print, _super);
    function Print(children) {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            console.log(_this.children[0].evaluate());
        };
        _this.children = children;
        return _this;
    }
    return Print;
}(Node));
exports.Print = Print;
var Statements = /** @class */ (function (_super) {
    __extends(Statements, _super);
    function Statements() {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            _this.children.forEach(function (c) {
                c.evaluate();
            });
        };
        return _this;
    }
    return Statements;
}(Node));
exports.Statements = Statements;
var Assignment = /** @class */ (function (_super) {
    __extends(Assignment, _super);
    function Assignment(children) {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            var entry = currentSymbolTable.get(_this.children[0].value);
            if (!entry) {
                throw new Error("Missing type declaration for variable " + _this.children[0].value);
            }
            currentSymbolTable.setValue(_this.children[0].value, _this.children[1].evaluate());
        };
        _this.children = children;
        return _this;
    }
    return Assignment;
}(Node));
exports.Assignment = Assignment;
var Declaration = /** @class */ (function (_super) {
    __extends(Declaration, _super);
    function Declaration(type) {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            currentSymbolTable.setType(_this.children[0].value, _this.type);
        };
        _this.children = [];
        _this.type = type;
        return _this;
    }
    return Declaration;
}(Node));
exports.Declaration = Declaration;
var FunctionDeclaration = /** @class */ (function (_super) {
    __extends(FunctionDeclaration, _super);
    function FunctionDeclaration() {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            globalSymbolTable.setValue(_this.children[0].value, _this);
            globalSymbolTable.setType(_this.children[0].value, 'function');
        };
        return _this;
    }
    return FunctionDeclaration;
}(Node));
exports.FunctionDeclaration = FunctionDeclaration;
/** The children in this node are the function arguments */
var FunctionCall = /** @class */ (function (_super) {
    __extends(FunctionCall, _super);
    function FunctionCall(value) {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            var parameters;
            var statements;
            var retval = null;
            var fnDeclaration = null;
            try {
                fnDeclaration = globalSymbolTable.get(_this.value).value;
            }
            catch (error) {
                throw new Error("Called undefined function " + _this.value);
            }
            if (fnDeclaration) {
                _this.previousSymbolTable = currentSymbolTable;
                _this.symbolTable.scope = fnDeclaration.children[0].value;
                parameters = fnDeclaration.children.slice(1, fnDeclaration.children.length - 1);
                statements = fnDeclaration.children[fnDeclaration.children.length - 1];
                /** pass arguments to function's scope symbol table */
                _this.children.forEach(function (arg, index) {
                    _this.symbolTable.setValue(parameters[index].children[0].value, _this.children[index].evaluate());
                });
                _this.symbolTable.setValue(_this.symbolTable.scope, null);
                _this.symbolTable.setType(_this.symbolTable.scope, 'int');
                /** temporarily switch symbol tables */
                currentSymbolTable = _this.symbolTable;
                statements.evaluate();
                retval = _this.symbolTable.get(_this.symbolTable.scope);
                /** Revert ST */
                currentSymbolTable = _this.previousSymbolTable;
                if (retval) {
                    return retval.value;
                }
            }
            else {
                throw new Error("Called undefined function " + _this.value);
            }
        };
        _this.value = value;
        _this.symbolTable = new symboltable_1.SymbolTable();
        _this.previousSymbolTable = new symboltable_1.SymbolTable();
        return _this;
    }
    return FunctionCall;
}(Node));
exports.FunctionCall = FunctionCall;
/** Children[0] is the return value */
var Return = /** @class */ (function (_super) {
    __extends(Return, _super);
    function Return(value) {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            if (_this.children[0]) {
                currentSymbolTable.setValue(currentSymbolTable.scope, _this.children[0].evaluate());
                currentSymbolTable.setType(currentSymbolTable.scope, 'int');
                return currentSymbolTable.get(currentSymbolTable.scope).value;
            }
            else {
                throw new Error("Return has empty statement");
            }
        };
        _this.children[0] = value;
        return _this;
    }
    return Return;
}(Node));
exports.Return = Return;
var Scan = /** @class */ (function (_super) {
    __extends(Scan, _super);
    function Scan() {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            var input = readlineSync.question("");
            var number = parseInt(input);
            if (number) {
                return parseInt(input);
            }
            else {
                throw new Error("scan() method expected number, received: " + input);
            }
        };
        return _this;
    }
    return Scan;
}(Node));
exports.Scan = Scan;
var If = /** @class */ (function (_super) {
    __extends(If, _super);
    function If() {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            if (typeof _this.children[0].evaluate() !== 'boolean') {
                throw new Error("Expected boolean at IF statement, found " + _this.children[0].evaluate());
            }
            if (_this.children[0].evaluate()) {
                _this.children[1].evaluate();
                return;
            }
            if (_this.children[2]) {
                _this.children[2].evaluate();
            }
        };
        _this.children = [];
        return _this;
    }
    return If;
}(Node));
exports.If = If;
var While = /** @class */ (function (_super) {
    __extends(While, _super);
    function While() {
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            while (_this.children[0].evaluate()) {
                _this.children[1].evaluate();
            }
        };
        _this.children = [];
        return _this;
    }
    return While;
}(Node));
exports.While = While;
