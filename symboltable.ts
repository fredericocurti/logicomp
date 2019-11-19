export class SymbolTable {
    symbolTable: Object
    scope: string
    constructor() {
        this.symbolTable = {}
        this.scope = 'GLOBAL'
    }

    get(key: string) {
        // @ts-ignore
        return this.symbolTable[key]
    }

    setValue(key: string, value: any) {
        // @ts-ignore
        this.symbolTable[key] = {...this.symbolTable[key], value: value }
    }

    setType(key: string, type: 'bool' | 'int' | 'function') {
        // @ts-ignore
        this.symbolTable[key] = {...this.symbolTable[key], type: type }
    }
    
}