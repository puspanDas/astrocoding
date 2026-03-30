import * as Blockly from 'blockly/core';
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';

// Define Custom Rover Blocks
Blockly.Blocks['rover_move_forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move Forward")
        .appendField(new Blockly.FieldNumber(50), "DISTANCE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Move the rover forward");
  }
};

javascriptGenerator.forBlock['rover_move_forward'] = function(block) {
  var distance = block.getFieldValue('DISTANCE');
  return 'rover.moveForward(' + distance + ');\n';
};

pythonGenerator.forBlock['rover_move_forward'] = function(block) {
  var distance = block.getFieldValue('DISTANCE');
  return 'rover.move_forward(' + distance + ')\n';
};

Blockly.Blocks['rover_move_up'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move Up")
        .appendField(new Blockly.FieldNumber(50), "DISTANCE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

javascriptGenerator.forBlock['rover_move_up'] = function(block) {
  return 'rover.moveUp(' + block.getFieldValue('DISTANCE') + ');\n';
};
pythonGenerator.forBlock['rover_move_up'] = function(block) {
  return 'rover.move_up(' + block.getFieldValue('DISTANCE') + ')\n';
};

Blockly.Blocks['rover_move_down'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move Down")
        .appendField(new Blockly.FieldNumber(50), "DISTANCE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

javascriptGenerator.forBlock['rover_move_down'] = function(block) {
  return 'rover.moveDown(' + block.getFieldValue('DISTANCE') + ');\n';
};
pythonGenerator.forBlock['rover_move_down'] = function(block) {
  return 'rover.move_down(' + block.getFieldValue('DISTANCE') + ')\n';
};


Blockly.Blocks['rover_thrust'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Thrust Power:")
        .appendField(new Blockly.FieldNumber(5, 1, 15), "POWER");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(10);
  }
};

javascriptGenerator.forBlock['rover_thrust'] = function(block) {
  return 'rover.thrust(' + block.getFieldValue('POWER') + ');\n';
};
pythonGenerator.forBlock['rover_thrust'] = function(block) {
  return 'rover.thrust(' + block.getFieldValue('POWER') + ')\n';
};


Blockly.Blocks['rover_boost'] = {
  init: function() {
    this.appendDummyInput().appendField("Boost");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(10);
  }
};

javascriptGenerator.forBlock['rover_boost'] = function(block) { return 'rover.boost();\n'; };
pythonGenerator.forBlock['rover_boost'] = function(block) { return 'rover.boost()\n'; };

Blockly.Blocks['rover_shoot'] = {
  init: function() {
    this.appendDummyInput().appendField("Shoot Laser");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
  }
};

javascriptGenerator.forBlock['rover_shoot'] = function(block) { return 'rover.shoot();\n'; };
pythonGenerator.forBlock['rover_shoot'] = function(block) { return 'rover.shoot()\n'; };

Blockly.Blocks['rover_collect'] = {
  init: function() {
    this.appendDummyInput().appendField("Collect Item");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
  }
};

javascriptGenerator.forBlock['rover_collect'] = function(block) { return 'rover.collect();\n'; };
pythonGenerator.forBlock['rover_collect'] = function(block) { return 'rover.collect()\n'; };

Blockly.Blocks['rover_send_signal'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Send Signal")
        .appendField(new Blockly.FieldTextInput("Hello!"), "MSG");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
  }
};

javascriptGenerator.forBlock['rover_send_signal'] = function(block) {
  return 'rover.sendSignal("' + block.getFieldValue('MSG') + '");\n';
};
pythonGenerator.forBlock['rover_send_signal'] = function(block) {
  return 'rover.send_signal("' + block.getFieldValue('MSG') + '")\n';
};

Blockly.Blocks['rover_set_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set Ranger Color")
        .appendField(new Blockly.FieldColour("#ff0000"), "COLOR");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
  }
};

javascriptGenerator.forBlock['rover_set_color'] = function(block) {
  return 'rover.setColor("' + block.getFieldValue('COLOR') + '");\n';
};
pythonGenerator.forBlock['rover_set_color'] = function(block) {
  return 'rover.set_color("' + block.getFieldValue('COLOR') + '")\n';
};

// ==========================================
// User Input & Easy Variables
// ==========================================
Blockly.Blocks['user_prompt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Ask User:")
        .appendField(new Blockly.FieldTextInput("Enter value:"), "MSG");
    this.setOutput(true, null);
    this.setColour(160);
    this.setTooltip("Prompt for user input via a dialog");
  }
};

