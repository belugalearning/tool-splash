define(['draggable', 'constants'], function(Draggable, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var Instruction = Draggable.extend({
		ctor:function() {
			this._super();
			this.instruction;
			this.type;
		},

		initWithType:function(type) {
			this.initWithFile(window.bl.getResource(window.bl.getResource(type['filename'])));
			this.type = type;
			this.instruction = type['instruction'];
			this.setZoomOnTouchDown(false);
			if (type["label"]) {
				this.label = new cc.LabelTTF.create(type["label"], "mikadoBold", 20);
				// this.label.setPosition(this.getAnchorPointInPoints());
				this.addChild(this.label);
			};
		},
	})

	return Instruction
})