define(['arrow'], function(Arrow) {
	'use strict';

	var SplashNode = cc.Node.extend({
		ctor:function() {
			this._super();
			var width = 800;
			var height = 450;
			this.boundary = cc.RectMake(-width/2, -height/2, width, height);

			this.dots = [];

			this.latticeNode;
			this.setupLatticeNode();

			this.drawingNode;
			this.setupDrawingNode();

			this.arrowNode;
			this.arrow;
			this.setupArrowNode();

			this.arrow.moveForward(300, 3);
		},

		setupLatticeNode:function() {
			this.width = 800;
			this.height = 450;
			this.latticeNode = new cc.Node();
			var latticePoints = this.boundary.latticePoints(50, 50, Math.PI/2, 0, 0);
			for (var i = 0; i < latticePoints.length; i++) {
				var dot = new cc.Sprite();
				dot.initWithFile(window.bl.getResource('bubble_dot'));
				dot.setPosition(latticePoints[i]);
				this.latticeNode.addChild(dot);
				this.dots.push(dot);

				dot.highlight = function(highlight) {
					var color = highlight ? cc.c3b(229, 126, 30) : cc.c3b(255, 255, 255);
					this.setColor(color);
				};
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
			this.arrow.setPosition(this.dots[48].getPosition());
			this.arrow.setRotation(180);
			this.arrow.setDrawing(true);
			this.arrowNode.addChild(this.arrow);

			this.addChild(this.arrowNode);
		},
	});

	return SplashNode;
})