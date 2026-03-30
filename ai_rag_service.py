"""
AI RAG (Retrieval-Augmented Generation) Service
Enables natural language queries about the AstroCode framework and gameplay using semantic search.

Architecture:
- Embedding Model: sentence-transformers/all-MiniLM-L6-v2 (384-dim vectors)
- Vector Store: FAISS IndexFlatL2
- Chunking: Line-based generic source chunker
"""

import os
import json
import pickle
import re
import ast
import traceback
import textwrap
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

_model = None
_index = None
_chunks = None

BACKEND_DIR = Path(__file__).parent
INDEX_DIR = BACKEND_DIR / "codebase_index"
INDEX_FILE = INDEX_DIR / "faiss.index"
CHUNKS_FILE = INDEX_DIR / "chunks.pkl"
EMBEDDING_DIM = 384
TOP_K = 3

# We will index core AstroCode files
INDEXABLE_DIRS = [
    BACKEND_DIR / "src" / "engine",
    BACKEND_DIR / "src" / "pages"
]

def _get_model():
    """Lazy load the sentence transformer model."""
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            print("🚀 Loading AI Model (sentence-transformers/all-MiniLM-L6-v2)...")
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except ImportError:
            raise ImportError(
                "sentence-transformers not installed. Run: pip install sentence-transformers"
            )
    return _model

def _get_faiss():
    """Lazy import FAISS."""
    try:
        import faiss
        return faiss
    except ImportError:
        raise ImportError("faiss-cpu not installed. Run: pip install faiss-cpu")

class CodeChunk:
    def __init__(self, content: str, file_path: str, chunk_id: str):
        self.content = content
        self.file_path = file_path
        self.chunk_id = chunk_id

    def to_dict(self):
        return {
            "content": self.content,
            "file_path": self.file_path,
            "chunk_id": self.chunk_id
        }

    @classmethod
    def from_dict(cls, data):
        return cls(**data)

    def get_searchable_text(self):
        return f"File: {self.file_path}\nCode:\n{self.content}"

def _extract_chunks_from_file(file_path: Path) -> List[CodeChunk]:
    chunks = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Basic chunking by breaking into 30-line segments
        lines = content.splitlines()
        chunk_size = 30
        for i in range(0, len(lines), chunk_size):
            chunk_content = "\n".join(lines[i:i+chunk_size])
            chunks.append(CodeChunk(
                content=chunk_content,
                file_path=file_path.name,
                chunk_id=f"{file_path.name}_chunk_{i//chunk_size}"
            ))
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return chunks

def index_codebase() -> Dict[str, Any]:
    global _index, _chunks
    
    faiss = _get_faiss()
    model = _get_model()
    INDEX_DIR.mkdir(exist_ok=True)
    
    all_chunks = []
    files_indexed = []
    
    for d in INDEXABLE_DIRS:
        if d.exists() and d.is_dir():
            for root, _, files in os.walk(d):
                for f in files:
                    if f.endswith('.js') or f.endswith('.jsx') or f.endswith('.md'):
                        p = Path(root) / f
                        chunks = _extract_chunks_from_file(p)
                        all_chunks.extend(chunks)
                        files_indexed.append({"file": f, "chunks": len(chunks)})
                        
    if not all_chunks:
        return {"error": "No files found to index in src/ engine or pages."}
        
    texts = [chunk.get_searchable_text() for chunk in all_chunks]
    embeddings = model.encode(texts, show_progress_bar=False)
    
    index = faiss.IndexFlatL2(EMBEDDING_DIM)
    index.add(embeddings.astype('float32'))
    
    faiss.write_index(index, str(INDEX_FILE))
    with open(CHUNKS_FILE, 'wb') as f:
        pickle.dump([chunk.to_dict() for chunk in all_chunks], f)
        
    _index = index
    _chunks = all_chunks
    return {"success": True, "files_indexed": len(files_indexed), "total_chunks": len(all_chunks)}

def _load_index():
    global _index, _chunks
    if _index is not None and _chunks is not None:
        return _index, _chunks
        
    faiss = _get_faiss()
    if not INDEX_FILE.exists() or not CHUNKS_FILE.exists():
        res = index_codebase()
        if "error" in res:
            raise ValueError(res["error"])
        return _index, _chunks
        
    _index = faiss.read_index(str(INDEX_FILE))
    with open(CHUNKS_FILE, 'rb') as f:
        _chunks = [CodeChunk.from_dict(d) for d in pickle.load(f)]
        
    return _index, _chunks

