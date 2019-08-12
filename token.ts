export type TokenType = 'INT' | 'PLUS' | 'MINUS' | 'EOF'

export class Token {
    type: string;
    value: string | number | null;
    constructor(type: TokenType, value: number | string | null) {
        this.type = type
        this.value = value
    }
}