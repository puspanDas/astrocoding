/**
 * Basic syntax transpiler for AstroCode MVP.
 * Converts simple Python/Java/C++ constructs into valid JavaScript
 * so the browser sandboxed execution engine can run them.
 */
export function transpileToJS(code, language) {
  if (language === 'javascript') return code

  let js = code

  if (language === 'java' || language === 'cpp') {
    // 1. Remove standard boilerplate
    js = js.replace(/#include\s+<.*?>/g, '')
    js = js.replace(/import\s+[\w.]+;/g, '')

    // 2. Remove class wrapper: public class X {
    js = js.replace(/public\s+class\s+\w+\s*\{/g, '')
    // Remove method wrappers: public static void/int foo(...) {
    js = js.replace(/public\s+static\s+\w+\s+\w+\s*\([^)]*\)\s*\{/g, '')
    // Remove C++ function wrappers: void execute() { / void racePlan() {
    js = js.replace(/(?:void|bool|int|float|double)\s+\w+\s*\([^)]*\)\s*\{/g, '')

    // 3. Replace typed variable declarations — only at start of statement
    // e.g. "int i = 0" → "let i = 0", but NOT inside rover.method() calls
    js = js.replace(/(?:^|(?<=[;{\n]))\s*(int|float|double|boolean|bool)\s+(?=[a-zA-Z_])/gm,
      (match, type) => match.replace(type, 'let')
    )

    // 4. Print statements
    js = js.replace(/System\.out\.println\s*\(/g, 'console.log(')
    js = js.replace(/std::cout\s*<<\s*(.*?)(?:\s*<<\s*(?:std::endl|"\\n"|'\\n'))?\s*;/g, 'console.log($1);')

    // 5. Strip mismatched trailing braces left by removed wrappers
    let braceCount = 0
    const chars = js.split('')
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === '{') braceCount++
      else if (chars[i] === '}') {
        if (braceCount === 0) chars[i] = ' '
        else braceCount--
      }
    }
    js = chars.join('')
  }

  if (language === 'python') {
    // 1. Strip comments — lines starting with # (after optional whitespace)
    js = js.replace(/^([ \t]*)#(.*)$/gm, '$1//$2')

    // 2. Function definitions
    js = js.replace(/def\s+(\w+)\s*\(([^)]*)\)\s*:/g, 'function $1($2) {')

    // 3. for i in range — handle range(n), range(start,end), range(start,end,step)
    js = js.replace(
      /for\s+(\w+)\s+in\s+range\(\s*(\d+)\s*\)\s*:/g,
      'for (let $1 = 0; $1 < $2; $1++) {'
    )
    js = js.replace(
      /for\s+(\w+)\s+in\s+range\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*:/g,
      'for (let $1 = $2; $1 < $3; $1++) {'
    )
    js = js.replace(
      /for\s+(\w+)\s+in\s+range\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+)\s*\)\s*:/g,
      'for (let $1 = $2; $1 < $3; $1 += $4) {'
    )

    // 4. elif before if (order matters)
    js = js.replace(/elif\s+(.+?)\s*:/g, '} else if ($1) {')
    js = js.replace(/else\s*:/g, '} else {')
    // if — only match standalone if (not inside already-converted lines)
    js = js.replace(/^([ \t]*)if\s+(.+?)\s*:/gm, '$1if ($2) {')

    // 5. Booleans and print
    js = js.replace(/\bTrue\b/g, 'true')
    js = js.replace(/\bFalse\b/g, 'false')
    js = js.replace(/\bNone\b/g, 'null')
    js = js.replace(/\bprint\s*\(/g, 'console.log(')

    // 6. Add closing braces based on indentation
    const lines = js.split('\n')
    const out = []
    const indentStack = [0]

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed === '' || trimmed.startsWith('//')) {
        out.push(line)
        continue
      }

      const indent = line.search(/\S|$/)

      while (indent < indentStack[indentStack.length - 1]) {
        out.push(' '.repeat(indentStack[indentStack.length - 1] - 4) + '}')
        indentStack.pop()
      }

      out.push(line)

      if (trimmed.endsWith('{')) {
        indentStack.push(indent + 4)
      }
    }

    while (indentStack.length > 1) {
      indentStack.pop()
      out.push('}')
    }

    js = out.join('\n')
  }

  return js
}
