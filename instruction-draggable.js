define(['draggable'], function(Draggable) {
	'use strict';

	var Instruction = Draggable.extend({
		ctor:function() {
			this._super();
			this.instruction;
			this.setZoomOnTouchDown(false);
		},

		initWithType:function(type) {
			this.initWithFile(window.bl.getResource(window.bl.getResource(type['filename'])));
			this.instruction = type['instruction'];
		},
	})

	return Instruction
})