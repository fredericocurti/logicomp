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
    }
    SymbolTable.get = function (key) {
        // @ts-ignore
        return SymbolTable.symbolTable[key];
    };
    SymbolTable.setValue = function (key, value) {
        // @ts-ignore
        SymbolTable.symbolTable[key] = __assign({}, SymbolTable.symbolTable[key], { value: value });
    };
    SymbolTable.setType = function (key, type) {
        // @ts-ignore
        SymbolTable.symbolTable[key] = __assign({}, SymbolTable.symbolTable[key], { type: type });
    };
    SymbolTable.symbolTable = {};
    return SymbolTable;
}());
exports.SymbolTable = SymbolTable;
