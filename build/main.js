"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var preprocessor_1 = require("./preprocessor");
var input = process.argv[2];
if (input) {
    var filteredInput = preprocessor_1.Preprocessor.filter(input + '\n');
    var result = parser_1.Parser.run(filteredInput);
    console.log(result);
}
else {
    throw new Error('Missing or empty input string');
}
