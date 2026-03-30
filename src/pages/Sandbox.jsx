import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Code, Layout, LayoutTemplate, Terminal, Wand2, Check, X, AlertTriangle, Sparkles, Copy } from 'lucide-react'
import StarField from '../components/StarField'
import AIAssistant from '../components/AIAssistant'
import './Sandbox.css'

export default function Sandbox() {
  const [activeTab, setActiveTab] = useState('html')
  const editorRef = useRef(null)
  
  const [htmlCode, setHtmlCode] = useState('<div class="box">\n  <h1>Hello AstroCode!</h1>\n  <p>Build your own cosmic creations.</p>\n  <button onclick="changeColor()">Activate Sensors</button>\n</div>')
  
  const [cssCode, setCssCode] = useState(`.box {
  background: rgba(40, 42, 54, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  color: #fff;
  text-align: center;
  font-family: system-ui, sans-serif;
  margin-top: 50px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  transition: all 0.3s ease;
}

h1 {
  color: #a78bfa;
  margin-bottom: 0.5rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #a78bfa;
  color: #000;
  border: none;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.05);
}
`)

  const [jsCode, setJsCode] = useState(`console.log("Welcome to AstroCode Sandbox!");

function changeColor() {
  const box = document.querySelector('.box');
  const colors = ['rgba(40, 42, 54, 0.8)', 'rgba(56, 189, 248, 0.2)', 'rgba(232, 121, 249, 0.2)'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  box.style.background = randomColor;
}
`)

  const [pythonCode, setPythonCode] = useState(`print("Hello from Python!")
x = [1, 2, 3, 4]
print(f"List squared: {[i*i for i in x]}")`)

  const [sqlCode, setSqlCode] = useState(`CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie');
SELECT * FROM users;`)
  
  const [srcDoc, setSrcDoc] = useState('')
  const [autoRun, setAutoRun] = useState(false)
  
  // AI Fix State
  const [aiFixResult, setAiFixResult] = useState(null)
  const [isFixing, setIsFixing] = useState(false)
  const [lastError, setLastError] = useState(null)

  // Listen for error messages from the preview iframe
  useEffect(() => {
    function handleMessage(event) {
      if (event.data && event.data.type === 'sandbox-error') {
        setLastError(event.data.error)
        requestAiFix(getActiveCode(), getLanguage(), event.data.error)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [activeTab, htmlCode, cssCode, jsCode, pythonCode, sqlCode])

  // Request AI fix from backend
  async function requestAiFix(code, language, errorMsg) {
    setIsFixing(true)
    try {
      const res = await fetch('http://localhost:8000/api/agent/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, error: errorMsg || '' })
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setAiFixResult(data)
    } catch (err) {
      setAiFixResult({
        fixed: false,
        explanation: '❌ Could not reach AI backend. Make sure `python backend.py` is running.'
      })
    }
    setIsFixing(false)
  }

  // Apply the AI fix to the editor
  function applyFix() {
    if (!aiFixResult || !aiFixResult.fixed_code) return
    const fixedCode = aiFixResult.fixed_code

    if (activeTab === 'html') setHtmlCode(fixedCode)
    if (activeTab === 'css') setCssCode(fixedCode)
    if (activeTab === 'js') setJsCode(fixedCode)
    if (activeTab === 'python') setPythonCode(fixedCode)
    if (activeTab === 'sql') setSqlCode(fixedCode)

    setAiFixResult(null)
    // Re-compile after a tick to show the fix
    setTimeout(() => compileCode(), 100)
  }

  // Manual "Check My Code" button
  function handleCheckCode() {
    const code = getActiveCode()
    const lang = getLanguage()
    requestAiFix(code, lang, lastError || '')
  }

  const compileCode = () => {
    let documentStr = ''

    if (activeTab === 'python') {
      documentStr = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { background: #111; color: #fff; padding: 16px 20px; font-family: 'Fira Code', monospace; white-space: pre-wrap; font-size: 14px; margin: 0; }
          .system { color: #a855f7; font-style: italic; }
          .error { color: #ef4444; }
        </style>
      </head>
      <body>
        <div id="output"><span class="system">Initializing local Python engine...</span></div>
        <textarea id="userCode" style="display: none;">${pythonCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        <script>
          async function executeCode() {
            const code = document.getElementById('userCode').value;
            const outputEl = document.getElementById('output');
            outputEl.innerHTML = '<span class="system">Executing on local Python backend (port: 8000)...</span>';
            
            try {
              const res = await fetch('http://localhost:8000/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code })
              });
              
              if (!res.ok) {
                 const errData = await res.json();
                 throw new Error(errData.error || 'Server returned HTTP ' + res.status);
              }
              const data = await res.json();
              const output = data.output || '';
              
              // Check for errors in Python output
              if (output.includes('Traceback') || output.includes('Error:') || output.includes('SyntaxError')) {
                outputEl.innerHTML = '<span class="error">' + output.replace(/</g, '&lt;') + '</span>';
                window.parent.postMessage({ type: 'sandbox-error', error: output }, '*');
              } else {
                outputEl.textContent = output || '✨ Program executed successfully (no output).';
              }
            } catch (err) {
              outputEl.innerHTML = '<span class="error">❌ Backend Connection Failed.\\nError: ' + err.message + '</span>';
              window.parent.postMessage({ type: 'sandbox-error', error: err.message }, '*');
            }
          }
          executeCode();
        </script>
      </body>
      </html>
      `
    } else if (activeTab === 'sql') {
      documentStr = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"></script>
        <style>
          body { background: #111; color: #fff; padding: 20px; font-family: sans-serif; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th, td { border: 1px solid #444; padding: 8px; text-align: left; }
          th { background: #222; }
          .error { color: #ff5555; }
        </style>
      </head>
      <body>
        <div id="output">Initializing SQLite...</div>
        <script>
          async function initSql() {
            try {
              const SQL = await initSqlJs({ locateFile: file => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/' + file });
              const db = new SQL.Database();
              const sqlString = \`${sqlCode.replace(/`/g, '\\`')}\`;
              
              document.getElementById('output').innerHTML = 'Executing SQL...';
              
              const res = db.exec(sqlString);
              
              if (res.length === 0) {
                 document.getElementById('output').innerHTML = 'Query executed successfully (no results).';
                 return;
              }
              
              let html = '';
              res.forEach(result => {
                html += '<table><thead><tr>';
                result.columns.forEach(col => { html += '<th>' + col + '</th>'; });
                html += '</tr></thead><tbody>';
                result.values.forEach(row => {
                  html += '<tr>';
                  row.forEach(val => { html += '<td>' + val + '</td>'; });
                  html += '</tr>';
                });
                html += '</tbody></table><br/>';
              });
              
              document.getElementById('output').innerHTML = html;
            } catch (err) {
              document.getElementById('output').innerHTML = '<div class="error">' + err.message + '</div>';
              window.parent.postMessage({ type: 'sandbox-error', error: err.message }, '*');
            }
          }
          initSql();
        </script>
      </body>
      </html>
      `
    } else {
      // HTML / CSS / JS Mode
      documentStr = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              box-sizing: border-box; 
              display: flex;
              justify-content: center;
              align-items: flex-start;
              min-height: 100vh;
              background: #111;
            }
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            window.onerror = function(msg, url, line) {
              window.parent.postMessage({ type: 'sandbox-error', error: msg + ' (line ' + line + ')' }, '*');
            };
            try {
              ${jsCode}
            } catch (err) {
              console.error("Sandbox Error:", err);
              window.parent.postMessage({ type: 'sandbox-error', error: err.toString() }, '*');
            }
          </script>
        </body>
        </html>
      `
    }
    setSrcDoc(documentStr)
  }

  // Initial compile
  useEffect(() => {
    compileCode()
    setAiFixResult(null)
    setLastError(null)
  }, [activeTab]) // Re-run when switching to Python/SQL to load correct runners

  // Auto-run when code changes if enabled
  useEffect(() => {
    if (autoRun) {
      const timeout = setTimeout(() => {
        compileCode()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [htmlCode, cssCode, jsCode, pythonCode, sqlCode, autoRun]) // eslint-disable-line

  const getLanguage = () => {
    if (activeTab === 'html') return 'html'
    if (activeTab === 'css') return 'css'
    if (activeTab === 'js') return 'javascript'
    if (activeTab === 'python') return 'python'
    if (activeTab === 'sql') return 'sql'
    return 'javascript'
  }

  const getActiveCode = () => {
    if (activeTab === 'html') return htmlCode
    if (activeTab === 'css') return cssCode
    if (activeTab === 'js') return jsCode
    if (activeTab === 'python') return pythonCode
    if (activeTab === 'sql') return sqlCode
    return ''
  }

  const handleEditorChange = (value) => {
    if (activeTab === 'html') setHtmlCode(value || '')
    if (activeTab === 'css') setCssCode(value || '')
    if (activeTab === 'js') setJsCode(value || '')
    if (activeTab === 'python') setPythonCode(value || '')
    if (activeTab === 'sql') setSqlCode(value || '')
  }

  // Simple markdown renderer for AI explanations
  function renderExplanation(text) {
    if (!text) return null
    const parts = text.split(/(```[\s\S]*?```|\*\*.*?\*\*|`[^`]+`)/g)
    return parts.map((p, i) => {
      if (p.startsWith('```') && p.endsWith('```')) {
        return <pre key={i} className="ai-fix__pre"><code>{p.slice(3, -3).replace(/^[\w]*\n/, '')}</code></pre>
      }
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={i}>{p.slice(2, -2)}</strong>
      }
      if (p.startsWith('`') && p.endsWith('`')) {
        return <code key={i} className="ai-fix__inline-code">{p.slice(1, -1)}</code>
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br/>').replace(/^## (.+)/gm, '<h3>$1</h3>').replace(/^### (.+)/gm, '<h4>$1</h4>').replace(/^- (.+)/gm, '• $1<br/>') }} />
    })
  }

  return (
    <div className="sandbox-demo">
      <StarField />
      
      <div className="sandbox-demo__topbar">
        <div className="sandbox-demo__title">
          <Code size={16} className="sandbox-demo__icon" />
          <span>Creator Sandbox</span>
        </div>
        
        <div className="sandbox-demo__controls">
          <button
            className="ai-check-btn"
            onClick={handleCheckCode}
            disabled={isFixing}
            title="AI Check: Analyze your code for errors"
          >
            <Wand2 size={14} />
            <span>{isFixing ? 'Analyzing...' : 'AI Check'}</span>
          </button>
          <label className="autorun-toggle">
            <input 
              type="checkbox" 
              checked={autoRun} 
              onChange={(e) => setAutoRun(e.target.checked)} 
            />
            <span>Auto-Run Preview</span>
          </label>
          <button 
            className="btn-primary sandbox-run-btn"
            onClick={compileCode}
          >
            <Play size={14} />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      <div className="sandbox-demo__main">
        {/* Editor Panel */}
        <div className="sandbox-demo__editor-panel">
          <div className="editor-tabs">
            <button 
              className={`editor-tab ${activeTab === 'html' ? 'active' : ''}`}
              onClick={() => setActiveTab('html')}
            >
              <Layout size={14} /> HTML
            </button>
            <button 
              className={`editor-tab ${activeTab === 'css' ? 'active' : ''}`}
              onClick={() => setActiveTab('css')}
            >
              <LayoutTemplate size={14} /> CSS
            </button>
            <button 
              className={`editor-tab ${activeTab === 'js' ? 'active' : ''}`}
              onClick={() => setActiveTab('js')}
            >
              <Terminal size={14} /> JS
            </button>
            <button 
              className={`editor-tab ${activeTab === 'python' ? 'active' : ''}`}
              onClick={() => setActiveTab('python')}
            >
              <Code size={14} /> Python
            </button>
            <button 
              className={`editor-tab ${activeTab === 'sql' ? 'active' : ''}`}
              onClick={() => setActiveTab('sql')}
            >
              <Layout size={14} /> SQL
            </button>
          </div>
          
          <div className="editor-body">
            <Editor
              height="100%"
              key={activeTab + '-' + (aiFixResult?.fixed_code ? 'fixed' : 'original')}
              defaultLanguage={getLanguage()}
              defaultValue={getActiveCode()}
              theme="vs-dark"
              onChange={handleEditorChange}
              onMount={(editor) => { editorRef.current = editor }}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                wordWrap: 'on',
                formatOnPaste: true,
              }}
            />
          </div>

          {/* AI Fix Suggestion Panel */}
          <AnimatePresence>
            {(aiFixResult || isFixing) && (
              <motion.div
                className="ai-fix-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isFixing ? (
                  <div className="ai-fix-panel__loading">
                    <Sparkles size={16} className="ai-fix-spin" />
                    <span>AI is analyzing your code...</span>
                  </div>
                ) : aiFixResult && (
                  <>
                    <div className="ai-fix-panel__header">
                      <div className="ai-fix-panel__title">
                        {aiFixResult.fixed ? (
                          <><Wand2 size={14} /> <span>AI Auto-Fix Available</span></>
                        ) : (
                          <><AlertTriangle size={14} /> <span>AI Analysis</span></>
                        )}
                      </div>
                      <div className="ai-fix-panel__actions">
                        {aiFixResult.fixed && aiFixResult.fixed_code && (
                          <button className="ai-fix-btn ai-fix-btn--apply" onClick={applyFix}>
                            <Check size={12} /> Apply Fix
                          </button>
                        )}
                        <button className="ai-fix-btn ai-fix-btn--dismiss" onClick={() => setAiFixResult(null)}>
                          <X size={12} /> Dismiss
                        </button>
                      </div>
                    </div>
                    <div className="ai-fix-panel__body">
                      {renderExplanation(aiFixResult.explanation)}
                    </div>
                    {aiFixResult.fixed_code && (
                      <div className="ai-fix-panel__code-preview">
                        <div className="ai-fix-panel__code-label">Corrected Code:</div>
                        <pre className="ai-fix-panel__code">{aiFixResult.fixed_code}</pre>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview Panel */}
        <div className="sandbox-demo__preview-panel">
          <div className="preview-header">
            <span>Live Output</span>
          </div>
          <div className="preview-container">
            <iframe
              title="sandbox-preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-same-origin"
              className="sandbox-iframe"
            />
          </div>
        </div>
      </div>
      <AIAssistant />
    </div>
  )
}
