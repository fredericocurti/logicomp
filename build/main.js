"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var input = process.argv[2];
if (input) {
    parser_1.Parser.run(input);
}
else {
    throw new Error('Missing input string');
}
