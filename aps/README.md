# Sillylang 


## **EBNF**
```
identifier = [A-Za-z0-9]+ - type;
number = [0-9]+;
bool = “true” | “false”;
type = I (int) | B (bool);
values = bool | number | bin_op;
function_definition = !, identifier params -> type block;
params = \{<type> <identifier>}*/;
args = \{<identifier>}*/;
block = “[”{statement}“]”;
return = -> identifier;
statement = assignment | loop;
ifelse = ? condition block [% block];
function_call = identifier args!;
assignment = [type] identifier <- values;
loop = @, block, ~ condition;
condition = identifier (> | >= | < | <= | =) identifier
bin_op = (identifier|value) (+ | - | || | && | /)
```

## Análise de viabilidade LLVM

a LLVM é uma biblioteca para produzir código intermediário ou de máquina (binário) independente da linguagem. Ela pode ser usada como um compilador, onde provida de um parser, e um lexer (front-end) e de um backend (instruction sets para diferentes arquiteturas de CPU), ela pode atuar como o compilador de uma linguagem própria. Porém, por ser uma ferramenta bastante versátil e complexa, possui várias peculiaridades e possui uma sintaxe bastante rígida. Ela pode atuar como um compilador para a minha linguagem porém é possível escrever o mesmo "na mão" sem ter o overhead de aprender as diversas ferramentas da LLVM e seu uso apropriado.