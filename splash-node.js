define([], function() {
	'use strict';

	var SplashNode = cc.Node.extend({
		ctor:function() {
			this._super();

			this.latticeNode;
			this.setupLatticeNode();



			// this.arrowNode;
			// this.drawingNode;
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

				dot.highlight = function(highlight) {
					var color = highlight ? cc.c3b(229, 126, 30) : cc.c3b(255, 255, 255);
					this.setColor(color);
				};
			};
			this.addChild(this.latticeNode);
		},
	});

	return SplashNode;
})