define(['draggable'], function(Draggable) {
	'use strict';

	var Instruction = Draggable.extend({
		ctor:function() {
			this._super();
			this.instruction;
		},

		initWithType:function(type) {
			this.initWithFile(window.bl.getResource(window.bl.getResource(type['filename'])));
			this.instruction = type['instruction'];
			this.setZoomOnTouchDown(false);
		},
	})

	return Instruction
})