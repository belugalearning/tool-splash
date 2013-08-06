define(['canvasclippingnode', 'draggable', 'scrollbar', 'constants'], function(CanvasClippingNode, Draggable, ScrollBar, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionTicker = cc.Sprite.extend({
		ctor:function() {
			var self = this;
			this._super();
			this.initWithFile(window.bl.getResource('insert_panel'));
			var clipper = new CanvasClippingNode();
			var contentSize = this.getContentSize();
			var boxWidth = contentSize.width - 60;
			var boxHeight = contentSize.height - 29;
			clipper.drawPathToClip = function() {
				this.ctx.rect(15, -146, boxWidth, boxHeight);
			};
			var testBox = new cc.Sprite();
			this.addChild(clipper);

			var spacesPerRow = 13;
			this.numberOfRows = 10;
			var spacing = 12;
			this.spaceHeight = null;
			this.spaceWidth = null;

			var spacesNode = new cc.Node();
			spacesNode.height = function() {
				return self.numberOfRows * self.spaceHeight;
			}
			clipper.addChild(spacesNode);

			this.highlight = new cc.Sprite();
			this.highlight.initWithFile(window.bl.getResource('single_white_pixel'));
			this.highlight.setOpacity(128);

			this.instructions = [];

			this.spaces = [];
			for (var i = 0; i < this.numberOfRows * spacesPerRow; i++) {
				var space = new cc.Node();

				var emptySpace = new cc.Sprite();
				emptySpace.initWithFile(window.bl.getResource('insert_box'));
				space.addChild(emptySpace);
				space.emptySpace = emptySpace;
				if (this.spaceHeight === null) {
					this.spaceHeight = emptySpace.getContentSize().height + spacing;
				};
				if (this.spaceWidth === null) {
					this.spaceWidth = emptySpace.getContentSize().width + spacing;
				};

				space.setPosition(this.getPositionForInstructionSpace(i));
				space.positionIndex = i;
				spacesNode.addChild(space);
				this.spaces.push(space);
				

				space.instruction = null;
				space.setInstruction = function(instruction) {
					if (instruction !== null) {
						instruction.removeFromParent();
						instruction.setPosition(0,0);
						instruction.positionIndex = this.positionIndex;
						this.addChild(instruction);
						this.emptySpace.setVisible(false);
						this.instruction = instruction;
					} else {
						this.emptySpace.setVisible(true);
						this.instruction = null;
					};
				};
			};

			var scrollBarUpperY = 140;
			var scrollBarLowerY = 28;
			var scrollBarX = 914;

			var scrollBar = new ScrollBar();
			this.addChild(scrollBar);

			scrollBar.setDragAreaRect(cc.RectMake(scrollBarX, scrollBarLowerY, 0, scrollBarUpperY - scrollBarLowerY));

			scrollBar.lowerLimit = function() {
				return scrollBarLowerY + this.getHeight()/2;
			};

			scrollBar.upperLimit = function() {
				return scrollBarUpperY - this.getHeight()/2;
			}

			scrollBar.setHeightForNumberOfRows = function() {
				var scrollBarSpace = scrollBarUpperY - scrollBarLowerY;
				var height = (scrollBarSpace * boxHeight / spacesNode.height()).putInBounds(20, scrollBarSpace);
				this.setHeight(height);
			};
			scrollBar.setHeightForNumberOfRows();
			scrollBar.setPosition(cc.p(scrollBarX, scrollBarUpperY - scrollBar.height/2));

			scrollBar.scrollSpaceNode = function() {
				var height = this.getHeight();
				var scrollProportion = (scrollBar.upperLimit() - this.getPosition().y)/(scrollBar.upperLimit() - scrollBar.lowerLimit());
				spacesNode.setPosition(0, scrollProportion * (spacesNode.height() - 2 * self.spaceHeight));

			};

			scrollBar.onTouchDown(function() {
				this.scrollSpaceNode();
			});

			scrollBar.onMoved(function() {
				this.scrollSpaceNode();
			});
		},

		getPositionForInstructionSpace:function(index) {
			var positionsPerRow = 13;
			var row = Math.floor(index/positionsPerRow);
			var column = index % positionsPerRow;
			return cc.p(53 + column * this.spaceWidth, 115 - row * this.spaceHeight);
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

		positionInstructions:function() {
			for (var i = 0; i < this.instructions.length; i++) {
				this.instructions[i].removeFromParent();
			};
			for (var i = 0; i < this.spaces.length; i++) {
				var instruction = this.instructions[i] || null;
				this.spaces[i].setInstruction(instruction);
			};
		},

		dropInInstructionBox:function(instructionBox, touchLocation) {
			var dropIndex = this.positionForDrop(touchLocation);
			this.insertInstructionBoxInPosition(instructionBox, dropIndex);
			this.setInstructionTouchFunctions(instructionBox);
		},

		insertInstructionBoxInPosition:function(instructionBox, positionIndex) {
			this.instructions.splice(positionIndex, 0, instructionBox);
			this.positionInstructions();
		},

		setInstructionTouchFunctions:function(instructionBox) {
			var self = this;

			var highlighting = false;

			instructionBox.onTouchDown(function(touchLocation) {
				self.removeInstructions([this]);
				self.addChild(this);
				var position = self.convertToNodeSpace(touchLocation);
				this.setPosition(position);
			});


            instructionBox.onMoved(function(touchLocation) {
                if (self.touched(touchLocation)) {
                    var touchRelative = self.convertToNodeSpace(touchLocation);
                    self.highlightHovered(touchRelative);
                    highlighting = true;
                } else {
                    if (highlighting) {
                        self.clearHighlight();
                        highlighting = false;
                    };
                };
            });

            instructionBox.onMoveEnded(function(touchLocation) {
                if (self.touched(touchLocation)) {
                    var touchRelative = self.convertToNodeSpace(touchLocation);
                    this.removeFromParent();
	                self.dropInInstructionBox(this, touchRelative);
                } else {
                	self.removeInstructions([this].concat(this.linked));
                };
                if (highlighting) {
                    self.clearHighlight();
                    highlighting = false;
                };
            });
		},

		removeInstructions:function(instructions) {
			var self = this;
			this.instructions = _.difference(self.instructions, instructions);
			_.each(instructions, function(instruction) {
				instruction.removeFromParent();
			})
			this.positionInstructions();
		},

	})

	return InstructionTicker;
})