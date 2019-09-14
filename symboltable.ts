export class SymbolTable {
    static symbolTable: Object = {}

    static get(key: string) {
        // @ts-ignore
        return SymbolTable.symbolTable[key]
    }

    static set(key: string, value: any) {
        // @ts-ignore
        SymbolTable.symbolTable[key] = value
    }

}