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
