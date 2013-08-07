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
			this.width = 500;
			this.height = 300;
			this.latticeNode = new cc.Node();
			this.latticeNode.boundary = cc.RectMake(-this.width/2, -this.height/2, this.width, this.height);
			this.latticeNode.boundary.test();
		},
	});

	return SplashNode;
})