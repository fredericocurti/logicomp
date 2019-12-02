# logicomp
Repositório da disciplina Lógica da Computação 2019.2

## Dependências
- [Node.js @ latest](https://nodejs.org/en/download/)
- [npm @ latest](https://www.npmjs.com/get-npm)

## Executando
Clone o repositório, e no diretório execute:

```
$ npm install
$ npm run silly examples/test3.silly
```

# Sillylang
A sillylang é uma linguagem que tenta aproximar os símbolos de sua gramática às suas funções de maneira lúdica.

Exemplo de cálculo do fatorial em silly:

```
! factorial \I x/ >< I [
    ? x = 0 [
        >< 1;
    ] ¿ [
        >< x * factorial \x - 1/; 
    ]
]

! main \/ >< I [
    >> factorial\<</;
]
```

## EBNF

```
number = [0-9]+
bool = “true” | “false”
type = I (int) | B (bool)
identifier = [A-Za-z0-9]+
declaration = type identifier;
assignment = identifier <- factor;
function_call = identifier \ {factor}* /;
scan = <<
condition = factor (> | >= | < | <= | =) factor
bin_op = factor (+ | - | || | && | %) factor
factor = bool | number | bin_op | identifier | function_call | condition | scan
print = >> factor
loop = @, block, ~ condition
if_else = ? condition block [¿ block]
return = >< factor;
statement = assignment | loop | if_else | print | return;
block = “[“ {statement}* “]”
function_declaration = ! identifier \ {type identifier}* / >< type block
main = ! main \/ >< I block
program = {function_declaration}* main
```