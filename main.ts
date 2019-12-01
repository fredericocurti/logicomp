import { Parser } from './parser'
import { Preprocessor } from './preprocessor';
import fs from 'fs'

const input = process.argv[2]

if (input) {
    try {
        const file = fs.readFileSync(input, { encoding: 'utf-8' })
        const filteredInput = Preprocessor.filter(file)
        const result = Parser.run(filteredInput, input)
        result.evaluate()
    } catch (error) {
        console.error(error.message)
        process.exit(1);
    }
} else {
    throw new Error('Missing or empty input string')
}