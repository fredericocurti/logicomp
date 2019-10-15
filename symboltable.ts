export class SymbolTable {
    static symbolTable: Object = {}

    static get(key: string) {
        // @ts-ignore
        return SymbolTable.symbolTable[key]
    }

    static setValue(key: string, value: any) {
        // @ts-ignore
        SymbolTable.symbolTable[key] = {...SymbolTable.symbolTable[key], value: parseInt(value) }
    }

    static setType(key: string, type: 'bool' | 'int') {
        // @ts-ignore
        SymbolTable.symbolTable[key] = {...SymbolTable.symbolTable[key], type: type }
    }

}