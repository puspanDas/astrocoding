import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { motion } from 'framer-motion'
import { Play, Code, Layout, LayoutTemplate, Terminal } from 'lucide-react'
import StarField from '../components/StarField'
import './Sandbox.css'

export default function Sandbox() {
  const [activeTab, setActiveTab] = useState('html')
  
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

  const compileCode = () => {
    let documentStr = ''

    if (activeTab === 'python') {
      documentStr = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://pyscript.net/latest/pyscript.css" />
        <script defer src="https://pyscript.net/latest/pyscript.js"></script>
        <style>
          body { background: #111; color: #fff; padding: 20px; font-family: monospace; }
        </style>
      </head>
      <body>
        <script type="py">
${pythonCode}
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
            try {
              ${jsCode}
            } catch (err) {
              console.error("Sandbox Error:", err);
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

  return (
    <div className="sandbox-demo">
      <StarField />
      
      <div className="sandbox-demo__topbar">
        <div className="sandbox-demo__title">
          <Code size={16} className="sandbox-demo__icon" />
          <span>Creator Sandbox</span>
        </div>
        
        <div className="sandbox-demo__controls">
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
              key={activeTab}
              defaultLanguage={getLanguage()}
              defaultValue={getActiveCode()}
              theme="vs-dark"
              onChange={handleEditorChange}
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
    </div>
  )
}
