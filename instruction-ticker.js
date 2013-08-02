define(['canvasclippingnode', 'draggable', 'constants'], function(CanvasClippingNode, Draggable, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionTicker = cc.Sprite.extend({
		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('insert_panel'));
			var clipper = new CanvasClippingNode();
			var contentSize = this.getContentSize();
			clipper.drawPathToClip = function() {
				this.ctx.rect(15, -146, contentSize.width - 60, contentSize.height - 29);
			};
			var testBox = new cc.Sprite();
			this.addChild(clipper);

			this.highlight = new cc.Sprite();
			this.highlight.initWithFile(window.bl.getResource('single_white_pixel'));
			this.highlight.setOpacity(128);

			this.instructions = [];

			this.spaces = [];
			for (var i = 0; i < 26; i++) {
				var space = new cc.Node();
				space.setPosition(this.getPositionForInstructionSpace(i));
				clipper.addChild(space);
				this.spaces.push(space);
				
				var emptySpace = new cc.Sprite();
				emptySpace.initWithFile(window.bl.getResource('insert_box'));
				space.addChild(emptySpace);
				space.emptySpace = emptySpace;

				space.instruction = null;
				space.setInstruction = function(instruction) {
					if (instruction !== null) {
						if (this.instruction) {
							this.instruction.removeFromParent();
						};
						instruction.setPosition(0,0);
						this.addChild(instruction);
						this.emptySpace.setVisible(false);
						this.instruction = instruction;
					} else {
						this.emptySpace.setVisible(true);
						this.instruction = null;
					};
				};
			};
		},

		getPositionForInstructionSpace:function(index) {
			var positionsPerRow = 13;
			var row = Math.floor(index/positionsPerRow);
			var column = index % positionsPerRow;
			return cc.p(53 + column * 67, 115 - row * 65);
		},

		positionForDrop:function(touchLocation) {
			var dropIndex;
			for (var i = 0; i < this.spaces.length; i++) {
				var space = this.spaces[i];
				var leftPosition = cc.pAdd(space.getPosition(), cc.p(-32, 0));
				if (space.instruction === null) {
					dropIndex = i;
					break;
				} else if (Math.abs(leftPosition.x - touchLocation.x) < 34 && Math.abs(leftPosition.y - touchLocation.y) < 34) {
					dropIndex = i;
					break;
				};
			};
			return dropIndex;
		},

		highlightHovered:function(touchLocation) {
			var highlightSpace = this.spaces[this.positionForDrop(touchLocation)];
			this.clearHighlight();
			if (highlightSpace.instruction === null) {
				this.highlightSpace(highlightSpace);
			} else {
				this.highlightBeforeSpace(highlightSpace);
			};
			highlightSpace.addChild(this.highlight);
		},

		highlightSpace:function(space) {
			this.highlight.setScale(53);
			this.highlight.setPosition(0,0);
		},

		highlightBeforeSpace:function(space) {
			this.highlight.setScaleX(6);
			this.highlight.setScaleY(45);
			this.highlight.setPosition(-33, 0);
		},

		clearHighlight:function() {
			if (this.highlight) {
				this.highlight.removeFromParent();
			};
		},

		dropInInstruction:function(instruction, touchLocation) {
			var dropIndex = this.positionForDrop(touchLocation);
			this.insertInstructionInPosition(instruction, dropIndex);
		},

		insertInstructionInPosition:function(instruction, positionIndex) {
			this.instructions.splice(positionIndex, 0, instruction);
			for (var i = 0; i < this.instructions.length; i++) {
				this.spaces[i].setInstruction(this.instructions[i]);
			};
		},

	})

	return InstructionTicker;
})