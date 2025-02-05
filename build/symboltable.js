"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var SymbolTable = /** @class */ (function () {
    function SymbolTable() {
        this.symbolTable = {};
        this.scope = 'GLOBAL';
    }
    SymbolTable.prototype.get = function (key) {
        // @ts-ignore
        return this.symbolTable[key];
    };
    SymbolTable.prototype.setValue = function (key, value) {
        // @ts-ignore
        this.symbolTable[key] = __assign({}, this.symbolTable[key], { value: value });
    };
    SymbolTable.prototype.setType = function (key, type) {
        // @ts-ignore
        this.symbolTable[key] = __assign({}, this.symbolTable[key], { type: type });
    };
    return SymbolTable;
}());
exports.SymbolTable = SymbolTable;
