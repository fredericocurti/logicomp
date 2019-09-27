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
var readlineSync = require('readline-sync');
var Node = /** @class */ (function () {
    function Node() {
        this.children = [];
        this.evaluate = function () { return new NoOp(); };
    }
    return Node;
}());
exports.Node = Node;
var BinOp = /** @class */ (function (_super) {
    __extends(BinOp, _super);
    function BinOp(value, children) {
        if (children === void 0) { children = []; }
        var _this = _super.call(this) || this;
        _this.evaluate = function () {
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
            var value = symboltable_1.SymbolTable.get(_this.value);
            if (typeof value === "number") {
                return value;
            }
            throw new Error("Requested value for unitialized variable " + _this.value);
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
            symboltable_1.SymbolTable.set(_this.children[0].value, _this.children[1].evaluate());
        };
        _this.children = children;
        return _this;
    }
    return Assignment;
}(Node));
exports.Assignment = Assignment;
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
