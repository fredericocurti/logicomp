import { Tokenizer } from './tokenizer'
import { Token } from './token'
import { Parser } from './parser'

const input = process.argv[2]
if (input) {
    Parser.run(input)
} else {
    throw new Error('Missing input string')
}