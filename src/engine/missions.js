/**
 * AstroCode Missions System
 * Each mission defines a coding challenge with starter code for multiple languages.
 */

const missions = [
  {
    id: 'escape-crater',
    title: 'Escape the Crater',
    description: 'Your rover is stuck in a deep crater! Write code to make it climb out by moving forward and using thrust.',
    difficulty: 1,
    icon: '🚀',
    concepts: ['Functions', 'Basic Commands'],
    terrain: 'crater',
    starterCode: {
      javascript: `// 🚀 Mission: Escape the Crater!
// Your rover is stuck at the bottom.
// Use rover commands to climb out!

// Move forward to gain momentum
rover.moveForward(50);

// Fire thrusters to climb up!
rover.thrust(5);

// Move more and thrust harder
rover.moveForward(80);
rover.thrust(8);

rover.sendSignal("I'm free!");
`,
      python: `# 🚀 Mission: Escape the Crater!
# Your rover is stuck at the bottom.
# Use rover commands to climb out!

# Move forward to gain momentum
rover.move_forward(50)

# Fire thrusters to climb up!
rover.thrust(5)

# Move more and thrust harder
rover.move_forward(80)
rover.thrust(8)

rover.send_signal("I'm free!")
`,
      java: `// 🚀 Mission: Escape the Crater!
public class Mission {
    public static void main() {
        // Move forward to gain momentum
        rover.moveForward(50);
        
        // Fire thrusters to climb up!
        rover.thrust(5);
        
        // Move more and thrust harder
        rover.moveForward(80);
        rover.thrust(8);
        
        rover.sendSignal("I'm free!");
    }
}
`,
      cpp: `// 🚀 Mission: Escape the Crater!
#include <rover.h>

void execute() {
    // Move forward to gain momentum
    rover.moveForward(50);
    
    // Fire thrusters to climb up!
    rover.thrust(5);
    
    // Move more and thrust harder
    rover.moveForward(80);
    rover.thrust(8);
    
    rover.sendSignal("I'm free!");
}
`
    },
    hints: [
      '💡 Use rover.moveForward(distance) to move the rover horizontally',
      '💡 Use rover.thrust(power) with higher power (5-10) to fly upward',
      '💡 You need to reach altitude > 120 to escape the crater!',
    ],
    validateSuccess: (state) => state.y < 120 && state.signalsSent > 0,
    successMessage: '🎉 Amazing! You escaped the crater! +50 Scrap earned!',
    reward: { scrap: 50, cores: 1 },
  },
  {
    id: 'asteroid-dodge',
    title: 'Asteroid Dodge',
    description: 'Navigate through an asteroid field! Use if/else to check positions and dodge obstacles.',
    difficulty: 2,
    icon: '☄️',
    concepts: ['If/Else', 'Conditions'],
    terrain: 'asteroids',
    starterCode: {
      javascript: `// ☄️ Mission: Dodge the Asteroids!
// Coordinate your movements smoothly

rover.moveForward(60);

if (rover.getY() > 200) {
  rover.moveDown(80);
} else {
  rover.moveUp(80);
}

rover.moveForward(80);

if (rover.getY() < 150) {
  rover.moveUp(100);
}

rover.moveForward(100);
rover.sendSignal("Made it through!");
`,
      python: `# ☄️ Mission: Dodge the Asteroids!
# Coordinate your movements smoothly

rover.move_forward(60)

if rover.get_y() > 200:
    rover.move_down(80)
else:
    rover.move_up(80)

rover.move_forward(80)

if rover.get_y() < 150:
    rover.move_up(100)

rover.move_forward(100)
rover.send_signal("Made it through!")
`,
      java: `// ☄️ Mission: Dodge the Asteroids!
public class Mission {
    public static void execute() {
        rover.moveForward(60);
        
        if (rover.getY() > 200) {
            rover.moveDown(80);
        } else {
            rover.moveUp(80);
        }
        
        rover.moveForward(80);
        
        if (rover.getY() < 150) {
            rover.moveUp(100);
        }
        
        rover.moveForward(100);
        rover.sendSignal("Made it through!");
    }
}
`,
      cpp: `// ☄️ Mission: Dodge the Asteroids!
#include <rover.h>

void execute() {
    rover.moveForward(60);
    
    if (rover.getY() > 200) {
        rover.moveDown(80);
    } else {
        rover.moveUp(80);
    }
    
    rover.moveForward(80);
    
    if (rover.getY() < 150) {
        rover.moveUp(100);
    }
    
    rover.moveForward(100);
    rover.sendSignal("Made it through!");
}
`
    },
    hints: [
      '💡 Use if/else to make decisions based on rover position',
      '💡 rover.getY() tells you how high the rover is',
      '💡 Move up and down to avoid asteroids while moving forward!',
    ],
    validateSuccess: (state) => state.x > 280 && state.signalsSent > 0,
    successMessage: '🎉 Incredible dodging! You navigated the asteroid field! +80 Scrap!',
    reward: { scrap: 80, cores: 1 },
  },
  {
    id: 'resource-collect',
    title: 'Resource Collection',
    description: 'Collect space crystals scattered across the map! Use loops to efficiently gather them all.',
    difficulty: 3,
    icon: '💎',
    concepts: ['For Loops', 'Repetition'],
    terrain: 'crystals',
    starterCode: {
      javascript: `// 💎 Mission: Collect Space Crystals!
// Use a loop to search for crystals!

for (let i = 0; i < 4; i++) {
  rover.moveForward(70);
  rover.collect();
  rover.moveUp(30 * i);
}

let crystals = rover.getScore();
console.log("Crystals collected: " + crystals);
rover.sendSignal("Collection complete!");
`,
      python: `# 💎 Mission: Collect Space Crystals!
# Use a loop to search for crystals!

for i in range(4):
    rover.move_forward(70)
    rover.collect()
    rover.move_up(30 * i)

crystals = rover.get_score()
print("Crystals collected: " + str(crystals))
rover.send_signal("Collection complete!")
`,
      java: `// 💎 Mission: Collect Space Crystals!
public class Mission {
    public static void execute() {
        for (int i = 0; i < 4; i++) {
            rover.moveForward(70);
            rover.collect();
            rover.moveUp(30 * i);
        }
        
        int crystals = rover.getScore();
        System.out.println("Crystals collected: " + crystals);
        rover.sendSignal("Collection complete!");
    }
}
`,
      cpp: `// 💎 Mission: Collect Space Crystals!
#include <iostream>

void execute() {
    for (int i = 0; i < 4; i++) {
        rover.moveForward(70);
        rover.collect();
        rover.moveUp(30 * i);
    }
    
    int crystals = rover.getScore();
    std::cout << "Crystals collected: " << crystals << "\n";
    rover.sendSignal("Collection complete!");
}
`
    },
    hints: [
      '💡 Use a for loop to repeat actions efficiently',
      '💡 rover.collect() picks up any crystal within 60px of the rover',
      '💡 Try moving in different patterns to cover more area!',
    ],
    validateSuccess: (state) => state.score >= 3,
    successMessage: '🎉 Great collecting! You gathered all the crystals! +100 Scrap!',
    reward: { scrap: 100, cores: 2 },
  },
  {
    id: 'space-race',
    title: 'Space Race',
    description: 'Race to the finish line as fast as possible! Write a function to optimize your path.',
    difficulty: 4,
    icon: '🏁',
    concepts: ['Functions', 'Optimization'],
    terrain: 'race',
    starterCode: {
      javascript: `// 🏁 Mission: Win the Space Race!
function racePlan() {
  rover.boost();
  rover.moveForward(100);
  rover.thrust(7);
  rover.moveForward(80);
  rover.boost();
  rover.moveForward(120);
  rover.thrust(10);
  rover.moveForward(100);
}

racePlan();
console.log("Position: " + rover.getX());
rover.sendSignal("Finished!");
`,
      python: `# 🏁 Mission: Win the Space Race!
def race_plan():
    rover.boost()
    rover.move_forward(100)
    rover.thrust(7)
    rover.move_forward(80)
    rover.boost()
    rover.move_forward(120)
    rover.thrust(10)
    rover.move_forward(100)

race_plan()
print("Position: " + str(rover.get_x()))
rover.send_signal("Finished!")
`,
      java: `// 🏁 Mission: Win the Space Race!
public class Mission {
    public static void racePlan() {
        rover.boost();
        rover.moveForward(100);
        rover.thrust(7);
        rover.moveForward(80);
        rover.boost();
        rover.moveForward(120);
        rover.thrust(10);
        rover.moveForward(100);
    }

    public static void execute() {
        racePlan();
        System.out.println("Position: " + rover.getX());
        rover.sendSignal("Finished!");
    }
}
`,
      cpp: `// 🏁 Mission: Win the Space Race!
#include <iostream>

void racePlan() {
    rover.boost();
    rover.moveForward(100);
    rover.thrust(7);
    rover.moveForward(80);
    rover.boost();
    rover.moveForward(120);
    rover.thrust(10);
    rover.moveForward(100);
}

void execute() {
    racePlan();
    std::cout << "Position: " << rover.getX() << "\n";
    rover.sendSignal("Finished!");
}
`
    },
    hints: [
      '💡 rover.boost() doubles the distance of your next moveForward!',
      '💡 Create helper functions to organize your strategy',
      '💡 You need to reach x position >= 400 to finish!',
    ],
    validateSuccess: (state) => state.x >= 400,
    successMessage: '🎉 You won the race! Lightning fast! +120 Scrap!',
    reward: { scrap: 120, cores: 2 },
  },
  {
    id: 'free-play',
    description: 'No rules! Experiment freely with all commands.',
    difficulty: 0,
    icon: '🎮',
    concepts: ['Creativity', 'Exploration'],
    terrain: 'freeplay',
    starterCode: {
      javascript: `// 🎮 Free Play — No rules, just have fun!
rover.setColor("#ff6b6b");

for (let i = 0; i < 5; i++) {
  rover.moveForward(50);
  if (i % 2 === 0) {
    rover.moveUp(60);
  } else {
    rover.moveDown(60);
  }
  rover.shoot();
}

rover.setColor("#ffd93d");
rover.boost();
rover.thrust(10);
rover.sendSignal("Wheee! 🚀");
`,
      python: `# 🎮 Free Play — No rules, just have fun!
rover.set_color("#ff6b6b")

for i in range(5):
    rover.move_forward(50)
    if i % 2 == 0:
        rover.move_up(60)
    else:
        rover.move_down(60)
    rover.shoot()

rover.set_color("#ffd93d")
rover.boost()
rover.thrust(10)
rover.send_signal("Wheee! 🚀")
`,
      java: `// 🎮 Free Play — No rules, just have fun!
public class Mission {
    public static void execute() {
        rover.setColor("#ff6b6b");
        
        for (int i = 0; i < 5; i++) {
            rover.moveForward(50);
            if (i % 2 == 0) {
                rover.moveUp(60);
            } else {
                rover.moveDown(60);
            }
            rover.shoot();
        }
        
        rover.setColor("#ffd93d");
        rover.boost();
        rover.thrust(10);
        rover.sendSignal("Wheee! 🚀");
    }
}
`,
      cpp: `// 🎮 Free Play — No rules, just have fun!
#include <rover.h>

void execute() {
    rover.setColor("#ff6b6b");
    
    for (int i = 0; i < 5; i++) {
        rover.moveForward(50);
        if (i % 2 == 0) {
            rover.moveUp(60);
        } else {
            rover.moveDown(60);
        }
        rover.shoot();
    }
    
    rover.setColor("#ffd93d");
    rover.boost();
    rover.thrust(10);
    rover.sendSignal("Wheee! 🚀");
}
`
    },
    hints: [
      '💡 There are no rules in Free Play — experiment with everything!',
      '💡 Try using loops to create cool patterns',
      '💡 Use rover.setColor() to change the rover color!',
    ],
    validateSuccess: () => true,
    successMessage: '🎉 Awesome creativity! Keep experimenting!',
    reward: { scrap: 25, cores: 0 },
  },
]

export default missions
