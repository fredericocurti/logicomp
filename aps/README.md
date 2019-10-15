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