javascriptGenerator.forBlock['user_prompt'] = function(block) {
  var msg = block.getFieldValue('MSG');
  return ['window.prompt("' + msg + '")', javascriptGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator.forBlock['user_prompt'] = function(block) {
  var msg = block.getFieldValue('MSG');
  return ['input("' + msg + '\\n")', pythonGenerator.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['easy_set_variable_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set")
        .appendField(new Blockly.FieldVariable("item"), "VAR")
        .appendField("to Number")
        .appendField(new Blockly.FieldNumber(0), "VALUE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("Quickly set a variable to a number without connecting blocks.");
  }
};

javascriptGenerator.forBlock['easy_set_variable_number'] = function(block) {
  var varName = javascriptGenerator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + block.getFieldValue('VALUE') + ';\n';
};

pythonGenerator.forBlock['easy_set_variable_number'] = function(block) {
  var varName = pythonGenerator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + block.getFieldValue('VALUE') + '\n';
};

// ==========================================
// Physics Blocks
// ==========================================
Blockly.Blocks['physics_speed'] = {
  init: function() {
    this.appendValueInput("DISTANCE")
        .setCheck("Number")
        .appendField("Physics: Speed (Dist");
    this.appendValueInput("TIME")
        .setCheck("Number")
        .appendField("/ Time)");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(200);
    this.setTooltip("Calculate speed (Distance ÷ Time)");
  }
};

javascriptGenerator.forBlock['physics_speed'] = function(block, generator) {
  var dist = generator.valueToCode(block, 'DISTANCE', javascriptGenerator.ORDER_DIVISION) || '0';
  var time = generator.valueToCode(block, 'TIME', javascriptGenerator.ORDER_DIVISION) || '1';
  return ['(' + dist + ' / ' + time + ')', javascriptGenerator.ORDER_DIVISION];
};

pythonGenerator.forBlock['physics_speed'] = function(block, generator) {
  var dist = generator.valueToCode(block, 'DISTANCE', pythonGenerator.ORDER_MULTIPLICATIVE) || '0';
  var time = generator.valueToCode(block, 'TIME', pythonGenerator.ORDER_MULTIPLICATIVE) || '1';
  return ['(' + dist + ' / ' + time + ')', pythonGenerator.ORDER_MULTIPLICATIVE];
};

Blockly.Blocks['physics_force'] = {
  init: function() {
    this.appendValueInput("MASS")
        .setCheck("Number")
        .appendField("Physics: Force (Mass");
    this.appendValueInput("ACCELERATION")
        .setCheck("Number")
        .appendField("* Accel)");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(200);
    this.setTooltip("Calculate force (Mass × Acceleration)");
  }
};

javascriptGenerator.forBlock['physics_force'] = function(block, generator) {
  var mass = generator.valueToCode(block, 'MASS', javascriptGenerator.ORDER_MULTIPLICATION) || '0';
  var acc = generator.valueToCode(block, 'ACCELERATION', javascriptGenerator.ORDER_MULTIPLICATION) || '0';
  return ['(' + mass + ' * ' + acc + ')', javascriptGenerator.ORDER_MULTIPLICATION];
};

pythonGenerator.forBlock['physics_force'] = function(block, generator) {
  var mass = generator.valueToCode(block, 'MASS', pythonGenerator.ORDER_MULTIPLICATIVE) || '0';
  var acc = generator.valueToCode(block, 'ACCELERATION', pythonGenerator.ORDER_MULTIPLICATIVE) || '0';
  return ['(' + mass + ' * ' + acc + ')', pythonGenerator.ORDER_MULTIPLICATIVE];
};




// Game Toolbox
export const gameToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Movement',
      colour: 230,
      contents: [
        { kind: 'block', type: 'rover_move_forward' },
        { kind: 'block', type: 'rover_move_up' },
        { kind: 'block', type: 'rover_move_down' },
      ]
    },
    {
      kind: 'category',
      name: 'Actions',
      colour: 10,
      contents: [
        { kind: 'block', type: 'rover_thrust' },
        { kind: 'block', type: 'rover_boost' },
        { kind: 'block', type: 'rover_shoot' },
        { kind: 'block', type: 'rover_collect' },
      ]
    },
    {
      kind: 'category',
      name: 'Communication',
      colour: 290,
      contents: [
        { kind: 'block', type: 'rover_send_signal' },
        { kind: 'block', type: 'rover_set_color' },
      ]
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '%{BKY_LOGIC_HUE}',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_boolean' },
      ]
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '%{BKY_LOOPS_HUE}',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
      ]
    },
    {
       kind: 'category',
       name: 'Math',
       colour: '%{BKY_MATH_HUE}',
       contents: [
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
       ]
    },
    {
       kind: 'category',
       name: 'Physics',
       colour: 200,
       contents: [
          { kind: 'block', type: 'physics_speed' },
          { kind: 'block', type: 'physics_force' },
       ]
    },
    {
       kind: 'category',
       name: 'Input & Vars',
       colour: 330,
       contents: [
          { kind: 'block', type: 'user_prompt' },
          { kind: 'block', type: 'easy_set_variable_number' },
       ]
    }
  ]
};

// Sandbox Toolbox
export const sandboxToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Logic',
      colour: '%{BKY_LOGIC_HUE}',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_boolean' },
      ]
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '%{BKY_LOOPS_HUE}',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
      ]
    },
    {
       kind: 'category',
       name: 'Math',
       colour: '%{BKY_MATH_HUE}',
       contents: [
          { kind: 'block', type: 'math_number' },
          { kind: 'block', type: 'math_arithmetic' },
       ]
    },
    {
       kind: 'category',
       name: 'Text & Input',
       colour: '%{BKY_TEXTS_HUE}',
       contents: [
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'text_print' },
          { kind: 'block', type: 'user_prompt' },
       ]
    },
    {
       kind: 'category',
       name: 'Easy Vars',
       colour: 330,
       contents: [
          { kind: 'block', type: 'easy_set_variable_number' },
       ]
    },
    {
       kind: 'category',
       name: 'Variables',
       colour: '%{BKY_VARIABLES_HUE}',
       custom: 'VARIABLE'
    },
    {
       kind: 'category',
       name: 'Physics',
       colour: 200,
       contents: [
          { kind: 'block', type: 'physics_speed' },
          { kind: 'block', type: 'physics_force' },
       ]
    },
    {
       kind: 'category',
       name: 'Functions',
       colour: '%{BKY_PROCEDURES_HUE}',
       custom: 'PROCEDURE'
    }
  ]
};
