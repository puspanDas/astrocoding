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
        return f'''## ⚙️ AstroCode Transpiler

AstroCode uses a custom regex-based Transpiler (\`transpiler.js\`) to compile Python, Java, and C++ code directly in the browser!
Instead of running heavy WASM engines during the Game Demo, we convert your syntax directly to JavaScript.
For instance, C++ \`void execute() {{...}}\` wrappers are stripped so the internal \`rover.moveForward()\` triggers the Global Game Engine.

**Relevant Engine Code:**
```javascript
{code_ref[:200]}...
```'''

    elif "mission" in question or "game" in question or "play" in question:
        return '''## 🎮 AstroCode Game Demo

**Welcome to the Game Demo!**
1. **Choose a Faction:** (Vanguard, Syndicate)
2. **Write Code:** Your goal is to guide the rover using code like \`rover.moveForward(100)\`.
3. **Language:** You can select JS, Python, Java, or C++ using the floating language selector.
4. **Win:** Execute the code to successfully move your rover out of the crater!'''

    elif "sandbox" in question or "ide" in question or "python" in question:
        return '''## 🛠️ Creator Sandbox IDE

The **Sandbox IDE** allows you to test raw code outside of the Game Environment.
- **Python:** Runs securely via our local \`backend.py\` microservice. Your code is sent to an API and the stdout prints locally!
- **HTML/JS/SQL:** Rendered dynamically in sandboxed iframes.
Type your code and hit "Run Code" to view the immediate Live Output logs.'''

    else:
        # Generic RAG fallback using the fetched codebase snippets
        top_snippet = results[0]['code'] if results else ""
        top_file = results[0]['file'] if results else ""
        return f'''## 🤖 AstroCode AI Inference

I found some related logic inside **{top_file}**:

```javascript
{top_snippet[:400]}...
```

Let me know if you need specific help with missions, the transpiler, or the sandbox IDE!'''
