define(['instructiondragbutton', 'constants'], function(InstructionDragButton, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionBox = cc.Sprite.extend({

		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('instruction_dock'));

			this._instructionDraggables = [];

			this._container;

			var self = this;

			this.moving = false;
		},

		getPositionForInstruction:function(type) {
			return cc.p(50 + 63 * type["container_position"], this.getContentSize().height/2 + 3);
		},
		
	})

	return InstructionBox;
})