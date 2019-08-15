import { Tokenizer } from './tokenizer'
import { Token } from './token'
import { Parser } from './parser'

const input = process.argv[2]
if (input) {
    const result = Parser.run(input)
    console.log('Result:', result)
} else {
    throw new Error('Missing input string')
}