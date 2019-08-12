if (process.argv.length !== 3) {
    console.log("Missing string or invalid input")
}

const tokens = process.argv[2].match(/[0-9]+|\-|\+/g)
let value = 0
let op = '+'

if (tokens) {
    tokens.forEach(t => {
        if (t === '+' || t === '-') {
            op = t
        } else {
            if (op === '+') {
                value += parseInt(t)
            } else {
                value -= parseInt(t)
            }
        }
    })
} else {
    throw new Error("Invalid input")
}

console.log(value)