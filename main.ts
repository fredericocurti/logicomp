import { Tokenizer } from './tokenizer'
import { Token } from './token'
import { Parser } from './parser'

const input = process.argv[2]
// const tokenizer = new Tokenizer(input)
//tokenizer.selectNext()
//console.log(input)

Parser.run(input)