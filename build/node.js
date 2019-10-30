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
var assembler_1 = require("./assembler");
var readlineSync = require('readline-sync');
var Node = /** @class */ (function () {
    function Node() {
        Node.idCounter++;
        this.id = Node.idCounter;
        this.children = [];
        this.evaluate = function () { return new NoOp(); };
    }
    Node.idCounter = 0;
    return Node;
}());
exports.Node = Node;
var BinOp = /** @class */ (function (_super) {
    __extends(BinOp, _super);
    function BinOp(value, children) {
        if (children === void 0) { children = []; }
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
            // if (typeof this.children[0].evaluate() !== 'number' || typeof this.children[1].evaluate() !== 'number') {
            //     throw new Error(`BinOp evaluating value with type != number`)
            // }
            if (process.env.ASSEMBLE) {
                var first = _this.children[0].evaluate();
                assembler_1.Assembler.append("  PUSH EBX\n");
                var second = _this.children[1].evaluate();
                assembler_1.Assembler.append("  POP EAX\n");
                if (_this.value === '+') {
                    assembler_1.Assembler.append("  ADD EBX, EAX\n");
                    return first + second;
                }
                else if (_this.value === '-') {
                    assembler_1.Assembler.append("  SUB EAX, EBX\n");
                    assembler_1.Assembler.append("  MOV EBX, EAX\n");
                    return first - second;
                }
                else if (_this.value === '*') {
                    assembler_1.Assembler.append("  IMUL EBX\n");
                    assembler_1.Assembler.append("  MOV EBX, EAX\n");
                    return first * second;
                }
                else if (_this.value === '/') {
                    assembler_1.Assembler.append("  IDIV EBX\n");
                    assembler_1.Assembler.append("  MOV EBX, EAX\n");
                    return first / second;
                }
                else if (_this.value === '==') {
                    assembler_1.Assembler.append("  CMP EAX, EBX\n");
                    assembler_1.Assembler.append("  CALL binop_je\n");
                    return first === second;
                }
                else if (_this.value === '>') {
                    assembler_1.Assembler.append("  CMP EAX, EBX\n");
                    assembler_1.Assembler.append("  CALL binop_jg\n");
                    return first > second;
                }
                else if (_this.value === '<') {
                    assembler_1.Assembler.append("  CMP EAX, EBX\n");
                    assembler_1.Assembler.append("  CALL binop_jl\n");
                    return first < second;
                }
                else if (_this.value === '&&') {
                    assembler_1.Assembler.append("  AND EBX, EAX\n");
                    return first && second;
                }
                else if (_this.value === '||') {
                    assembler_1.Assembler.append("  OR EBX, EAX\n");
                    return first || second;
                }
                else {
                    throw new Error('Invalid value on evaluate BinOp');
                }
            }
            else {
                if (_this.value === '+') {
                    return _this.children[0].evaluate() + _this.children[1].evaluate();
                }
                else if (_this.value === '-') {
                    return _this.children[0].evaluate() - _this.children[1].evaluate();
                }
                else if (_this.value === '*') {
                    return _this.children[0].evaluate() * _this.children[1].evaluate();
                }
                else if (_this.value === '/') {
                    return _this.children[0].evaluate() / _this.children[1].evaluate();
                }
                else if (_this.value === '==') {
                    return _this.children[0].evaluate() === _this.children[1].evaluate();
                }
                else if (_this.value === '>') {
                    return _this.children[0].evaluate() > _this.children[1].evaluate();
                }
                else if (_this.value === '<') {
                    return _this.children[0].evaluate() < _this.children[1].evaluate();
                }
                else if (_this.value === '&&') {
                    return _this.children[0].evaluate() && _this.children[1].evaluate();
                }
                else if (_this.value === '||') {
                    return _this.children[0].evaluate() || _this.children[1].evaluate();
                }
                else {
                    throw new Error('Invalid value on evaluate BinOp');
                }
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
            assembler_1.Assembler.append("  MOV EBX, " + _this.value + "\n");
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
            var entry = symboltable_1.SymbolTable.get(_this.value);
            if (!entry) {
                throw new Error("Requested value for unitialized variable " + _this.value);
            }
            if (entry.value) {
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
            assembler_1.Assembler.append("  MOV EBX, [EBP-" + entry.offset + "]\n");
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
            assembler_1.Assembler.append("  PUSH EBX\n");
            assembler_1.Assembler.append("  CALL print\n");
            assembler_1.Assembler.append("  POP EBX\n");
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
            var entry = symboltable_1.SymbolTable.get(_this.children[0].value);
            if (!entry) {
                throw new Error("Missing type declaration for variable " + _this.children[0].value);
            }
            symboltable_1.SymbolTable.setValue(_this.children[0].value, _this.children[1].evaluate());
            // console.log(SymbolTable.symbolTable)
            assembler_1.Assembler.append("  MOV [EBP-" + entry.offset + "], EBX\n");
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
            symboltable_1.SymbolTable.setType(_this.children[0].value, _this.type);
            symboltable_1.SymbolTable.setOffset(_this.children[0].value, _this.offset);
            assembler_1.Assembler.append("  PUSH DWORD 0\n");
        };
        _this.children = [];
        _this.type = type;
        _this.offset = Declaration.offsetCounter;
        Declaration.offsetCounter += 4;
        return _this;
    }
    Declaration.offsetCounter = 4;
    return Declaration;
}(Node));
exports.Declaration = Declaration;
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
            var condition = _this.children[0].evaluate();
            if (typeof condition !== 'boolean') {
                throw new Error("Expected boolean at IF statement, found " + _this.children[0].evaluate());
            }
            if (process.env.ASSEMBLE) {
                assembler_1.Assembler.append("  CMP EBX, False\n");
                assembler_1.Assembler.append("  JE ELSE_" + _this.id + "\n");
                _this.children[1].evaluate();
                assembler_1.Assembler.append("  JMP ENDIF_" + _this.id + "\n");
                assembler_1.Assembler.append("  ELSE_" + _this.id + ":\n");
                _this.children[2].evaluate();
                assembler_1.Assembler.append("  ENDIF_" + _this.id + ":\n");
            }
            else {
                if (condition) {
                    _this.children[1].evaluate();
                    return;
                }
                if (_this.children[2]) {
                    _this.children[2].evaluate();
                }
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
            if (process.env.ASSEMBLE) {
                assembler_1.Assembler.append("\n  WHILE_" + _this.id + ":\n");
                var condition = _this.children[0].evaluate();
                if (typeof condition === 'boolean') {
                    assembler_1.Assembler.append("  CMP EBX, False\n");
                    assembler_1.Assembler.append("  JE EXIT_" + _this.id + "\n");
                    _this.children[1].evaluate();
                    assembler_1.Assembler.append("  JMP WHILE_" + _this.id + "\n");
                    assembler_1.Assembler.append("  EXIT_" + _this.id + ":\n");
                }
                else {
                    throw new Error("Expected boolean at WHILE");
                }
            }
            else {
                while (_this.children[0].evaluate()) {
                    _this.children[1].evaluate();
                }
            }
        };
        _this.children = [];
        return _this;
    }
    return While;
}(Node));
exports.While = While;
