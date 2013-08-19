define(['blbutton', 'arrow'], function(BLButton, Arrow) {
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

			this.drawingNode;
			this.setupDrawingNode();

			this.startingPosition = this.dots[60].getPosition();
			this.arrowNode;
			this.arrow;
			this.setupArrowNode();

			this.playing = false;
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

		setupDrawingNode:function() {
			this.drawingNode = new cc.DrawNode();
			this.addChild(this.drawingNode);
		},

		setupArrowNode:function() {
			var self = this;
			this.arrowNode = new cc.Node();

			this.arrow = new Arrow();
			this.arrow.setDrawingNode(this.drawingNode);
			this.arrow.setDrawing(false);
			this.arrow.setPosition(this.startingPosition);
			this.arrow.setDrawing(true);
			this.arrow.setRotation(180);
			this.arrow.setUnitDistance(this.dotDistance);
			this.arrowNode.addChild(this.arrow);
			this.arrow.setBoundary(this.boundary);
			this.addChild(this.arrowNode);
		},

		setPlaying:function(playing) {
			this.playing = playing;
		},

		reset:function() {
			this.drawingNode.removeFromParent();
			this.setupDrawingNode();
			this.arrowNode.removeFromParent();
			this.setupArrowNode();
		},
	});

	return SplashNode;
})