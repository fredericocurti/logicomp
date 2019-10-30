"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var Assembler = /** @class */ (function () {
    function Assembler() {
    }
    Assembler.append = function (text) {
        Assembler.buffer += text;
    };
    Assembler.flush = function () {
        Assembler.buffer += "\n  ; interrupcao de saida\n  POP EBP\n  MOV EAX, 1\n  INT 0x80";
        fs.writeFileSync('program.asm', Assembler.buffer);
    };
    Assembler.buffer = "\n; constantes\nSYS_EXIT equ 1\nSYS_READ equ 3\nSYS_WRITE equ 4\nSTDIN equ 0\nSTDOUT equ 1\nTrue equ 1\nFalse equ 0\n\nsegment .data\n\nsegment .bss ; variaveis\n  res RESB 1\n    \nsection .text\n  global __start\n  \nprint:  ; subrotina print\n  PUSH EBP ; guarda o base pointer\n  MOV EBP, ESP ; estabelece um novo base pointer\n\n  MOV EAX, [EBP+8] ; 1 argumento antes do RET e EBP\n  XOR ESI, ESI\n\nprint_dec: ; empilha todos os digitos\n  MOV EDX, 0\n  MOV EBX, 0x000A\n  DIV EBX\n  ADD EDX, '0'\n  PUSH EDX\n  INC ESI ; contador de digitos\n  CMP EAX, 0\n  JZ print_next ; quando acabar pula\n  JMP print_dec\n\nprint_next:\n  CMP ESI, 0\n  JZ print_exit ; quando acabar de imprimir\n  DEC ESI\n\n  MOV EAX, SYS_WRITE\n  MOV EBX, STDOUT\n\n  POP ECX\n  MOV [res], ECX\n  MOV ECX, res\n\n  MOV EDX, 1\n  INT 0x80\n  JMP print_next\n\nprint_exit:\n  POP EBP\n  RET\n\n; subrotinas if/while\nbinop_je:\n  JE binop_true\n  JMP binop_false\n\nbinop_jg:\n  JG binop_true\n  JMP binop_false\n\nbinop_jl:\n  JL binop_true\n  JMP binop_false\n\nbinop_false:\n  MOV EBX, False  \n  JMP binop_exit\nbinop_true:\n  MOV EBX, True\nbinop_exit:\n  RET\n\n__start:\n  PUSH EBP\n  MOV EBP, ESP\n\n";
    return Assembler;
}());
exports.Assembler = Assembler;