def query_assistant(question: str) -> Dict[str, Any]:
    try:
        model = _get_model()
        index, chunks = _load_index()
        
        query_embedding = model.encode([question], show_progress_bar=False)
        distances, indices = index.search(query_embedding.astype('float32'), TOP_K)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(chunks):
                chunk = chunks[idx]
                results.append({
                    "file": chunk.file_path,
                    "code": chunk.content
                })
                
        explanation = _generate_topic_explanation(question, results)
        
        return {
            "success": True,
            "query": question,
            "explanation": explanation
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "explanation": "❌ **System Error:** Could not initialize AI engine. Have you installed `pip install sentence-transformers faiss-cpu`?"
        }

def _generate_topic_explanation(question: str, results: List[Dict]) -> str:
    question = question.lower()
    
    # Pre-defined smart replies
    if "transpiler" in question or "c++" in question or "java" in question:
        code_ref = next((r["code"] for r in results if "transpiler" in r["file"].lower()), "")
        return (
            "## ⚙️ AstroCode Transpiler\n\n"
            "AstroCode uses a custom regex-based Transpiler (`transpiler.js`) to compile Python, Java, and C++ code directly in the browser!\n"
            "Instead of running heavy WASM engines during the Game Demo, we convert your syntax directly to JavaScript.\n"
            "For instance, C++ `void execute() {...}` wrappers are stripped so the internal `rover.moveForward()` triggers the Global Game Engine.\n\n"
            "**Relevant Engine Code:**\n"
            "```javascript\n"
            f"{code_ref[:200]}...\n"
            "```"
        )

    elif "mission" in question or "game" in question or "play" in question:
        return (
            "## 🎮 AstroCode Game Demo\n\n"
            "**Welcome to the Game Demo!**\n"
            "1. **Choose a Faction:** (Vanguard, Syndicate)\n"
            "2. **Write Code:** Your goal is to guide the rover using code like `rover.moveForward(100)`.\n"
            "3. **Language:** You can select JS, Python, Java, or C++ using the floating language selector.\n"
            "4. **Win:** Execute the code to successfully move your rover out of the crater!"
        )

    elif "sandbox" in question or "ide" in question or "python" in question:
        return (
            "## 🛠️ Creator Sandbox IDE\n\n"
            "The **Sandbox IDE** allows you to test raw code outside of the Game Environment.\n"
            "- **Python:** Runs securely via our local `backend.py` microservice. Your code is sent to an API and the stdout prints locally!\n"
            "- **HTML/JS/SQL:** Rendered dynamically in sandboxed iframes.\n"
            "Type your code and hit \"Run Code\" to view the immediate Live Output logs."
        )

    else:
        # Generic RAG fallback using the fetched codebase snippets
        top_snippet = results[0]['code'] if results else ""
        top_file = results[0]['file'] if results else ""
        return (
            "## 🤖 AstroCode AI Inference\n\n"
            f"I found some related logic inside **{top_file}**:\n\n"
            "```javascript\n"
            f"{top_snippet[:400]}...\n"
            "```\n\n"
            "Let me know if you need specific help with missions, the transpiler, or the sandbox IDE!"
        )


# ==============================
# AI Code Fix Engine
# ==============================

def fix_code(code: str, language: str, error_msg: str = "") -> Dict[str, Any]:
    """
    Analyze code, detect syntax errors, and return a corrected version with explanation.
    Uses Python AST for Python code, and regex-based heuristics for other languages.
    """
    language = language.lower()

    if language == "python":
        return _fix_python(code, error_msg)
    elif language in ("javascript", "js"):
        return _fix_javascript(code, error_msg)
    elif language == "html":
        return _fix_html(code, error_msg)
    elif language == "css":
        return _fix_css(code, error_msg)
    elif language == "sql":
        return _fix_sql(code, error_msg)
    else:
        return {"fixed": False, "explanation": f"Language '{language}' is not supported for auto-fix yet."}


