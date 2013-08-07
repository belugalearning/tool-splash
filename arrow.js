define([], function() {
	'use strict';

	var Arrow = cc.Sprite.extend({
		ctor:function() {
			this._super();

			this.drawing = false;

			this.initWithFile(window.bl.getResource('arrow'));
			this.setAnchorPoint(cc.p(0.5, 0.6));

			this.drawingNode;
		},

		setDrawingNode:function(drawingNode) {
			this.drawingNode = drawingNode;
		},

		setDrawing:function(drawing) {
			this.drawing = drawing;
		},

		setPosition:function() {
			var radius = 3;
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
				this.drawingNode.drawDot(previousPoint, radius, color);
				this.drawingNode.drawSegment(previousPoint, point, radius, color);
				this.drawingNode.drawDot(point, radius, color);
			};
		},

		moveForward:function(distance, duration) {
			var rotation = this.getRotation() * 2 * Math.PI / 360;
			var moveBy = cc.MoveBy.create(duration, cc.p(-distance * Math.cos(rotation), distance * Math.sin(rotation)));
			this.runAction(moveBy);
		},
	});

	return Arrow;

})