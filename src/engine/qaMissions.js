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
  }
];

export default qaMissions;