def _fix_python(code: str, error_msg: str) -> Dict[str, Any]:
    """Use Python's AST to parse, detect, and fix syntax errors."""
    fixes_applied = []
    fixed_code = code

    # Step 1: Try parsing — if it works, there's no syntax error
    try:
        ast.parse(code)
        # No syntax error — but maybe there's a runtime error from the output
        if error_msg:
            return _analyze_python_runtime_error(code, error_msg)
        return {"fixed": False, "explanation": "No syntax errors detected. Your code looks correct!"}
    except SyntaxError as e:
        line_no = e.lineno or 1
        offset = e.offset or 0
        msg = str(e.msg) if e.msg else ""
        lines = fixed_code.splitlines()

        # --- Fix patterns ---

        # Missing colon after if/else/elif/for/while/def/class/try/except/finally/with
        if "expected ':'" in msg or "invalid syntax" in msg:
            if line_no <= len(lines):
                line = lines[line_no - 1]
                stripped = line.rstrip()
                keywords = ['if ', 'elif ', 'else', 'for ', 'while ', 'def ', 'class ', 'try', 'except', 'finally', 'with ']
                for kw in keywords:
                    if stripped.lstrip().startswith(kw) and not stripped.endswith(':'):
                        lines[line_no - 1] = stripped + ':'
                        fixes_applied.append(f"**Line {line_no}:** Added missing `:` after `{kw.strip()}` statement")
                        break

        # Mismatched parentheses / brackets
        if "unexpected EOF" in msg or "was never closed" in msg or "unmatched" in msg:
            open_count = fixed_code.count('(') - fixed_code.count(')')
            if open_count > 0:
                lines.append(')' * open_count)
                fixes_applied.append(f"Added {open_count} missing closing parenthesis `)`")

            bracket_count = fixed_code.count('[') - fixed_code.count(']')
            if bracket_count > 0:
                lines.append(']' * bracket_count)
                fixes_applied.append(f"Added {bracket_count} missing closing bracket `]`")

            brace_count = fixed_code.count('{') - fixed_code.count('}')
            if brace_count > 0:
                lines.append('}' * brace_count)
                fixes_applied.append(f"Added {brace_count} missing closing brace `}}`")

        # Unterminated string literal
        if "unterminated string literal" in msg or "EOL while scanning string literal" in msg:
            if line_no <= len(lines):
                line = lines[line_no - 1]
                single_q = line.count("'")
                double_q = line.count('"')
                if single_q % 2 != 0:
                    lines[line_no - 1] = line + "'"
                    fixes_applied.append(f"**Line {line_no}:** Added missing closing single-quote `'`")
                elif double_q % 2 != 0:
                    lines[line_no - 1] = line + '"'
                    fixes_applied.append(f'**Line {line_no}:** Added missing closing double-quote `"`')

        # print without parentheses (Python 2 style)
        if "Missing parentheses in call to 'print'" in msg or ("invalid syntax" in msg and "print " in (lines[line_no - 1] if line_no <= len(lines) else "")):
            for i, line in enumerate(lines):
                match = re.match(r'^(\s*)print\s+(.+)$', line)
                if match:
                    indent = match.group(1)
                    content = match.group(2)
                    lines[i] = f'{indent}print({content})'
                    fixes_applied.append(f"**Line {i+1}:** Converted `print {content}` to `print({content})` (Python 3 syntax)")

        # IndentationError-like issues with invalid syntax at line start
        if "IndentationError" in msg or "unexpected indent" in msg or "expected an indented block" in msg:
            if line_no <= len(lines):
                fixes_applied.append(f"**Line {line_no}:** Check your indentation. Python requires consistent use of spaces (typically 4 spaces per indent level).")

        fixed_code = '\n'.join(lines)

        # Verify the fix worked
        try:
            ast.parse(fixed_code)
        except SyntaxError:
            # Fix didn't fully resolve it — still return what we have
            if not fixes_applied:
                fixes_applied.append(f"**Line {line_no}:** `{msg}`. Please review this line for errors.")

        explanation_parts = ["## 🔧 AI Auto-Fix Report\n"]
        explanation_parts.append(f"**Error detected:** `{msg}` at **line {line_no}**\n")
        explanation_parts.append("### Changes Applied:")
        for fix in fixes_applied:
            explanation_parts.append(f"- {fix}")
        explanation_parts.append("\n### 💡 Learning Tip:")
        explanation_parts.append(_get_python_tip(msg))

        return {
            "fixed": True,
            "fixed_code": fixed_code,
            "original_error": msg,
            "line": line_no,
            "fixes_applied": fixes_applied,
            "explanation": "\n".join(explanation_parts)
        }


