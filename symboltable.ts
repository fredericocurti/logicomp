type SymbolTableEntry = {
    value: any
    type: 'int' | 'bool'
    offset: number
}

export class SymbolTable {
    static symbolTable: Object = {}

    static get(key: string): SymbolTableEntry {
        // @ts-ignore
        return SymbolTable.symbolTable[key]
    }

    static setValue(key: string, value: any) {
        // @ts-ignore
        SymbolTable.symbolTable[key] = {...SymbolTable.symbolTable[key], value: value }
    }

    static setType(key: string, type: 'bool' | 'int') {
        // @ts-ignore
        SymbolTable.symbolTable[key] = {...SymbolTable.symbolTable[key], type: type }
    }

    static setOffset(key: string, offset: number) {
        // @ts-ignore
        SymbolTable.symbolTable[key] = {...SymbolTable.symbolTable[key], offset: offset}
    }

}