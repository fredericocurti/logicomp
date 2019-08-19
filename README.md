# logicomp
Repositório da disciplina Lógica da Computação 2019.2

## Dependências
- [Node.js @ latest](https://nodejs.org/en/download/)
- [npm @ latest](https://www.npmjs.com/get-npm)

## Executando
Clone o repositório, e no diretório execute:

```
$ npm install
$ npm run main '789  + 324 + 12'
```

## EBNF

`expression = term, { (“+” | “-”), term} ;`

`term = number, { (“*” | “/”), number} ;`