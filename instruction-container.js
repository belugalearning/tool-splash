define(['instructiondragbutton', 'constants'], function(InstructionDragButton, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionBox = cc.Sprite.extend({

		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('instruction_dock'));

			this.buttons = [];

			var self = this;

			this.scrollNode = new cc.Node();
			this.addChild(this.scrollNode);
            
            var defaultButtonZOrder = 1;
	        _.each(InstructionTypes, function(type) {
                if (type["include_in_container"]) {
                    var instructionButton = new InstructionDragButton()
                    instructionButton.initWithType(type);
                    var positionInContainer = self.getPositionForInstruction(type);
                    instructionButton.setPosition(positionInContainer);
                    instructionButton.setZOrder(defaultButtonZOrder);
                    self.scrollNode.addChild(instructionButton);
                    self.buttons.push(instructionButton);
                };
            })
		},

		getPositionForInstruction:function(type) {
			return cc.p(50 + 63 * this.buttons.length, this.getContentSize().height/2 + 3);
		},
	})

	return InstructionBox;
})