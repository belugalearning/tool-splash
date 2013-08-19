define(['blbutton', 'arrow', 'tracenode'], function(BLButton, Arrow, TraceNode) {
	'use strict';

	var SplashNode = cc.Node.extend({
		ctor:function() {
			this._super();
			var width = 800;
			var height = 450;
			this.boundary = cc.RectMake(-width/2, -height/2, width, height);

			this.dotDistance = 50;
			this.dots = [];

			this.latticeNode;
			this.setupLatticeNode();

			this.traceNode;
			this.setupTraceNode();

			this.startingPosition = this.dots[60].getPosition();
			this.arrowNode;
			this.arrow;
			this.setupArrowNode();

			this.playing = false;
		},

		setStartingPosition:function(position) {
			this.startingPosition = position;
			this.arrow.setStartingPosition(position);
		},

		setupLatticeNode:function() {
			var self = this;
			this.width = 800;
			this.height = 450;
			this.latticeNode = new cc.Layer();
			var latticePoints = this.boundary.latticePoints(this.dotDistance, this.dotDistance, Math.PI/2, 0, 0);
			for (var i = 0; i < latticePoints.length; i++) {
				var dot = new BLButton();
				dot.initWithFile(window.bl.getResource('bubble_dot'));
				dot.setPosition(latticePoints[i]);
				this.latticeNode.addChild(dot);
				this.dots.push(dot);

				dot.highlight = function(highlight) {
					var color = highlight ? cc.c3b(229, 126, 30) : cc.c3b(255, 255, 255);
					this.setColor(color);
				};

				dot.onTouchUp(function() {
					if (!self.playing) {
						self.startingPosition = this.getPosition();
						self.reset();
					};
				});
			};
			this.addChild(this.latticeNode);
		},

		setupTraceNode:function() {
			this.traceNode = new TraceNode();
			this.addChild(this.traceNode);
		},

		setupArrowNode:function() {
			var self = this;
			this.arrowNode = new cc.Node();

			this.arrow = new Arrow();
			this.arrow.setDrawingNode(this.traceNode);
			this.arrow.setDrawing(false);
			this.arrow.setPosition(this.startingPosition);
			this.arrow.setDrawing(true);
			this.arrow.setRotation(180);
			this.arrow.setUnitDistance(this.dotDistance);
			this.arrow.setStartPosition(this.startingPosition);
			this.arrowNode.addChild(this.arrow);
			this.arrow.setBoundary(this.boundary);
			this.addChild(this.arrowNode);

			this.traceNode.vertices.push(this.startingPosition);
		},

		setPlaying:function(playing) {
			this.playing = playing;
		},

		reset:function() {
			this.traceNode.removeFromParent();
			this.setupTraceNode();
			this.arrowNode.removeFromParent();
			this.setupArrowNode();
		},
	});

	return SplashNode;
})