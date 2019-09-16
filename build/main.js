"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var preprocessor_1 = require("./preprocessor");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var input = process.argv[2];
if (input) {
    try {
        var file = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', input), { encoding: 'utf-8' });
        var filteredInput = preprocessor_1.Preprocessor.filter(file);
        var result = parser_1.Parser.run(filteredInput);
        /** console.log(util.inspect(result,  {showHidden: false, depth: null})) */
        // result.evaluate()
    }
    catch (error) {
        console.error(error.message);
    }
}
else {
    throw new Error('Missing or empty input string');
}
