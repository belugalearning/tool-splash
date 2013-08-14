define(['instructiondragbutton', 'constants'], function(InstructionDragButton, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionBox = cc.Sprite.extend({

		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('instruction_dock'));

			this.buttons = [];

			this._container;

			var self = this;

			this.moving = false;
            
            var defaultButtonZOrder = 1;
	        _.each(InstructionTypes, function(type) {
                if (type["include_in_container"]) {
                    var instructionButton = new InstructionDragButton()
                    instructionButton.initWithType(type);
                    var positionInContainer = self.getPositionForInstruction(type);
                    instructionButton.setPosition(positionInContainer);
                    instructionButton.setZOrder(defaultButtonZOrder);
                    self.addChild(instructionButton);
                    self.buttons.push(instructionButton);
                };
            })
		},

		getPositionForInstruction:function(type) {
			return cc.p(50 + 63 * type["container_position"], this.getContentSize().height/2 + 3);
		},
	})

	return InstructionBox;
})