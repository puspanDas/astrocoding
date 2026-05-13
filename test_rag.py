import ai_rag_service

print("Testing query...")
res = ai_rag_service.query_assistant("How does the transpiler work?")
if 'error' in res:
    print("Error:", res['error'])
else:
    print("Success")
