define(['instructiondragbutton', 'constants'], function(InstructionDragButton, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionBox = cc.Sprite.extend({

		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('toolbox_panel'));

			var self = this;


			_.each(InstructionTypes, function(type) {
				var dragawayButton = new InstructionDragButton();
				dragawayButton.initWithInstructionType(type);
				dragawayButton.setPosition(60 + 63 * type["container_position"]["column"], 280 - 54 * type["container_position"]["row"]);
				dragawayButton.setZOrder(1);
				self.addChild(dragawayButton);
			})
		},
	})

	return InstructionBox;
})