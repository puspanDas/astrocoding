import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, X, Copy, Check, Lightbulb, ArrowRight } from 'lucide-react'
import './CodeTranslator.css'

/**
 * Client-side code translator for AstroCode.
 * Translates rover commands between JavaScript, Python, Java, and C++.
 */

const LANG_META = {
  javascript: { icon: 'JS', name: 'JavaScript', faction: 'Core System' },
  python:     { icon: '🐍', name: 'Python',     faction: 'Python Federation' },
  java:       { icon: '☕', name: 'Java',       faction: 'Java Syndicate' },
  cpp:        { icon: '⚡', name: 'C++',        faction: 'C++ Vanguard' },
}

/* ——— Translation Engine ——— */

/**
 * Normalize code to a language-neutral intermediate representation.
 * Extracts statements, comments, and structures.
 */
function parseToIR(code, lang) {
  const lines = code.split('\n')
  const ir = []

  for (let raw of lines) {
    const trimmed = raw.trim()
    if (!trimmed) { ir.push({ type: 'blank' }); continue }

    // Comments
    if (lang === 'python' && trimmed.startsWith('#')) {
      ir.push({ type: 'comment', text: trimmed.replace(/^#\s*/, '') }); continue
    }
    if ((lang === 'javascript' || lang === 'java' || lang === 'cpp') && trimmed.startsWith('//')) {
      ir.push({ type: 'comment', text: trimmed.replace(/^\/\/\s*/, '') }); continue
    }

    // Skip boilerplate
    if (lang === 'java' && /public\s+class\s+\w+/.test(trimmed)) continue
    if (lang === 'java' && /public\s+static\s+\w+\s+\w+\s*\(/.test(trimmed)) continue
    if (lang === 'cpp' && /^#include/.test(trimmed)) continue
    if (lang === 'cpp' && /^void\s+execute\s*\(\)/.test(trimmed)) continue
    if (trimmed === '{' || trimmed === '}') continue

    // For loops
    const jsFor = trimmed.match(/for\s*\(\s*(?:let|int|var)\s+(\w+)\s*=\s*(\d+)\s*;\s*\w+\s*<\s*(\w+)\s*;\s*\w+\+\+\s*\)\s*\{?/)
    const pyFor = trimmed.match(/for\s+(\w+)\s+in\s+range\((\d+)(?:,\s*(\d+))?\)\s*:/)
    if (jsFor) {
      ir.push({ type: 'for', variable: jsFor[1], start: parseInt(jsFor[2]), end: jsFor[3] }); continue
    }
    if (pyFor) {
      if (pyFor[3]) {
        ir.push({ type: 'for', variable: pyFor[1], start: parseInt(pyFor[2]), end: pyFor[3] })
      } else {
        ir.push({ type: 'for', variable: pyFor[1], start: 0, end: pyFor[2] })
      }
      continue
    }

    // If/else
    const jsIf = trimmed.match(/if\s*\((.*)\)\s*\{?/)
    const pyIf = trimmed.match(/if\s+(.*):/)
    const jsElseIf = trimmed.match(/\}\s*else\s+if\s*\((.*)\)\s*\{?/)
    const pyElif = trimmed.match(/elif\s+(.*):/)
    const isElse = trimmed.match(/(\}\s*)?else\s*(\{|:)/)

    if (jsElseIf) { ir.push({ type: 'elseif', condition: jsElseIf[1] }); continue }
    if (pyElif) { ir.push({ type: 'elseif', condition: pyElif[1] }); continue }
    if (isElse) { ir.push({ type: 'else' }); continue }
    if (jsIf) { ir.push({ type: 'if', condition: jsIf[1] }); continue }
    if (pyIf) { ir.push({ type: 'if', condition: pyIf[1] }); continue }

    // Function defs
    const jsFn = trimmed.match(/function\s+(\w+)\s*\((.*?)\)\s*\{?/)
    const pyFn = trimmed.match(/def\s+(\w+)\s*\((.*?)\)\s*:/)
    const javaFn = trimmed.match(/(?:public\s+)?(?:static\s+)?(?:void|int|boolean|String)\s+(\w+)\s*\((.*?)\)\s*\{?/)
    if (jsFn) { ir.push({ type: 'function', name: jsFn[1], params: jsFn[2] }); continue }
    if (pyFn) { ir.push({ type: 'function', name: pyFn[1], params: pyFn[2] }); continue }
    if (javaFn) { ir.push({ type: 'function', name: javaFn[1], params: javaFn[2] }); continue }

    // Function calls — rover commands (normalize snake_case to camelCase)
    const fnCall = trimmed.match(/(\w+)\.(\w+)\((.*?)\)\s*;?/)
    if (fnCall) {
      ir.push({ type: 'call', object: fnCall[1], method: normalizeToCamel(fnCall[2]), args: fnCall[3] }); continue
    }

    // Variable declarations
    const jsVar = trimmed.match(/(?:let|const|var)\s+(\w+)\s*=\s*(.+?)\s*;?\s*$/)
    const pyVar = trimmed.match(/^(\w+)\s*=\s*(.+)$/)
    const javaVar = trimmed.match(/(?:int|String|boolean|float|double)\s+(\w+)\s*=\s*(.+?)\s*;?\s*$/)
    if (jsVar) { ir.push({ type: 'variable', name: jsVar[1], value: jsVar[2] }); continue }
    if (javaVar) { ir.push({ type: 'variable', name: javaVar[1], value: javaVar[2] }); continue }
    if (pyVar && !pyVar[0].includes('(')) { ir.push({ type: 'variable', name: pyVar[1], value: pyVar[2] }); continue }

    // Print/log
    const jsLog = trimmed.match(/console\.log\((.*)\)\s*;?/)
    const pyPrint = trimmed.match(/print\((.*)\)/)
    const javaPrint = trimmed.match(/System\.out\.println\((.*)\)\s*;?/)
    const cppPrint = trimmed.match(/std::cout\s*<<\s*(.+)/)
    if (jsLog) { ir.push({ type: 'print', value: jsLog[1] }); continue }
    if (pyPrint) { ir.push({ type: 'print', value: pyPrint[1] }); continue }
    if (javaPrint) { ir.push({ type: 'print', value: javaPrint[1] }); continue }
    if (cppPrint) { ir.push({ type: 'print', value: cppPrint[1].replace(/\s*<<\s*"\\n"\s*;?$/, '').replace(/\s*<<\s*endl\s*;?$/, '') }); continue }

    // Standalone function call (no dot)
    const standaloneCall = trimmed.match(/^(\w+)\((.*?)\)\s*;?\s*$/)
    if (standaloneCall) { ir.push({ type: 'fnCall', name: standaloneCall[1], args: standaloneCall[2] }); continue }

    // Fallthrough — just output as-is
    ir.push({ type: 'raw', text: trimmed })
  }

  return ir
}

function normalizeToCamel(name) {
  return name.replace(/_(\w)/g, (_, c) => c.toUpperCase())
}

function toSnakeCase(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * Generate code from IR for a target language.
 */
function generateCode(ir, targetLang) {
  const lines = []
  let indent = 0

  const pad = () => '    '.repeat(indent)

  // Add boilerplate
  if (targetLang === 'java') {
    lines.push('// Translated to Java')
    lines.push('public class Mission {')
    lines.push('    public static void execute() {')
    indent = 2
  } else if (targetLang === 'cpp') {
    lines.push('// Translated to C++')
    lines.push('#include <iostream>')
    lines.push('')
    lines.push('void execute() {')
    indent = 1
  } else if (targetLang === 'python') {
    lines.push('# Translated to Python')
  } else {
    lines.push('// Translated to JavaScript')
  }

  for (const node of ir) {
    switch (node.type) {
      case 'blank':
        lines.push('')
        break

      case 'comment':
        if (targetLang === 'python') lines.push(`${pad()}# ${node.text}`)
        else lines.push(`${pad()}// ${node.text}`)
        break

      case 'for':
        if (targetLang === 'python') {
          if (node.start === 0) lines.push(`${pad()}for ${node.variable} in range(${node.end}):`)
          else lines.push(`${pad()}for ${node.variable} in range(${node.start}, ${node.end}):`)
          indent++
        } else if (targetLang === 'java' || targetLang === 'cpp') {
          lines.push(`${pad()}for (int ${node.variable} = ${node.start}; ${node.variable} < ${node.end}; ${node.variable}++) {`)
          indent++
        } else {
          lines.push(`${pad()}for (let ${node.variable} = ${node.start}; ${node.variable} < ${node.end}; ${node.variable}++) {`)
          indent++
        }
        break

      case 'if':
        if (targetLang === 'python') {
          lines.push(`${pad()}if ${stripParens(node.condition)}:`)
          indent++
        } else {
          lines.push(`${pad()}if (${stripParens(node.condition)}) {`)
          indent++
        }
        break

      case 'elseif':
        indent = Math.max(0, indent - 1)
        if (targetLang === 'python') {
          lines.push(`${pad()}elif ${stripParens(node.condition)}:`)
          indent++
        } else {
          lines.push(`${pad()}} else if (${stripParens(node.condition)}) {`)
          indent++
        }
        break

      case 'else':
        indent = Math.max(0, indent - 1)
        if (targetLang === 'python') {
          lines.push(`${pad()}else:`)
          indent++
        } else {
          lines.push(`${pad()}} else {`)
          indent++
        }
        break

      case 'function':
        if (targetLang === 'python') {
          lines.push(`${pad()}def ${toSnakeCase(node.name)}(${node.params}):`)
          indent++
        } else if (targetLang === 'java') {
          lines.push(`${pad()}public static void ${node.name}(${node.params}) {`)
          indent++
        } else if (targetLang === 'cpp') {
          lines.push(`${pad()}void ${node.name}(${node.params}) {`)
          indent++
        } else {
          lines.push(`${pad()}function ${node.name}(${node.params}) {`)
          indent++
        }
        break

      case 'call': {
        const method = targetLang === 'python' ? toSnakeCase(node.method) : node.method
        if (targetLang === 'python') {
          lines.push(`${pad()}${node.object}.${method}(${translateArgs(node.args, targetLang)})`)
        } else {
          lines.push(`${pad()}${node.object}.${method}(${translateArgs(node.args, targetLang)});`)
        }
        break
      }

      case 'variable':
        if (targetLang === 'python') {
          lines.push(`${pad()}${node.name} = ${node.value}`)
        } else if (targetLang === 'java') {
          lines.push(`${pad()}var ${node.name} = ${node.value};`)
        } else if (targetLang === 'cpp') {
          lines.push(`${pad()}auto ${node.name} = ${node.value};`)
        } else {
          lines.push(`${pad()}let ${node.name} = ${node.value};`)
        }
        break

      case 'print':
        if (targetLang === 'python') lines.push(`${pad()}print(${node.value})`)
        else if (targetLang === 'java') lines.push(`${pad()}System.out.println(${node.value});`)
        else if (targetLang === 'cpp') lines.push(`${pad()}std::cout << ${node.value} << "\\n";`)
        else lines.push(`${pad()}console.log(${node.value});`)
        break

      case 'fnCall':
        if (targetLang === 'python') {
          lines.push(`${pad()}${toSnakeCase(node.name)}(${node.args})`)
        } else {
          lines.push(`${pad()}${node.name}(${node.args});`)
        }
        break

      case 'raw':
        lines.push(`${pad()}${node.text}`)
        break

      default:
        break
    }
  }

  // Close boilerplate
  if (targetLang === 'java') {
    indent = 1
    lines.push(`${'    '.repeat(indent)}}`)
    lines.push('}')
  } else if (targetLang === 'cpp') {
    lines.push('}')
  }

  return lines.join('\n')
}

function stripParens(cond) {
  if (cond.startsWith('(') && cond.endsWith(')')) return cond.slice(1, -1)
  return cond
}

function translateArgs(args, lang) {
  // Replace Python True/False <-> JS true/false
  if (lang === 'python') {
    return args.replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False')
  }
  return args.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false')
}

/**
 * Main translate function: source code + source lang → all 4 languages
 */
export function translateCode(code, sourceLang) {
  const ir = parseToIR(code, sourceLang)
  const result = {}
  for (const lang of Object.keys(LANG_META)) {
    if (lang === sourceLang) {
      result[lang] = code
    } else {
      result[lang] = generateCode(ir, lang)
    }
  }
  return result
}

/* ——— Syntax Highlighter ——— */
function highlightCode(code, lang) {
  // Process line-by-line for accurate highlighting
  return code.split('\n').map(line => highlightLine(line, lang)).join('\n')
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightLine(line, lang) {
  // First check if the whole line is a comment
  const commentMatch = lang === 'python'
    ? line.match(/^(\s*)(#.*)$/)
    : line.match(/^(\s*)(\/\/.*)$/)
  if (commentMatch) {
    return escapeHtml(commentMatch[1]) + '<span class="tk-comment">' + escapeHtml(commentMatch[2]) + '</span>'
  }

  // Tokenize the line
  const result = []
  let i = 0
  const escaped = escapeHtml(line)

  // Simple approach: highlight the escaped text with non-overlapping replacements
  const kw = {
    javascript: ['for', 'let', 'const', 'var', 'if', 'else', 'function', 'return', 'break', 'continue', 'while', 'new'],
    python: ['for', 'in', 'range', 'if', 'elif', 'else', 'def', 'return', 'break', 'continue', 'while', 'import', 'from', 'class', 'True', 'False', 'None', 'and', 'or', 'not', 'print'],
    java: ['for', 'int', 'if', 'else', 'return', 'break', 'continue', 'while', 'public', 'static', 'void', 'class', 'new', 'var'],
    cpp: ['for', 'int', 'if', 'else', 'return', 'break', 'continue', 'while', 'void', 'auto', 'class', 'new', 'std'],
  }

  const keywords = kw[lang] || kw.javascript

  // Build pattern: strings first, then keywords, then function calls, then numbers
  const stringPattern = `("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`
  const keywordPattern = `\\b(${keywords.join('|')})\\b`
  const funcPattern = `\\b(\\w+)(?=\\()`
  const numPattern = `\\b(\\d+\\.?\\d*)\\b`

  // Combined regex — process in priority order
  const combined = new RegExp(`${stringPattern}|${keywordPattern}|${funcPattern}|${numPattern}`, 'g')

  let html = ''
  let lastIndex = 0

  // Work on the original (non-escaped) line, then escape each part
  const original = line
  let match
  while ((match = combined.exec(original)) !== null) {
    // Add unmatched text before this match
    html += escapeHtml(original.slice(lastIndex, match.index))

    if (match[1] !== undefined) {
      // String
      html += `<span class="tk-string">${escapeHtml(match[0])}</span>`
    } else if (match[2] !== undefined) {
      // Keyword
      html += `<span class="tk-keyword">${escapeHtml(match[0])}</span>`
    } else if (match[3] !== undefined) {
      // Function call
      if (keywords.includes(match[3])) {
        html += `<span class="tk-keyword">${escapeHtml(match[0])}</span>`
      } else {
        html += `<span class="tk-function">${escapeHtml(match[0])}</span>`
      }
    } else if (match[4] !== undefined) {
      // Number
      html += `<span class="tk-number">${escapeHtml(match[0])}</span>`
    }
    lastIndex = combined.lastIndex
  }

  // Add remaining text
  html += escapeHtml(original.slice(lastIndex))
  return html
}

/* ——— React Component ——— */
export default function CodeTranslator({ isOpen, onClose, code, sourceLang }) {
  const [copiedLang, setCopiedLang] = useState(null)

  if (!isOpen) return null

  const translations = translateCode(code, sourceLang)

  function handleCopy(lang) {
    navigator.clipboard.writeText(translations[lang]).then(() => {
      setCopiedLang(lang)
      setTimeout(() => setCopiedLang(null), 2000)
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="translator-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="translator-modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="translator-modal__header">
              <div className="translator-modal__title">
                <div className="translator-modal__title-icon">
                  <Languages size={18} />
                </div>
                <div>
                  Code Translator
                  <div className="translator-modal__subtitle">
                    See how the same logic looks in every language
                  </div>
                </div>
              </div>
              <button className="translator-modal__close" onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            {/* Source indicator */}
            <div className="translator-modal__source">
              <span className="translator-modal__source-badge">
                {LANG_META[sourceLang].icon} {LANG_META[sourceLang].name}
              </span>
              <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="translator-modal__source-label">
                Translated to all languages
              </span>
            </div>

            {/* Code Grid */}
            <div className="translator-grid">
              {Object.entries(LANG_META).map(([lang, meta]) => (
                <div
                  key={lang}
                  className={`translator-panel ${lang === sourceLang ? 'translator-panel--active' : ''}`}
                >
                  <div className="translator-panel__header">
                    <div className="translator-panel__lang">
                      <span className="translator-panel__lang-icon">{meta.icon}</span>
                      <div>
                        <div className="translator-panel__lang-name">{meta.name}</div>
                        <div className="translator-panel__lang-faction">{meta.faction}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {lang === sourceLang && (
                        <span className="translator-panel__current-badge">Source</span>
                      )}
                      <button
                        className={`translator-panel__copy ${copiedLang === lang ? 'translator-panel__copy--copied' : ''}`}
                        onClick={() => handleCopy(lang)}
                      >
                        {copiedLang === lang ? <Check size={10} /> : <Copy size={10} />}
                        {copiedLang === lang ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="translator-panel__code">
                    <pre dangerouslySetInnerHTML={{ __html: highlightCode(translations[lang], lang) }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="translator-modal__footer">
              <div className="translator-modal__hint">
                <Lightbulb size={12} />
                <span>See how different languages express the same logic differently!</span>
              </div>
              <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.75rem' }} onClick={onClose}>
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
