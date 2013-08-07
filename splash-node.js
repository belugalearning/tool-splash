define([], function() {
	'use strict';

	var SplashNode = cc.Node.extend({
		ctor:function() {
			this._super();

			this.dots = [];

			this.latticeNode;
			this.setupLatticeNode();
			
			// this.drawingNode;

			this.arrowNode;
			this.arrow;
			this.setupArrowNode();


		},

		setupLatticeNode:function() {
			this.width = 800;
			this.height = 450;
			this.latticeNode = new cc.Node();
			this.latticeNode.boundary = cc.RectMake(-this.width/2, -this.height/2, this.width, this.height);
			var latticePoints = this.latticeNode.boundary.latticePoints(50, 50, Math.PI/2, 0, 0);
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

		setupArrowNode:function() {
			this.arrowNode = new cc.Node();

			this.arrow = new cc.Sprite();
			this.arrow.initWithFile(window.bl.getResource('arrow'));
			this.arrow.setPosition(this.dots[48].getPosition());
			this.arrowNode.addChild(this.arrow);

			this.addChild(this.arrowNode);
		},
	});

	return SplashNode;
})