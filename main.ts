import { Parser } from './parser'
import { Preprocessor } from './preprocessor';
import path from 'path'
import util from 'util'
import fs from 'fs'
import { Scan } from './node';

const input = process.argv[2]

if (input) {
    try {
        const file = fs.readFileSync(path.join(__dirname, '..', input), { encoding: 'utf-8' })
        const filteredInput = Preprocessor.filter(file)
        const result = Parser.run(filteredInput)
        /** console.log(util.inspect(result,  {showHidden: false, depth: null})) */
        // result.evaluate()
    } catch (error) {
        console.error(error.message)
    }
} else {
    throw new Error('Missing or empty input string')
}