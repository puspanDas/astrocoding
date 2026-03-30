import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks'; // Default blocks
import * as En from 'blockly/msg/en'; // English messages
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';

// Apply English messages
Blockly.setLocale(En);

/**
 * BlocklyEditor Component
 * Wraps Google Blockly into a React component.
 *
 * @param {Object} toolbox - The Blockly toolbox configuration (XML string or JSON)
 * @param {string} language - Target language ('javascript' or 'python')
 * @param {Function} onChange - Callback triggered when code changes. Receives (generatedCode)
 */
export default function BlocklyEditor({ toolbox, language = 'javascript', onChange }) {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (blocklyDiv.current && !workspaceRef.current) {
      // Initialize workspace
      workspaceRef.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolbox,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true,
        theme: Blockly.Themes.Dark
      });

      // Handle resize
      const onResize = () => {
        Blockly.svgResize(workspaceRef.current);
      };
      window.addEventListener('resize', onResize);

      // Listen to workspace changes to generate code
      workspaceRef.current.addChangeListener((event) => {
        // Only trigger code generation on events that affect the code
        if (event.type === Blockly.Events.BLOCK_MOVE ||
            event.type === Blockly.Events.BLOCK_CHANGE ||
            event.type === Blockly.Events.BLOCK_DELETE ||
            event.type === Blockly.Events.BLOCK_CREATE ||
            event.type === Blockly.Events.VAR_CREATE ||
            event.type === Blockly.Events.VAR_DELETE ||
            event.type === Blockly.Events.VAR_RENAME) {
          
          let code = '';
          try {
             if (language === 'python') {
               code = pythonGenerator.workspaceToCode(workspaceRef.current);
             } else {
               // default or javascript
               code = javascriptGenerator.workspaceToCode(workspaceRef.current);
             }
          } catch(e) {
             console.error("Blockly generation error:", e);
          }
          if (onChange) {
            onChange(code);
          }
        }
      });

      return () => {
        window.removeEventListener('resize', onResize);
        if (workspaceRef.current) {
          workspaceRef.current.dispose();
          workspaceRef.current = null;
        }
      };
    }
  }, [toolbox]); // Re-initialize only if toolbox object ref changes completely

  // Handle language change by regenerating code
  useEffect(() => {
     if (workspaceRef.current) {
        let code = '';
        try {
           if (language === 'python') {
             code = pythonGenerator.workspaceToCode(workspaceRef.current);
           } else {
             code = javascriptGenerator.workspaceToCode(workspaceRef.current);
           }
        } catch(e) {}
        if (onChange) onChange(code);
     }
  }, [language]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div 
        ref={blocklyDiv} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
      />
    </div>
  );
}
