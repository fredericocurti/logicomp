import { Tokenizer } from './tokenizer'
import { Token } from './token'
import { Parser } from './parser'
import { Preprocessor } from './preprocessor';

const input = process.argv[2]

if (input) {
    const filteredInput = Preprocessor.filter(input + '\n')
    const result = Parser.run(filteredInput)
    console.log(result)
} else {
    throw new Error('Missing or empty input string')
}