"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var input = process.argv[2];
// const tokenizer = new Tokenizer(input)
//tokenizer.selectNext()
//console.log(input)
parser_1.Parser.run(input);
