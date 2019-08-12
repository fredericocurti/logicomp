"use strict";
if (process.argv.length !== 3) {
    console.log("Missing string or invalid input");
}
var tokens = process.argv[2].match(/[0-9]+|\-|\+/g);
var value = 0;
var op = '+';
if (tokens) {
    tokens.forEach(function (t) {
        if (t === '+' || t === '-') {
            op = t;
        }
        else {
            if (op === '+') {
                value += parseInt(t);
            }
            else {
                value -= parseInt(t);
            }
        }
    });
}
else {
    throw new Error("Invalid input");
}
console.log(value);