def _analyze_python_runtime_error(code: str, error_msg: str) -> Dict[str, Any]:
    """Analyze runtime errors from Python execution output."""
    explanation_parts = ["## 🔍 Runtime Error Analysis\n"]

    if "NameError" in error_msg:
        match = re.search(r"name '(\w+)' is not defined", error_msg)
        var_name = match.group(1) if match else "unknown"
        explanation_parts.append(f"**Error:** Variable `{var_name}` is used but never defined.\n")
        explanation_parts.append("### 💡 Fix:")
        explanation_parts.append(f"Make sure you define `{var_name}` before using it. For example:")
        explanation_parts.append(f"```python\n{var_name} = 0  # Define the variable first\n```")

    elif "TypeError" in error_msg:
        explanation_parts.append("**Error:** You're using a wrong data type for an operation.\n")
        explanation_parts.append("### 💡 Common Causes:")
        explanation_parts.append("- Mixing strings and numbers: use `str()` or `int()` to convert")
        explanation_parts.append("- Calling something that isn't a function")
        explanation_parts.append("- Wrong number of arguments to a function")

    elif "IndexError" in error_msg:
        explanation_parts.append("**Error:** You tried to access a list index that doesn't exist.\n")
        explanation_parts.append("### 💡 Fix:")
        explanation_parts.append("- Check your list length with `len(my_list)`")
        explanation_parts.append("- Remember: lists are zero-indexed (first item is `[0]`)")

    elif "ZeroDivisionError" in error_msg:
        explanation_parts.append("**Error:** You're dividing by zero!\n")
        explanation_parts.append("### 💡 Fix:")
        explanation_parts.append("Add a check before dividing:\n```python\nif divisor != 0:\n    result = value / divisor\n```")

    elif "ImportError" in error_msg or "ModuleNotFoundError" in error_msg:
        match = re.search(r"No module named '(\w+)'", error_msg)
        mod = match.group(1) if match else "unknown"
        explanation_parts.append(f"**Error:** Module `{mod}` is not installed.\n")
        explanation_parts.append(f"### 💡 Fix:\n```\npip install {mod}\n```")

    else:
        explanation_parts.append(f"**Error Output:**\n```\n{error_msg[:300]}\n```\n")
        explanation_parts.append("### 💡 Tip: Read the last line of the error for the actual issue.")

    return {
        "fixed": False,
        "explanation": "\n".join(explanation_parts),
        "original_error": error_msg
    }


def _get_python_tip(error_msg: str) -> str:
    """Return a learning tip based on the syntax error type."""
    if ":" in error_msg and ("expected" in error_msg or "invalid" in error_msg):
        return "In Python, compound statements like `if`, `for`, `def`, and `class` must end with a colon `:`. This tells Python that an indented block follows."
    if "parenthes" in error_msg or "not closed" in error_msg:
        return "Every opening `(`, `[`, or `{` needs a matching closing bracket. Count your brackets to make sure they match!"
    if "string" in error_msg:
        return "Strings must be enclosed in matching quotes — either `'single'` or `\"double\"`. Make sure you close every string you open."
    if "indent" in error_msg.lower():
        return "Python uses indentation (spaces) to define code blocks. Use exactly 4 spaces per indent level, and be consistent."
    if "print" in error_msg:
        return "In Python 3, `print` is a function and requires parentheses: `print('hello')` instead of `print 'hello'`."
    return "Review the error location carefully. Python error messages usually point to the exact line where the fix is needed."


def _fix_javascript(code: str, error_msg: str) -> Dict[str, Any]:
    """Fix common JavaScript syntax issues."""
    fixes = []
    fixed = code

    # Missing semicolons (basic heuristic)
    lines = fixed.splitlines()
    for i, line in enumerate(lines):
        stripped = line.rstrip()
        if stripped and not stripped.endswith((';', '{', '}', '(', ')', ',', ':', '//', '/*', '*/', '*')) \
           and not stripped.lstrip().startswith(('if', 'else', 'for', 'while', 'function', 'class', '//', '/*', '*', 'return', 'const', 'let', 'var')):
            # Skip if it's a function/block end or already has semicolon
            pass  # We don't auto-add semicolons — too aggressive

    # Missing closing braces
    open_braces = fixed.count('{') - fixed.count('}')
    if open_braces > 0:
        fixed += '\n' + '}' * open_braces
        fixes.append(f"Added {open_braces} missing closing brace(s) `}}`")

    # Missing closing parens
    open_parens = fixed.count('(') - fixed.count(')')
    if open_parens > 0:
        fixed += ')' * open_parens
        fixes.append(f"Added {open_parens} missing closing parenthesis `)`")

    # console.log without parens
    fixed_lines = fixed.splitlines()
    for i, line in enumerate(fixed_lines):
        m = re.match(r'^(\s*)console\.log\s+(.+)$', line)
        if m:
            fixed_lines[i] = f'{m.group(1)}console.log({m.group(2)})'
            fixes.append(f"**Line {i+1}:** Fixed `console.log` syntax")
    fixed = '\n'.join(fixed_lines)

    if not fixes and error_msg:
        return {
            "fixed": False,
            "explanation": (
                "## 🔍 JavaScript Error Analysis\n\n"
                f"**Error:** `{error_msg[:200]}`\n\n"
                "### 💡 Common JS issues:\n"
                "- Missing `}` or `)` to close blocks\n"
                "- Typos in variable or function names\n"
                "- Using `=` instead of `===` for comparison\n"
                "- Forgetting `const`, `let`, or `var` before variables"
            )
        }

    if not fixes:
        return {"fixed": False, "explanation": "No syntax issues detected in your JavaScript code."}

    return {
        "fixed": True,
        "fixed_code": fixed,
        "fixes_applied": fixes,
        "explanation": "## 🔧 JavaScript Auto-Fix\n\n" + "\n".join(f"- {f}" for f in fixes)
    }


