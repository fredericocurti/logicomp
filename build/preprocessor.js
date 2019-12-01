"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Preprocessor = /** @class */ (function () {
    function Preprocessor() {
    }
    /** Removes comments from input */
    Preprocessor.filter = function (input) {
        // const COMMENT_REGEXP = /\/\//gi
        var output = '';
        var p = 0;
        var ignore = false;
        while (input[p] !== undefined) {
            if (input[p + 1] !== undefined && input[p] === '/' && input[p + 1] === '/') {
                ignore = true;
            }
            if (input[p] === '\n') {
                ignore = false;
            }
            if (!ignore) {
                output += input[p];
            }
            p++;
        }
        return output;
        //.replace(String.fromCharCode(92),String.fromCharCode(92,92));
    };
    return Preprocessor;
}());
exports.Preprocessor = Preprocessor;
