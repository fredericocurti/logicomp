"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var input = process.argv[2];
if (input) {
    var result = parser_1.Parser.run(input);
    console.log('Result:', result);
}
else {
    throw new Error('Missing input string');
}