def _fix_html(code: str, error_msg: str) -> Dict[str, Any]:
    """Fix common HTML issues."""
    fixes = []
    fixed = code

    # Find unclosed tags
    open_tags = re.findall(r'<(\w+)(?:\s[^>]*)?\s*(?<!/)>', fixed)
    close_tags = re.findall(r'</(\w+)>', fixed)
    self_closing = {'br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'}

    for tag in open_tags:
        if tag.lower() not in self_closing and open_tags.count(tag) > close_tags.count(tag):
            fixed += f'\n</{tag}>'
            fixes.append(f"Added missing closing tag `</{tag}>`")

    if not fixes:
        return {"fixed": False, "explanation": "No obvious HTML issues detected."}

    return {
        "fixed": True,
        "fixed_code": fixed,
        "fixes_applied": fixes,
        "explanation": "## 🔧 HTML Auto-Fix\n\n" + "\n".join(f"- {f}" for f in fixes)
    }


def _fix_css(code: str, error_msg: str) -> Dict[str, Any]:
    """Fix common CSS issues."""
    fixes = []
    fixed = code

    # Missing closing braces
    open_b = fixed.count('{') - fixed.count('}')
    if open_b > 0:
        fixed += '\n}' * open_b
        fixes.append(f"Added {open_b} missing closing brace(s) `}}`")

    # Missing semicolons at end of property lines
    lines = fixed.splitlines()
    for i, line in enumerate(lines):
        stripped = line.strip()
        if ':' in stripped and not stripped.endswith((';', '{', '}', ',', '/*', '*/')) and stripped and not stripped.startswith(('/', '*')):
            lines[i] = line.rstrip() + ';'
            fixes.append(f"**Line {i+1}:** Added missing semicolon `;`")
    fixed = '\n'.join(lines)

    if not fixes:
        return {"fixed": False, "explanation": "No CSS syntax issues detected."}

    return {
        "fixed": True,
        "fixed_code": fixed,
        "fixes_applied": fixes,
        "explanation": "## 🔧 CSS Auto-Fix\n\n" + "\n".join(f"- {f}" for f in fixes) + "\n\n### 💡 Tip:\nEvery CSS property must end with a semicolon `;` and every rule block must have matching `{` `}` braces."
    }


def _fix_sql(code: str, error_msg: str) -> Dict[str, Any]:
    """Fix common SQL issues."""
    fixes = []
    fixed = code

    # Missing semicolons between statements
    statements = re.split(r';\s*', fixed)
    statements = [s.strip() for s in statements if s.strip()]
    fixed = ';\n'.join(statements) + ';'
    if len(statements) > 1:
        fixes.append("Ensured all SQL statements end with `;`")

    if error_msg:
        return {
            "fixed": bool(fixes),
            "fixed_code": fixed if fixes else code,
            "fixes_applied": fixes,
            "explanation": (
                "## 🔍 SQL Error Analysis\n\n"
                f"**Error:** `{error_msg[:200]}`\n\n"
                "### 💡 Common SQL issues:\n"
                "- Missing commas between column names\n"
                "- Table or column names misspelled\n"
                "- Missing `VALUES` keyword in INSERT\n"
                "- Mismatched parentheses in expressions"
            )
        }

    if not fixes:
        return {"fixed": False, "explanation": "No SQL syntax issues detected."}

    return {
        "fixed": True,
        "fixed_code": fixed,
        "fixes_applied": fixes,
        "explanation": "## 🔧 SQL Auto-Fix\n\n" + "\n".join(f"- {f}" for f in fixes)
    }
