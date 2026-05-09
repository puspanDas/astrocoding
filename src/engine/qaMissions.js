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
  },
  {
    id: 'qa-boundary-value',
    title: 'QA Bug Hunt: Off-By-One',
    description: 'Boundary Value Analysis: The rover must stop exactly at the cliff edge (X=360). The loop runs one time too many and the rover falls off! Fix the boundary condition.',
    difficulty: 3,
    icon: '📏',
    concepts: ['Debugging', 'Boundary Values'],
    terrain: 'asteroids',
    starterCode: {
      javascript: `// 🐛 QA Bug Hunt: Off-By-One
// The cliff is exactly at X=360. We start at X=60 and move 50 units per step.
// We need exactly 6 steps. The loop below runs 7 times! Fix it!

for (let i = 0; i <= 6; i++) { // BUG: i <= 6 runs 7 times
  rover.moveForward(50);
}

rover.sendSignal("Safe!");
`,
      python: `# 🐛 QA Bug Hunt: Off-By-One
# The cliff is exactly at X=360. We start at X=60 and move 50 units per step.
# We need exactly 6 steps. The loop below runs 7 times! Fix it!

for i in range(7): # BUG: range(7) runs 7 times
    rover.move_forward(50)

rover.send_signal("Safe!")
`,
      java: `// 🐛 QA Bug Hunt: Off-By-One
public class Mission {
    public static void execute() {
        // BUG: i <= 6 runs 7 times
        for (int i = 0; i <= 6; i++) {
            rover.moveForward(50);
        }
        
        rover.sendSignal("Safe!");
    }
}
`,
      cpp: `// 🐛 QA Bug Hunt: Off-By-One
void execute() {
    // BUG: i <= 6 runs 7 times
    for (int i = 0; i <= 6; i++) {
        rover.moveForward(50);
    }
    
    rover.sendSignal("Safe!");
}
`
    },
    hints: [
      '💡 The loop needs to run exactly 6 times.',
      '💡 In JS/Java/C++, change i <= 6 to i < 6.',
      '💡 In Python, change range(7) to range(6).',
    ],
    validateSuccess: (state) => state.x === 360 && state.signalsSent > 0,
    successMessage: '🎉 Perfect boundary! You avoided the off-by-one error.',
    reward: { scrap: 100, cores: 1 },
  },
  {
    id: 'qa-edge-case',
    title: 'QA Bug Hunt: State Assumptions',
    description: 'Edge Case Testing: The developer assumed the rover always starts at X=0! But in this test environment, the rover starts at X=60. The rover needs to reach exactly X=200. Fix the logic.',
    difficulty: 4,
    icon: '🕳️',
    concepts: ['Debugging', 'Edge Cases', 'State Variables'],
    terrain: 'race',
    starterCode: {
      javascript: `// 🐛 QA Bug Hunt: State Assumptions
// We need to reach exactly X=200.
// The code assumes we started at 0. Fix the math so it calculates the correct distance!

let targetX = 200;
let currentX = 0; // BUG: We actually start at 60! You can use rover.getX()

let distanceToMove = targetX - currentX;
rover.moveForward(distanceToMove);

rover.sendSignal("Arrived!");
`,
      python: `# 🐛 QA Bug Hunt: State Assumptions
# We need to reach exactly X=200.
# The code assumes we started at 0. Fix the math so it calculates the correct distance!

target_x = 200
current_x = 0 # BUG: We actually start at 60! You can use rover.get_x()

distance_to_move = target_x - current_x
rover.move_forward(distance_to_move)

rover.send_signal("Arrived!")
`,
      java: `// 🐛 QA Bug Hunt: State Assumptions
public class Mission {
    public static void execute() {
        int targetX = 200;
        int currentX = 0; // BUG: We actually start at 60! Use rover.getX()
        
        int distanceToMove = targetX - currentX;
        rover.moveForward(distanceToMove);
        
        rover.sendSignal("Arrived!");
    }
}
`,
      cpp: `// 🐛 QA Bug Hunt: State Assumptions
void execute() {
    int targetX = 200;
    int currentX = 0; // BUG: We actually start at 60! Use rover.getX()
    
    int distanceToMove = targetX - currentX;
    rover.moveForward(distanceToMove);
    
    rover.sendSignal("Arrived!");
}
`
    },
    hints: [
      '💡 Never hardcode the starting position if a getter method exists.',
      '💡 Replace currentX = 0 with currentX = rover.getX().',
    ],
    validateSuccess: (state) => state.x === 200 && state.signalsSent > 0,
    successMessage: '🎉 Edge case handled! Using getters instead of hardcoded assumptions prevents bugs.',
    reward: { scrap: 110, cores: 1 },
  },
  {
    id: 'qa-logical-operator',
    title: 'QA Bug Hunt: Wrong Operator',
    description: 'The rover is supposed to perform an emergency stop (thrust) if X is greater than 100 OR Y is less than 200. The code uses AND (&&) instead of OR (||), causing a crash!',
    difficulty: 3,
    icon: '🔀',
    concepts: ['Debugging', 'Boolean Logic'],
    terrain: 'asteroids',
    starterCode: {
      javascript: `// 🐛 QA Bug Hunt: Wrong Operator
// We need to thrust if X > 100 OR Y < 200. 

rover.moveForward(20);
rover.moveUp(150); // Now Y is 150 (300 - 150)

// BUG: It uses && instead of || 
if (rover.getX() > 100 && rover.getY() < 200) {
  rover.thrust(10);
  rover.sendSignal("Emergency Stop!");
}

rover.moveForward(100);
`,
      python: `# 🐛 QA Bug Hunt: Wrong Operator
# We need to thrust if X > 100 OR Y < 200. 

rover.move_forward(20)
rover.move_up(150) # Now Y is 150 (300 - 150)

# BUG: It uses and instead of or
if rover.get_x() > 100 and rover.get_y() < 200:
    rover.thrust(10)
    rover.send_signal("Emergency Stop!")

rover.move_forward(100)
`,
      java: `// 🐛 QA Bug Hunt: Wrong Operator
public class Mission {
    public static void execute() {
        rover.moveForward(20);
        rover.moveUp(150);
        
        // BUG: It uses && instead of ||
        if (rover.getX() > 100 && rover.getY() < 200) {
            rover.thrust(10);
            rover.sendSignal("Emergency Stop!");
        }
        
        rover.moveForward(100);
    }
}
`,
      cpp: `// 🐛 QA Bug Hunt: Wrong Operator
void execute() {
    rover.moveForward(20);
    rover.moveUp(150);
    
    // BUG: It uses && instead of ||
    if (rover.getX() > 100 && rover.getY() < 200) {
        rover.thrust(10);
        rover.sendSignal("Emergency Stop!");
    }
    
    rover.moveForward(100);
}
`
    },
    hints: [
      '💡 The condition is too strict. We want to stop if EITHER condition is true.',
      '💡 In JS/Java/C++, change && to ||.',
      '💡 In Python, change and to or.',
    ],
    validateSuccess: (state) => state.y === 0 && state.signalsSent > 0,
    successMessage: '🎉 Logic fixed! Boolean operators are a very common source of bugs.',
    reward: { scrap: 90, cores: 1 },
  }
];

export default qaMissions;
