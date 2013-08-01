define(['instructiondragbutton', 'constants'], function(InstructionDragButton, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionBox = cc.Sprite.extend({

		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('toolbox_panel'));

			this._instructionDraggables = [];

			this._container;

			var self = this;

			this.moving = false;

			_.each(InstructionTypes, function(type) {
				var instructionButton = new InstructionDragButton();
				instructionButton.initWithInstructionType(type);
				instructionButton.setPosition(60 + 63 * type["container_position"]["column"], 280 - 54 * type["container_position"]["row"]);
				instructionButton.setZOrder(1);
				self.addChild(instructionButton);
				self._instructionDraggables.push(instructionButton.draggable);
			})
		},

		setContainerForDraggables:function(container) {
			this._container = container;
		},

		
	})

	return InstructionBox;
})