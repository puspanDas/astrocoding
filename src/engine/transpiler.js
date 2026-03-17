/**
 * Basic syntax transpiler for AstroCode MVP.
 * Converts simple Python/Java/C++ constructs into valid JavaScript
 * so the browser sandboxed execution engine can run them.
 */
export function transpileToJS(code, language) {
  if (language === 'javascript') return code

  let js = code

  if (language === 'java' || language === 'cpp') {
    // 1. Remove standard boilerplate (imports/includes)
    js = js.replace(/#include\s+<.*?>/g, '')
    js = js.replace(/import\s+.*?;/g, '')

    // 2. Remove class and outer method wrappers typical in these languages
    // Match: public class X { ... }
    js = js.replace(/public\s+class\s+\w+\s*\{/g, '')
    // Match: public static void main(String[] args) {
    js = js.replace(/public\s+static\s+\w+\s+\w+\s*\(.*?\)\s*\{/g, '')
    // Match: bool function(Rover& rover) {
    js = js.replace(/(bool|int|void|boolean)\s+\w+\s*\(.*?\)\s*\{/g, 'function() {')

    // 3. Replace static types with 'let'
    js = js.replace(/\bint\b/g, 'let')
    js = js.replace(/\bfloat\b/g, 'let')
    js = js.replace(/\bdouble\b/g, 'let')
    js = js.replace(/\bboolean\b/g, 'let')
    js = js.replace(/\bbool\b/g, 'let')
    
    // 4. Print statements
    js = js.replace(/System\.out\.println/g, 'console.log')
    js = js.replace(/std::cout\s*<<\s*(.*?)\s*<</g, 'console.log($1)') // Very hacky C++ cout

    // Strip trailing braces that belonged to removed class/method wrappers
    // For MVP, we aggressively trim mismatched trailing braces from the end of the script
    let braceCount = 0;
    const chars = js.split('');
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === '{') braceCount++;
        else if (chars[i] === '}') {
            if (braceCount === 0) {
                // Remove mismatched brace
                chars[i] = ' ';
            } else {
                braceCount--;
            }
        }
    }
    js = chars.join('');
  }

  if (language === 'python') {
    // Basic python block to JS
    js = js.replace(/(^|\s)#/g, '$1//') // Convert python comments to JS, ignoring hex colors like #fff
    js = js.replace(/def\s+(\w+)\s*\((.*?)\):/g, 'function $1($2) {')
    js = js.replace(/for\s+(\w+)\s+in\s+range\((.*?)\):/g, 'for (let $1 = 0; $1 < $2; $1++) {')
    js = js.replace(/if\s+(.*?):/g, 'if ($1) {')
    js = js.replace(/elif\s+(.*?):/g, '} else if ($1) {')
    js = js.replace(/else:/g, '} else {')
    js = js.replace(/True/g, 'true')
    js = js.replace(/False/g, 'false')
    js = js.replace(/print\(/g, 'console.log(')

    // Add closing braces based on indentation. MVP solution.
    const lines = js.split('\n')
    let out = []
    let indentStack = [0]

    for (let line of lines) {
      if (line.trim().startsWith('//') || line.trim() === '') {
        out.push(line)
        continue
      }
      if (line.trim().startsWith('#')) {
        out.push(line.replace(/#/, '//'))
        continue
      }

      const indent = line.search(/\S|$/)

      // Dedent = closing brace
      while (indent < indentStack[indentStack.length - 1]) {
        out.push(' '.repeat(indentStack[indentStack.length - 1] - 4) + '}')
        indentStack.pop()
      }

      out.push(line)

      // Indent = new block
      if (line.trim().endsWith('{')) {
        indentStack.push(indent + 4)
      }
    }

    while (indentStack.length > 1) {
      indentStack.pop()
      out.push('}')
    }
    js = out.join('\n')
  }

  console.log("Transpiled JS:\n", js)
  return js
}
