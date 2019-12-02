export class Preprocessor {
    /** Removes comments from input */
    static filter(input: string): string {
        // const COMMENT_REGEXP = /\/\//gi
        let output = ''
        let p = 0
        let ignore = false
    
        while (input[p] !== undefined) {
            if (input[p + 1] !== undefined && input[p] === '/' && input[p + 1] === '/') {
                ignore = true
            }

            if (input[p] === '\n') {
                ignore = false
            }
            
            if (!ignore) {
                output += input[p]
            }

            p++;
        }

        return output
        //.replace(String.fromCharCode(92),String.fromCharCode(92,92));
    }
}