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
    id: 'alien-rescue',
    title: 'Alien Rescue Mission',
    description: 'Rescue stranded aliens by navigating through obstacles and collecting them all!',
    difficulty: 3,
    icon: '👽',
    concepts: ['Loops', 'Conditions', 'Problem Solving'],
    terrain: 'crystals',
    starterCode: {
      javascript: `// 👽 Mission: Rescue Stranded Aliens!
// Navigate and collect all aliens

for (let i = 0; i < 3; i++) {
  rover.moveForward(80);
  
  if (rover.getY() < 200) {
    rover.moveUp(50);
  }
  
  rover.collect();
  rover.sendSignal("Alien rescued!");
}

rover.boost();
rover.moveForward(100);
rover.collect();
console.log("Mission complete!");
`,
      python: `# 👽 Mission: Rescue Stranded Aliens!
# Navigate and collect all aliens

for i in range(3):
    rover.move_forward(80)
    
    if rover.get_y() < 200:
        rover.move_up(50)
    
    rover.collect()
    rover.send_signal("Alien rescued!")

rover.boost()
rover.move_forward(100)
rover.collect()
print("Mission complete!")
`,
      java: `// 👽 Mission: Rescue Stranded Aliens!
public class Mission {
    public static void execute() {
        for (int i = 0; i < 3; i++) {
            rover.moveForward(80);
            
            if (rover.getY() < 200) {
                rover.moveUp(50);
            }
            
            rover.collect();
            rover.sendSignal("Alien rescued!");
        }
        
        rover.boost();
        rover.moveForward(100);
        rover.collect();
        System.out.println("Mission complete!");
    }
}
`,
      cpp: `// 👽 Mission: Rescue Stranded Aliens!
#include <iostream>

void execute() {
    for (int i = 0; i < 3; i++) {
        rover.moveForward(80);
        
        if (rover.getY() < 200) {
            rover.moveUp(50);
        }
        
        rover.collect();
        rover.sendSignal("Alien rescued!");
    }
    
    rover.boost();
    rover.moveForward(100);
    rover.collect();
    std::cout << "Mission complete!\n";
}
`
    },
    hints: [
      '💡 Use loops to efficiently rescue multiple aliens',
      '💡 Check your position and adjust your path',
      '💡 Collect at least 3 aliens to complete the mission!',
    ],
    validateSuccess: (state) => state.score >= 3 && state.signalsSent >= 3,
    successMessage: '🎉 All aliens rescued! You\'re a hero! +150 Scrap!',
    reward: { scrap: 150, cores: 2 },
  },
  {
    id: 'laser-defense',
    title: 'Laser Defense System',
    description: 'Defend the base by shooting incoming threats while moving strategically!',
    difficulty: 4,
    icon: '🔫',
    concepts: ['Functions', 'Loops', 'Timing'],
    terrain: 'asteroids',
    starterCode: {
      javascript: `// 🔫 Mission: Defend the Base!
function defendPattern() {
  rover.shoot();
  rover.moveForward(40);
  rover.shoot();
  rover.moveUp(30);
}

for (let wave = 0; wave < 4; wave++) {
  defendPattern();
  rover.shoot();
}

rover.boost();
rover.shoot();
rover.sendSignal("Base secured!");
`,
      python: `# 🔫 Mission: Defend the Base!
def defend_pattern():
    rover.shoot()
    rover.move_forward(40)
    rover.shoot()
    rover.move_up(30)

for wave in range(4):
    defend_pattern()
    rover.shoot()

rover.boost()
rover.shoot()
rover.send_signal("Base secured!")
`,
      java: `// 🔫 Mission: Defend the Base!
public class Mission {
    public static void defendPattern() {
        rover.shoot();
        rover.moveForward(40);
        rover.shoot();
        rover.moveUp(30);
    }
    
    public static void execute() {
        for (int wave = 0; wave < 4; wave++) {
            defendPattern();
            rover.shoot();
        }
        
        rover.boost();
        rover.shoot();
        rover.sendSignal("Base secured!");
    }
}
`,
      cpp: `// 🔫 Mission: Defend the Base!
void defendPattern() {
    rover.shoot();
    rover.moveForward(40);
    rover.shoot();
    rover.moveUp(30);
}

void execute() {
    for (int wave = 0; wave < 4; wave++) {
        defendPattern();
        rover.shoot();
    }
    
    rover.boost();
    rover.shoot();
    rover.sendSignal("Base secured!");
}
`
    },
    hints: [
      '💡 Create defense patterns using functions',
      '💡 Shoot frequently while moving',
      '💡 Use loops to handle multiple waves of threats!',
    ],
    validateSuccess: (state) => state.x > 200 && state.signalsSent > 0,
    successMessage: '🎉 Base defended successfully! +180 Scrap!',
    reward: { scrap: 180, cores: 3 },
  },
  {
    id: 'treasure-hunt',
    title: 'Cosmic Treasure Hunt',
    description: 'Follow the treasure map and collect rare cosmic artifacts hidden across space!',
    difficulty: 5,
    icon: '🗺️',
    concepts: ['Advanced Loops', 'Optimization', 'Strategy'],
    terrain: 'crystals',
    starterCode: {
      javascript: `// 🗺️ Mission: Find the Cosmic Treasure!
let treasures = 0;

for (let x = 0; x < 3; x++) {
  rover.moveForward(90);
  
  for (let y = 0; y < 2; y++) {
    rover.moveUp(60);
    rover.collect();
    treasures++;
  }
  
  rover.moveDown(120);
}

rover.boost();
rover.moveForward(150);
rover.collect();
console.log("Treasures found: " + treasures);
rover.sendSignal("Treasure secured!");
`,
      python: `# 🗺️ Mission: Find the Cosmic Treasure!
treasures = 0

for x in range(3):
    rover.move_forward(90)
    
    for y in range(2):
        rover.move_up(60)
        rover.collect()
        treasures += 1
    
    rover.move_down(120)

rover.boost()
rover.move_forward(150)
rover.collect()
print("Treasures found: " + str(treasures))
rover.send_signal("Treasure secured!")
`,
      java: `// 🗺️ Mission: Find the Cosmic Treasure!
public class Mission {
    public static void execute() {
        int treasures = 0;
        
        for (int x = 0; x < 3; x++) {
            rover.moveForward(90);
            
            for (int y = 0; y < 2; y++) {
                rover.moveUp(60);
                rover.collect();
                treasures++;
            }
            
            rover.moveDown(120);
        }
        
        rover.boost();
        rover.moveForward(150);
        rover.collect();
        System.out.println("Treasures found: " + treasures);
        rover.sendSignal("Treasure secured!");
    }
}
`,
      cpp: `// 🗺️ Mission: Find the Cosmic Treasure!
#include <iostream>

void execute() {
    int treasures = 0;
    
    for (int x = 0; x < 3; x++) {
        rover.moveForward(90);
        
        for (int y = 0; y < 2; y++) {
            rover.moveUp(60);
            rover.collect();
            treasures++;
        }
        
        rover.moveDown(120);
    }
    
    rover.boost();
    rover.moveForward(150);
    rover.collect();
    std::cout << "Treasures found: " << treasures << "\n";
    rover.sendSignal("Treasure secured!");
}
`
    },
    hints: [
      '💡 Use nested loops to search systematically',
      '💡 Track your treasure count with variables',
      '💡 Collect at least 4 treasures to succeed!',
    ],
    validateSuccess: (state) => state.score >= 4 && state.signalsSent > 0,
    successMessage: '🎉 Legendary treasure hunter! All artifacts secured! +200 Scrap!',
    reward: { scrap: 200, cores: 3 },
  },
  {
    id: 'solar-calibration',
    title: 'Solar Panel Calibration',
    description: 'Align solar panels at different altitudes by moving the rover and sending signals!',
    difficulty: 2,
    icon: '☀️',
    concepts: ['Variables', 'Basic Math'],
    terrain: 'crater',
    starterCode: {
      javascript: `// ☀️ Mission: Solar Panel Calibration
// Set the base altitude variable and move!

let baseAltitude = 50;

rover.moveUp(baseAltitude);
rover.sendSignal("Panel 1 aligned!");
rover.moveForward(60);

// Use math to calculate the next altitude
let nextAltitude = baseAltitude + 30;
rover.moveUp(nextAltitude);
rover.sendSignal("Panel 2 aligned!");
rover.moveForward(60);

rover.moveUp(nextAltitude + 20);
rover.sendSignal("Panel 3 aligned!");
`,
      python: `# ☀️ Mission: Solar Panel Calibration
# Set the base altitude variable and move!

base_altitude = 50

rover.move_up(base_altitude)
rover.send_signal("Panel 1 aligned!")
rover.move_forward(60)

# Use math to calculate the next altitude
next_altitude = base_altitude + 30
rover.move_up(next_altitude)
rover.send_signal("Panel 2 aligned!")
rover.move_forward(60)

rover.move_up(next_altitude + 20)
rover.send_signal("Panel 3 aligned!")
`,
      java: `// ☀️ Mission: Solar Panel Calibration
public class Mission {
    public static void execute() {
        int baseAltitude = 50;
        
        rover.moveUp(baseAltitude);
        rover.sendSignal("Panel 1 aligned!");
        rover.moveForward(60);
        
        int nextAltitude = baseAltitude + 30;
        rover.moveUp(nextAltitude);
        rover.sendSignal("Panel 2 aligned!");
        rover.moveForward(60);
        
        rover.moveUp(nextAltitude + 20);
        rover.sendSignal("Panel 3 aligned!");
    }
}
`,
      cpp: `// ☀️ Mission: Solar Panel Calibration
#include <rover.h>

void execute() {
    int baseAltitude = 50;
    
    rover.moveUp(baseAltitude);
    rover.sendSignal("Panel 1 aligned!");
    rover.moveForward(60);
    
    int nextAltitude = baseAltitude + 30;
    rover.moveUp(nextAltitude);
    rover.sendSignal("Panel 2 aligned!");
    rover.moveForward(60);
    
    rover.moveUp(nextAltitude + 20);
    rover.sendSignal("Panel 3 aligned!");
}
`
    },
    hints: [
      '💡 Use variables to store numbers you might need again',
      '💡 Send a signal each time you reach a new altitude',
      '💡 You need to send at least 3 signals and reach the right height!',
    ],
    validateSuccess: (state) => state.signalsSent >= 3 && state.y <= 150,
    successMessage: '🎉 Power restored! Solar panels calibrated! +75 Scrap!',
    reward: { scrap: 75, cores: 1 },
  },
  {
    id: 'signal-relay',
    title: 'Signal Relay',
    description: 'Relay messages across space at increasing distances. Build an arithmetic progression using a loop.',
    difficulty: 3,
    icon: '📡',
    concepts: ['Loops', 'Arithmetic'],
    terrain: 'race',
    starterCode: {
      javascript: `// 📡 Mission: Signal Relay
// Use a loop to send signals further and further!

let distance = 30;

for (let i = 0; i < 4; i++) {
  rover.moveForward(distance);
  rover.sendSignal("Relay point " + (i + 1));
  
  // Increase distance for the next jump!
  distance = distance + 20;
}
`,
      python: `# 📡 Mission: Signal Relay
# Use a loop to send signals further and further!

distance = 30

for i in range(4):
    rover.move_forward(distance)
    rover.send_signal("Relay point " + str(i + 1))
    
    # Increase distance for the next jump!
    distance = distance + 20
`,
      java: `// 📡 Mission: Signal Relay
public class Mission {
    public static void execute() {
        int distance = 30;
        
        for (int i = 0; i < 4; i++) {
            rover.moveForward(distance);
            rover.sendSignal("Relay point " + (i + 1));
            
            distance = distance + 20;
        }
    }
}
`,
      cpp: `// 📡 Mission: Signal Relay
#include <string>

void execute() {
    int distance = 30;
    
    for (int i = 0; i < 4; i++) {
        rover.moveForward(distance);
        rover.sendSignal("Relay point " + std::to_string(i + 1));
        
        distance = distance + 20;
    }
}
`
    },
    hints: [
      '💡 Update your variable inside the loop to change behavior over time',
      '💡 You need to reach the end of the sector (x > 300) and send 4 signals',
    ],
    validateSuccess: (state) => state.signalsSent >= 4 && state.x > 300,
    successMessage: '🎉 Signal reached home! Relay network established! +110 Scrap!',
    reward: { scrap: 110, cores: 2 },
  },
  {
    id: 'gravity-escape',
    title: 'Gravity Well Escape',
    description: 'A black hole is pulling you in! Combine boost and thrust precisely to break free from its gravity well.',
    difficulty: 5,
    icon: '🕳️',
    concepts: ['Command Combinations', 'Max Power'],
    terrain: 'asteroids',
    starterCode: {
      javascript: `// 🕳️ Mission: Escape the Gravity Well!
// Combine your most powerful moves to break free.

for (let i = 0; i < 3; i++) {
  rover.boost();
  rover.moveForward(80);
  
  // Use maximum thrust to gain altitude quickly!
  rover.thrust(10);
}

rover.sendSignal("Approaching escape velocity...");
rover.boost();
rover.moveForward(100);
rover.sendSignal("I broke free!");
`,
      python: `# 🕳️ Mission: Escape the Gravity Well!
# Combine your most powerful moves to break free.

for i in range(3):
    rover.boost()
    rover.move_forward(80)
    
    # Use maximum thrust to gain altitude quickly!
    rover.thrust(10)

rover.send_signal("Approaching escape velocity...")
rover.boost()
rover.move_forward(100)
rover.send_signal("I broke free!")
`,
      java: `// 🕳️ Mission: Escape the Gravity Well!
public class Mission {
    public static void execute() {
        for (int i = 0; i < 3; i++) {
            rover.boost();
            rover.moveForward(80);
            
            rover.thrust(10);
        }
        
        rover.sendSignal("Approaching escape velocity...");
        rover.boost();
        rover.moveForward(100);
        rover.sendSignal("I broke free!");
    }
}
`,
      cpp: `// 🕳️ Mission: Escape the Gravity Well!
void execute() {
    for (int i = 0; i < 3; i++) {
        rover.boost();
        rover.moveForward(80);
        
        rover.thrust(10);
    }
    
    rover.sendSignal("Approaching escape velocity...");
    rover.boost();
    rover.moveForward(100);
    rover.sendSignal("I broke free!");
}
`
    },
    hints: [
      '💡 Boost doubles the distance of your next moveForward',
      '💡 Max thrust is 10. Combine it with movement to escape!',
      '💡 You must reach x > 400 and y < 100 to escape the gravitational pull',
    ],
    validateSuccess: (state) => state.x > 400 && state.y < 100,
    successMessage: '🎉 Phenomenal flying! You escaped the black hole! +250 Scrap!',
    reward: { scrap: 250, cores: 3 },
  },
  {
    id: 'galaxy-explorer',
    title: 'Galaxy Explorer',
    description: 'Map a new sector by visiting specific coordinates. Use functions to jump to exact locations and collect data crystals.',
    difficulty: 4,
    icon: '🌌',
    concepts: ['Functions', 'Coordinate Geometry'],
    terrain: 'crystals',
    starterCode: {
      javascript: `// 🌌 Mission: Explore the Sector
// Create a function to jump across the grid

function jumpAndCollect(moveX, moveY) {
  rover.moveForward(moveX);
  // Negative Y means moving UP in coordinate graphics!
  if (moveY < 0) {
    rover.moveUp(-moveY);
  } else {
    rover.moveDown(moveY);
  }
  rover.collect();
}

jumpAndCollect(80, -50);
jumpAndCollect(60, 40);
jumpAndCollect(90, -80);
jumpAndCollect(50, 60);

rover.sendSignal("Mapping complete!");
`,
      python: `# 🌌 Mission: Explore the Sector
# Create a function to jump across the grid

def jump_and_collect(move_x, move_y):
    rover.move_forward(move_x)
    # Negative Y means moving UP!
    if move_y < 0:
        rover.move_up(-move_y)
    else:
        rover.move_down(move_y)
    rover.collect()

jump_and_collect(80, -50)
jump_and_collect(60, 40)
jump_and_collect(90, -80)
jump_and_collect(50, 60)

rover.send_signal("Mapping complete!")
`,
      java: `// 🌌 Mission: Explore the Sector
public class Mission {
    public static void jumpAndCollect(int moveX, int moveY) {
        rover.moveForward(moveX);
        if (moveY < 0) {
            rover.moveUp(-moveY);
        } else {
            rover.moveDown(moveY);
        }
        rover.collect();
    }
    
    public static void execute() {
        jumpAndCollect(80, -50);
        jumpAndCollect(60, 40);
        jumpAndCollect(90, -80);
        jumpAndCollect(50, 60);
        
        rover.sendSignal("Mapping complete!");
    }
}
`,
      cpp: `// 🌌 Mission: Explore the Sector
void jumpAndCollect(int moveX, int moveY) {
    rover.moveForward(moveX);
    if (moveY < 0) {
        rover.moveUp(-moveY);
    } else {
        rover.moveDown(moveY);
    }
    rover.collect();
}

void execute() {
    jumpAndCollect(80, -50);
    jumpAndCollect(60, 40);
    jumpAndCollect(90, -80);
    jumpAndCollect(50, 60);
    
    rover.sendSignal("Mapping complete!");
}
`
    },
    hints: [
      '💡 Functions allow you to reuse complex movement logic',
      '💡 Adjust your parameters to hit all the crystals',
      '💡 Collect at least 4 crystals to map the sector successfully!',
    ],
    validateSuccess: (state) => state.score >= 4 && state.signalsSent > 0,
    successMessage: '🎉 Spectacular mapping! The sector is bright! +160 Scrap!',
    reward: { scrap: 160, cores: 2 },
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
