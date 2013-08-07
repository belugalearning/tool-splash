define([], function() {
	'use strict';

	var Arrow = cc.Sprite.extend({
		ctor:function() {
			this._super();

			this.drawing = false;

			this.initWithFile(window.bl.getResource('arrow'));
			this.setAnchorPoint(cc.p(0.5, 0.43));

			this.actionFunctions = [];

			this.drawingNode;
		},

		setDrawingNode:function(drawingNode) {
			this.drawingNode = drawingNode;
		},

		setDrawing:function(drawing) {
			this.drawing = drawing;
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

		queueMoveInDirection:function(angle, turnDuration, distance, moveDuration) {
			this.queueRotateTo(angle, turnDuration);
			this.queueMoveForward(distance, moveDuration);
		},

		queueMoveForward:function(distance, duration) {
			var self = this;
			var moveForward = function(speed) {
				var rotation = self.getRotation() * 2 * Math.PI / 360;
				var moveBy = cc.MoveBy.create(duration/speed, cc.p(distance * Math.cos(rotation), -distance * Math.sin(rotation)));
				return moveBy;
			}
			this.actionFunctions.push(moveForward);
		},

		queueRotateBy:function(angle, duration) {
			var rotate = function(speed) {
				var rotate = cc.RotateBy.create(duration/speed, angle);
				return rotate;
			}
			this.actionFunctions.push(rotate);
		},

		queueRotateTo:function(angle, duration) {
			var rotate = function(speed) {
				var rotate = cc.RotateTo.create(duration/speed, angle);
				return rotate;
			}
			this.actionFunctions.push(rotate);
		},

/*		moveInDirection:function(angle, distance, rotationDuration, moveDuration) {
			var rotate = cc.RotateTo.create(rotationDuration, angle);
			this.runAction(rotate);
			this.moveForward(distance, moveDuration);
		},
*/	});

	return Arrow;

})