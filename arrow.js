define(['constants'], function(constants) {
	'use strict';

	var TurnStyles = constants['TurnStyles'];
	var InstructionTypes = constants['InstructionTypes'];

	var Arrow = cc.Sprite.extend({
		ctor:function() {
			this._super();

			this.drawing = false;

			this.initWithFile(window.bl.getResource('arrow'));
			this.setAnchorPoint(cc.p(0.5, 0.43));

			this.actionFunctions = [];

			this.unitDistance = 1;

			this.drawingNode;

			this.speed = 1;
		},

		setDrawingNode:function(drawingNode) {
			this.drawingNode = drawingNode;
		},

		setDrawing:function(drawing) {
			this.drawing = drawing;
		},

		setUnitDistance:function(unit) {
			this.unitDistance = unit;
		},

		setPosition:function() {
			var radius = 4;
			var color = cc.c4f(229/255, 126/255, 30/255, 1);
			var point;
			if (arguments.length == 2) {
				point = cc.p(arguments[0], arguments[1]);
			} else {
				point = arguments[0];
			};
			var previousPoint = this.getPosition();
			this._super(point);
			if (this.drawing) {
				this.drawingNode.drawDot(previousPoint, radius-1, color);
				this.drawingNode.drawSegment(previousPoint, point, radius, color);
			};
		},

		followInstructions:function(instructions) {
			var index = 0;
			var self = this;
			var followNextInstruction = function() {
				if (index < instructions.length) {
					var instruction = instructions[index];
					if (instruction.type === InstructionTypes.OPEN_BRACKET) {
						instruction.loopsRemaining = 2;
						index++;
						instruction.highlight(true);
						instruction.linked[0].highlight(true);
						followNextInstruction();
					} else if (instruction.type === InstructionTypes.CLOSE_BRACKET) {
						var openBracket = instruction.linked[0];
						var openIndex = instructions.indexOf(openBracket);
						openBracket.loopsRemaining--;
						if (openBracket.loopsRemaining > 0) {
							index = openIndex + 1;
						} else {
							index++;
							instruction.highlight(false);
							openBracket.highlight(false);
						};
						followNextInstruction();
					} else {
						instruction.highlight(true);
						index++;
						var actions = [];			
						if (instruction.type['turn_to_direction'] !== undefined) {
							var turn = self.rotateToRunner(instruction.type['turn_to_direction'], TurnStyles.SHORTEST);
							actions.push(turn);
						} else if (instruction.type['turn_by_direction'] !== undefined) {
							var turn = self.rotateByRunner(instruction.type['turn_by_direction']);
							actions.push(turn);
						};
						if (instruction.type['move_by_distance'] !== undefined) {
							var move = self.moveForwardRunner(instruction.type['move_by_distance'] * self.unitDistance);
							actions.push(move);
						};
						actions.push(function() {
							var unhighlight = function() {
								instruction.highlight(false);
							}
							return cc.CallFunc.create(unhighlight);
						})
						actions.push(function() {
							return cc.CallFunc.create(followNextInstruction);
						});
						var actionIndex = 0;
						var next = function() {
							if (actionIndex < actions.length) {
								var action = actions[actionIndex].call(self);
								actionIndex++;
								var call = cc.CallFunc.create(next);
								var sequence = cc.Sequence.create(action, call);
								self.runAction(sequence);
							};
						};
						next();
					};
				};
			};
			followNextInstruction();
		},


		moveForwardRunner:function(distance) {
			var self = this;
			var moveForward = function() {
				var rotation = self.getRotation() * 2 * Math.PI / 360;
				var duration = distance/self.unitDistance;
				var moveBy = cc.MoveBy.create(duration/self.speed, cc.p(distance * Math.cos(rotation), -distance * Math.sin(rotation)));
				return moveBy;
			}
			return moveForward;
		},

		rotateByRunner:function(angle) {
			var self = this;
			var rotate = function() {
				var duration = Math.abs(angle)/90;
				var rotate = cc.RotateBy.create(duration/self.speed, angle);
				return rotate;
			}
			return rotate;
		},

		rotateToRunner:function(angle, turnStyle) {
			var startRotation = this.getRotation();
			var turnClockwise = (angle - startRotation).numberInCorrectRange(0, 360);
			var runner;
			if (turnStyle === TurnStyles.CLOCKWISE) {
				runner = this.rotateByRunner(turnClockwise);
			} else if (turnStyle === TurnStyles.ANTICLOCKWISE) {
				runner = this.rotateByRunner(turnClockwise - 360);
			} else {
				var turnShort = turnClockwise < 180 ? turnClockwise : turnClockwise - 360;
				if (turnStyle === TurnStyles.SHORTEST) {
					runner = this.rotateByRunner(turnShort);
				} else {
					runner = this.rotateByRunner(turnShort - 360);
				};
			}
			return runner;
		},

	});

	return Arrow;

})