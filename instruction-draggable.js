define(['draggable', 'constants'], function(Draggable, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var Instruction = Draggable.extend({
		ctor:function() {
			this._super();
			this.instruction;
			this.type;
			this.highlighter;
			this.setChangePositionOnTouchDown(false);
		},

		initWithType:function(type) {
			this.initWithFile(window.bl.getResource(window.bl.getResource(type['filename'])));
			this.type = type;
			this.parameters = type['instruction_parameters'];
			this.setZoomOnTouchDown(false);
			if (this.type['setup']) {
				this.type['setup'].call(this);
			};
			this.highlighter = new cc.Sprite();
			this.highlighter.initWithFile(window.bl.getResource('blank_grey'));
			this.addChild(this.highlighter);
			this.highlighter.setOpacity(128);
			this.highlighter.setVisible(false);
		},

		highlight:function(highlight) {
			this.highlighter.setVisible(highlight);
		},
	})

	return Instruction
})