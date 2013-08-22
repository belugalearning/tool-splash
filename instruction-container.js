define(['instructiondragbutton', 'scrollcontainer', 'constants'], function(InstructionDragButton, ScrollContainer, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionBox = ScrollContainer.extend({

		ctor:function() {
			this._super();
            this.setupWithOrientation(false);
			this.initWithFile(window.bl.getResource('instruction_dock'));

			this.buttons = [];

			var self = this;

			var instructionsNode = new cc.Node();
			this.addChild(instructionsNode);
            
            var defaultButtonZOrder = 1;
            _.each(InstructionTypes, function(type) {
                if (type["include_in_container"]) {
                    var instructionButton = new InstructionDragButton()
                    instructionButton.initWithType(type);
                    var positionInContainer = self.getPositionForInstruction(type);
                    instructionButton.setPosition(positionInContainer);
                    instructionButton.setZOrder(defaultButtonZOrder);
                    instructionsNode.addChild(instructionButton);
                    self.buttons.push(instructionButton);
                };
            });

            this.setScrollNode(instructionsNode)
            instructionsNode.getTotalHeight = function() {
                return self.getPositionForInstruction(self.buttons.length - 1).x;
            };
            instructionsNode.getVisibleHeight = function() {
                return self.getContentSize().width;
            };
            this.setScrollBarSpace(20, 1000, 16);
            this.setScrollBarFunctions();
		},

		getPositionForInstruction:function(type) {
			return cc.p(50 + 63 * this.buttons.length, this.getContentSize().height/2 + 3);
		},
	})

	return InstructionBox;
})