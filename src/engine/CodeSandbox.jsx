import { useRef, useEffect, useCallback, useState } from 'react'
import { buildSandboxHTML } from './gameApi'

/**
 * CodeSandbox — manages the sandboxed iframe for executing user code.
 * Provides an execute(code) function and returns results via callback.
 */
export default function useCodeSandbox() {
  const iframeRef = useRef(null)
  const [ready, setReady] = useState(false)
  const resolverRef = useRef(null)

  // Create the sandbox iframe on mount
  useEffect(() => {
    const iframe = document.createElement('iframe')
    iframe.sandbox = 'allow-scripts'
    iframe.style.display = 'none'
    iframe.srcdoc = buildSandboxHTML()
    document.body.appendChild(iframe)
    iframeRef.current = iframe

    function handleMessage(event) {
      if (event.source !== iframe.contentWindow) return
      if (event.origin !== window.location.origin && event.origin !== 'null') return
      const data = event.data
      if (!data) return

      if (data.type === 'ready') {
        setReady(true)
      }

      if (data.type === 'result' && resolverRef.current) {
        resolverRef.current(data)
        resolverRef.current = null
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe)
      }
    }
  }, [])

  const execute = useCallback((code) => {
    return new Promise((resolve) => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) {
        resolve({
          commands: [],
          logs: [],
          finalState: { x: 60, y: 300, score: 0, color: '#a855f7', signalsSent: 0 },
          error: { message: 'Sandbox not ready. Please try again.' },
        })
        return
      }

      // Set a timeout in case sandbox hangs
      const timeout = setTimeout(() => {
        if (resolverRef.current) {
          resolverRef.current({
            commands: [],
            logs: ['⚠ Execution timed out (5s limit)'],
            finalState: { x: 60, y: 300, score: 0, color: '#a855f7', signalsSent: 0 },
            error: { message: 'Code execution timed out. Try simpler code or fewer loops.' },
          })
          resolverRef.current = null
        }
      }, 5000)

      resolverRef.current = (result) => {
        clearTimeout(timeout)
        resolve(result)
      }

      iframeRef.current.contentWindow.postMessage({ type: 'execute', code }, window.location.origin || '*')
    })
  }, [])

  return { execute, ready }
}
