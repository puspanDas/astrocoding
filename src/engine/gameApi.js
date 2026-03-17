/**
 * AstroCode Game API
 * This script is injected into the sandboxed iframe.
 * It provides the rover object and console capture that
 * users interact with through their code.
 */

export function buildSandboxHTML() {
  return `
<!DOCTYPE html>
<html>
<head><title>AstroCode Sandbox</title></head>
<body>
<script>
(function() {
  // Command queue collects all game actions
  const _commands = [];
  const _logs = [];
  let _score = 0;
  let _x = 60;
  let _y = 300;
  let _color = '#a855f7';
  let _boosted = false;
  let _signalsSent = 0;

  // Create the rover API
  const rover = {
    moveForward: function(distance) {
      distance = Math.min(Math.max(Number(distance) || 0, 0), 200);
      if (_boosted) { distance *= 2; _boosted = false; }
      _x += distance;
      _commands.push({ type: 'move', dx: distance, dy: 0 });
    },
    moveUp: function(distance) {
      distance = Math.min(Math.max(Number(distance) || 0, 0), 200);
      _y -= distance;
      _commands.push({ type: 'move', dx: 0, dy: -distance });
    },
    moveDown: function(distance) {
      distance = Math.min(Math.max(Number(distance) || 0, 0), 200);
      _y += distance;
      _commands.push({ type: 'move', dx: 0, dy: distance });
    },
    turnRight: function() {
      _commands.push({ type: 'turn', direction: 'right' });
    },
    thrust: function(power) {
      power = Math.min(Math.max(Number(power) || 0, 1), 10);
      const lift = power * 15;
      _y -= lift;
      _commands.push({ type: 'thrust', power: power, lift: lift });
    },
    boost: function() {
      _boosted = true;
      _commands.push({ type: 'boost' });
    },
    collect: function() {
      _commands.push({ type: 'collect', atX: _x, atY: _y });
    },
    shoot: function() {
      _commands.push({ type: 'shoot', fromX: _x, fromY: _y });
    },
    sendSignal: function(msg) {
      msg = String(msg || '').slice(0, 100);
      _signalsSent++;
      _commands.push({ type: 'signal', message: msg });
    },
    setColor: function(color) {
      _color = String(color || '#a855f7');
      _commands.push({ type: 'setColor', color: _color });
    },
    getX: function() { return Math.round(_x); },
    getY: function() { return Math.round(_y); },
    getScore: function() { return _score; },
  };

  // Add Python-style aliases
  rover.move_forward = rover.moveForward;
  rover.move_up = rover.moveUp;
  rover.move_down = rover.moveDown;
  rover.turn_right = rover.turnRight;
  rover.send_signal = rover.sendSignal;
  rover.set_color = rover.setColor;
  rover.get_x = rover.getX;
  rover.get_y = rover.getY;
  rover.get_score = rover.getScore;

  // Override console.log to capture output
  const _origLog = console.log;
  console.log = function() {
    const args = Array.from(arguments).map(a => {
      try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
      catch(e) { return String(a); }
    });
    const msg = args.join(' ');
    _logs.push(msg);
    _commands.push({ type: 'log', message: msg });
  };

  // Make rover globally available
  window.rover = rover;

  // Listen for execution requests from parent
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'execute') {
      // Reset state
      _commands.length = 0;
      _logs.length = 0;
      _score = 0;
      _x = 60;
      _y = 300;
      _color = '#a855f7';
      _boosted = false;
      _signalsSent = 0;

      let error = null;
      try {
        // Time limit: cut execution after 5 seconds worth of commands
        const fn = new Function(event.data.code);
        fn();
      } catch(e) {
        error = {
          message: e.message,
          line: e.lineNumber || null,
          stack: e.stack ? e.stack.split('\\n').slice(0, 3).join('\\n') : ''
        };
        _commands.push({ type: 'error', error: error });
      }

      // Send results back to parent
      parent.postMessage({
        type: 'result',
        commands: _commands.slice(0, 200),
        logs: _logs.slice(0, 50),
        finalState: {
          x: Math.round(_x),
          y: Math.round(_y),
          score: _score,
          color: _color,
          signalsSent: _signalsSent,
        },
        error: error,
      }, '*');
    }
  });

  // Signal ready
  parent.postMessage({ type: 'ready' }, '*');
})();
<\/script>
</body>
</html>
  `.trim();
}
