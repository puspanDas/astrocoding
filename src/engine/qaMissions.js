const qaMissions = [
  {
    id: 'tester-scenario',
    title: 'QA Bug Hunt (Testers Only)',
    description: 'Test the new feature scenario! The code is supposed to reach the destination and send a success signal, but it has bugs. Fix the code to pass the test.',
    difficulty: 3,
    icon: '🐛',
    concepts: ['Debugging', 'Testing'],
    terrain: 'race',
    starterCode: {
      javascript: `// 🐛 QA Bug Hunt (Testers Only)
// The rover needs to move forward 150, boost, then move forward again to reach the finish line.
// But there are bugs in this code! Fix them to pass the test.

rover.moveForward(10); // BUG: distance is too short
rover.thrust(0);       // BUG: not needed
rover.moveForward(20); // BUG: no boost used and distance too short

rover.sendSignal("Oops!"); // BUG: wrong message
`,
      python: `# 🐛 QA Bug Hunt (Testers Only)
# The rover needs to move forward 150, boost, then move forward again to reach the finish line.
# But there are bugs in this code! Fix them to pass the test.

rover.move_forward(10) # BUG: distance is too short
rover.thrust(0)        # BUG: not needed
rover.move_forward(20) # BUG: no boost used and distance too short

rover.send_signal("Oops!") # BUG: wrong message
`,
      java: `// 🐛 QA Bug Hunt (Testers Only)
public class Mission {
    public static void execute() {
        rover.moveForward(10); // BUG: distance is too short
        rover.thrust(0);       // BUG: not needed
        rover.moveForward(20); // BUG: no boost used and distance too short
        
        rover.sendSignal("Oops!"); // BUG: wrong message
    }
}
`,
      cpp: `// 🐛 QA Bug Hunt (Testers Only)
void execute() {
    rover.moveForward(10); // BUG: distance is too short
    rover.thrust(0);       // BUG: not needed
    rover.moveForward(20); // BUG: no boost used and distance too short
    
    rover.sendSignal("Oops!"); // BUG: wrong message
}
`
    },
    hints: [
      '💡 The finish line is at x >= 300.',
      '💡 Change the first moveForward to 150, use rover.boost(), and then moveForward(100).',
      '💡 Send any signal to complete the test.',
    ],
    validateSuccess: (state) => state.x >= 300 && state.signalsSent > 0,
    successMessage: '🎉 Bugs fixed! QA Test Passed!',
    reward: { scrap: 100, cores: 1 },
  },
  {
    id: 'qa-loop-bounds',
    title: 'QA Bug Hunt: Loop Bounds',
    description: 'The loop is supposed to run 5 times to collect all the scattered crystals, but it only runs 2 times! Fix the loop condition to collect at least 5 crystals.',
    difficulty: 2,
    icon: '🔁',
    concepts: ['Debugging', 'Loops'],
    terrain: 'crystals',
    starterCode: {
      javascript: `// 🐛 QA Bug Hunt: Loop Bounds
// We need to collect 5 crystals. 
// But the loop stops too early! Fix the loop condition.

for (let i = 0; i < 2; i++) { // BUG: i < 2 is too small
  rover.moveForward(40);
  rover.collect();
}

rover.sendSignal("Collection complete");
`,
      python: `# 🐛 QA Bug Hunt: Loop Bounds
# We need to collect 5 crystals. 
# But the loop stops too early! Fix the loop condition.

for i in range(2): # BUG: range(2) is too small
    rover.move_forward(40)
    rover.collect()

rover.send_signal("Collection complete")
`,
      java: `// 🐛 QA Bug Hunt: Loop Bounds
public class Mission {
    public static void execute() {
        // BUG: i < 2 is too small
        for (int i = 0; i < 2; i++) {
            rover.moveForward(40);
            rover.collect();
        }
        
        rover.sendSignal("Collection complete");
    }
}
`,
      cpp: `// 🐛 QA Bug Hunt: Loop Bounds
void execute() {
    // BUG: i < 2 is too small
    for (int i = 0; i < 2; i++) {
        rover.moveForward(40);
        rover.collect();
    }
    
    rover.sendSignal("Collection complete");
}
`
    },
    hints: [
      '💡 Change the loop condition so it runs 5 times instead of 2.',
      '💡 In JavaScript/Java/C++, change i < 2 to i < 5.',
      '💡 In Python, change range(2) to range(5).',
    ],
    validateSuccess: (state) => state.score >= 5,
    successMessage: '🎉 Loop fixed! All crystals collected!',
    reward: { scrap: 80, cores: 1 },
  },
  {
    id: 'qa-wrong-direction',
    title: 'QA Bug Hunt: Reversed Logic',
    description: 'The rover is supposed to dodge asteroids. If it gets too high (Y > 200), it should move DOWN. If it gets too low, it should move UP. The logic is reversed! Fix the if/else statements.',
    difficulty: 3,
    icon: '🔀',
    concepts: ['Debugging', 'If/Else', 'Logic'],
    terrain: 'asteroids',
    starterCode: {
      javascript: `// 🐛 QA Bug Hunt: Reversed Logic
// The rover is crashing because the directions are swapped!

rover.moveForward(50);

if (rover.getY() > 200) {
  rover.moveUp(50);   // BUG: Should move DOWN if it's too high!
} else {
  rover.moveDown(50); // BUG: Should move UP if it's too low!
}

rover.moveForward(150);
rover.sendSignal("Dodged it!");
`,
      python: `# 🐛 QA Bug Hunt: Reversed Logic
# The rover is crashing because the directions are swapped!

rover.move_forward(50)

if rover.get_y() > 200:
    rover.move_up(50)   # BUG: Should move DOWN if it's too high!
else:
    rover.move_down(50) # BUG: Should move UP if it's too low!

rover.move_forward(150)
rover.send_signal("Dodged it!")
`,
      java: `// 🐛 QA Bug Hunt: Reversed Logic
public class Mission {
    public static void execute() {
        rover.moveForward(50);
        
        if (rover.getY() > 200) {
            rover.moveUp(50);   // BUG: Should move DOWN if it's too high!
        } else {
            rover.moveDown(50); // BUG: Should move UP if it's too low!
        }
        
        rover.moveForward(150);
        rover.sendSignal("Dodged it!");
    }
}
`,
      cpp: `// 🐛 QA Bug Hunt: Reversed Logic
void execute() {
    rover.moveForward(50);
    
    if (rover.getY() > 200) {
        rover.moveUp(50);   // BUG: Should move DOWN if it's too high!
    } else {
        rover.moveDown(50); // BUG: Should move UP if it's too low!
    }
    
    rover.moveForward(150);
    rover.sendSignal("Dodged it!");
}
`
    },
    hints: [
      '💡 Swap moveUp and moveDown inside the if/else block.',
      '💡 When Y > 200, the rover is high up, so it needs to moveDown to avoid the top asteroids.',
    ],
    validateSuccess: (state) => state.x >= 200 && state.signalsSent > 0,
    successMessage: '🎉 Logic fixed! Asteroids dodged successfully!',
    reward: { scrap: 100, cores: 1 },
  },
  {
    id: 'qa-missing-call',
    title: 'QA Bug Hunt: Missing Call',
    description: 'The developers wrote a great function to activate the hyper-drive, but they forgot to actually call it! The rover is just sitting there. Call the function to reach the destination.',
    difficulty: 2,
    icon: '📞',
    concepts: ['Debugging', 'Functions'],
    terrain: 'race',
    starterCode: {
      javascript: `// 🐛 QA Bug Hunt: Missing Call
// The hyper-drive function is defined, but never executed!

function activateHyperDrive() {
  rover.boost();
  rover.thrust(10);
  rover.moveForward(200);
  rover.sendSignal("Warp speed!");
}

// BUG: You need to call the function here!

`,
      python: `# 🐛 QA Bug Hunt: Missing Call
# The hyper-drive function is defined, but never executed!

def activate_hyper_drive():
    rover.boost()
    rover.thrust(10)
    rover.move_forward(200)
    rover.send_signal("Warp speed!")

# BUG: You need to call the function here!

`,
      java: `// 🐛 QA Bug Hunt: Missing Call
public class Mission {
    public static void activateHyperDrive() {
        rover.boost();
        rover.thrust(10);
        rover.moveForward(200);
        rover.sendSignal("Warp speed!");
    }

    public static void execute() {
        // BUG: You need to call the function here!
        
    }
}
`,
      cpp: `// 🐛 QA Bug Hunt: Missing Call
void activateHyperDrive() {
    rover.boost();
    rover.thrust(10);
    rover.moveForward(200);
    rover.sendSignal("Warp speed!");
}

void execute() {
    // BUG: You need to call the function here!
    
}
`
    },
    hints: [
      '💡 Functions do not run until you call them.',
      '💡 Add activateHyperDrive(); at the bottom of the script (or inside execute() for Java/C++).',
    ],
    validateSuccess: (state) => state.x >= 200 && state.signalsSent > 0,
    successMessage: '🎉 Function called! Hyper-drive activated!',
    reward: { scrap: 80, cores: 1 },
  }
];

export default qaMissions;
