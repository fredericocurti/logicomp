"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var preprocessor_1 = require("./preprocessor");
var fs_1 = __importDefault(require("fs"));
var input = process.argv[2];
if (input) {
    try {
        var file = fs_1.default.readFileSync(input, { encoding: 'utf-8' });
        var filteredInput = preprocessor_1.Preprocessor.filter(file);
        var result = parser_1.Parser.run(filteredInput, input);
        result.evaluate();
    }
    catch (error) {
        console.log("\n\u001B[31mEVALUATION ERROR:\u001B[0m");
        console.error(error.message);
        process.exit(1);
    }
}
else {
    throw new Error('Missing or empty input string');
}
