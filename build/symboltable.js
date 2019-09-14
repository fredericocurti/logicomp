"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SymbolTable = /** @class */ (function () {
    function SymbolTable() {
    }
    SymbolTable.get = function (key) {
        // @ts-ignore
        return SymbolTable.symbolTable[key];
    };
    SymbolTable.set = function (key, value) {
        // @ts-ignore
        SymbolTable.symbolTable[key] = value;
    };
    SymbolTable.symbolTable = {};
    return SymbolTable;
}());
exports.SymbolTable = SymbolTable;
