define(['constants'], function(constants) {
	'use strict';

	var TurnStyles = constants['TurnStyles'];

	var Arrow = cc.Sprite.extend({
		ctor:function() {
			this._super();

			this.drawing = false;

			this.initWithFile(window.bl.getResource('arrow'));
			this.setAnchorPoint(cc.p(0.5, 0.43));

			this.actionFunctions = [];

			this.unitDistance = 1;

			this.drawingNode;
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

		move:function(speed) {
			speed = speed || 1;
			var self = this;
			var index = 0;
			var next = function() {
				if (index < self.actionFunctions.length) {
					var action = self.actionFunctions[index].call("placeholder", speed);
					index++;
					var call = cc.CallFunc.create(next);
					var sequence = cc.Sequence.create(action, call);
					self.runAction(sequence);
				};
			};
			next();
		},

		queueMoveInDirection:function(angle, distance, turnStyle) {
			this.queueRotateTo(angle, turnStyle);
			this.queueMoveForward(distance);
		},

		queueMoveForward:function(distance) {
			var self = this;
			var moveForward = function(speed) {
				var rotation = self.getRotation() * 2 * Math.PI / 360;
				var duration = distance/self.unitDistance;
				var moveBy = cc.MoveBy.create(duration/speed, cc.p(distance * Math.cos(rotation), -distance * Math.sin(rotation)));
				return moveBy;
			}
			this.actionFunctions.push(moveForward);
		},

		queueRotateBy:function(angle) {
			var rotate = function(speed) {
				var duration = Math.abs(angle)/90;
				var rotate = cc.RotateBy.create(duration/speed, angle);
				return rotate;
			}
			this.actionFunctions.push(rotate);
		},

		queueRotateTo:function(angle, turnStyle) {
			var startRotation = this.getRotation();
			var turnClockwise = (angle - startRotation).numberInCorrectRange(0, 360);
			if (turnStyle === TurnStyles.CLOCKWISE) {
				this.queueRotateBy(turnClockwise);
			} else if (turnStyle === TurnStyles.ANTICLOCKWISE) {
				this.queueRotateBy(turnClockwise - 360);
			} else {
				var turnShort = turnClockwise < 180 ? turnClockwise : turnClockwise - 360;
				if (turnStyle === TurnStyles.SHORTEST) {
					this.queueRotateBy(turnShort);
				} else {
					this.queueRotateBy(turnShort - 360);
				};
			} 
		},

/*		moveInDirection:function(angle, distance, rotationDuration, moveDuration) {
			var rotate = cc.RotateTo.create(rotationDuration, angle);
			this.runAction(rotate);
			this.moveForward(distance, moveDuration);
		},
*/	});

	return Arrow;

})