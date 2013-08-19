define(['canvasclippingnode', 'draggable', 'scrollbar', 'blbutton', 'controllayer', 'instructiondraggable', 'constants'], function(CanvasClippingNode, Draggable, ScrollBar, BLButton, ControlLayer, InstructionDraggable, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionTicker = cc.Sprite.extend({
		ctor:function() {
			var self = this;
			this._super();
			this.initWithFile(window.bl.getResource('insert_panel'));
			var clipper = new CanvasClippingNode();
			var contentSize = this.getContentSize();
			this.boxWidth = contentSize.width - 60;
			this.boxHeight = contentSize.height - 29;
			clipper.drawPathToClip = function() {
				this.ctx.rect(15, -146, self.boxWidth, self.boxHeight);
			};
			var testBox = new cc.Sprite();
			this.addChild(clipper);

			this.spacesPerRow = 13;
			this.startingNumberOfRows = 2;
			this.verticalSpacing = 10;
			this.horizontalSpacing = 12;
			this.spaceHeight = null;
			this.spaceWidth = null;

			this.spacesNode = new cc.Node();
			var spacesNode = this.spacesNode;
			spacesNode.height = function() {
				return self.spaceRows.length * self.spaceHeight;
			};
			clipper.addChild(this.spacesNode);

			this.instructions = [];
			this.valid;

			this.spaces;
			this.spaceRows = [];

			this.setupScrollBar();
			this.setupSpaceRows();

			this.highlight = new cc.Sprite();
			this.highlight.initWithFile(window.bl.getResource('single_white_pixel'));
			this.highlight.setOpacity(128);

			this.controlLayer = new ControlLayer();
			this.controlLayer.setTouchPriority(-200);
			this.addChild(this.controlLayer);

			this.playing = false;
		},

		setupScrollBar:function() {
			var self = this;

			var scrollBarUpperY = 140;
			var scrollBarLowerY = 28;
			var scrollBarX = 914;

			var scrollBar = new ScrollBar();
			scrollBar.initWithOrientation(true);
			this.scrollBar = scrollBar;
			this.addChild(scrollBar);

			scrollBar.setDragAreaRect(cc.RectMake(scrollBarX, scrollBarLowerY + scrollBar.bottomHeight(), 0,
				scrollBarUpperY - scrollBarLowerY - scrollBar.topHeight() - scrollBar.bottomHeight()));

			scrollBar.scrollProportion = 0;

			scrollBar.lowerLimit = function() {
				return scrollBarLowerY + this.getHeight()/2;
			};

			scrollBar.upperLimit = function() {
				return scrollBarUpperY - this.getHeight()/2;
			}

			scrollBar.scrollToProportion = function(proportion) {
				this.scrollProportion = Math.min(proportion, 1);
				scrollBar.setPosition(cc.p(scrollBarX, this.upperLimit() - this.scrollProportion * (this.upperLimit() - this.lowerLimit())));
				this.scrollSpaceNode();
				self.enableVisibleBoxes();
			},

			scrollBar.processUserScroll = function() {
				this.adjustProportion();
				this.scrollSpaceNode();
			}

			scrollBar.adjustProportion = function() {
				var height = this.getHeight();
				this.scrollProportion = (scrollBar.upperLimit() - this.getPosition().y)/(scrollBar.upperLimit() - scrollBar.lowerLimit());
			}

			scrollBar.scrollSpaceNode = function() {
				self.spacesNode.setPosition(0, this.scrollProportion * (self.spacesNode.height() - 2 * self.spaceHeight));
			};

			scrollBar.setHeightForNumberOfRows = function() {
				var scrollBarSpace = scrollBarUpperY - scrollBarLowerY;
				var height = (scrollBarSpace * self.boxHeight / self.spacesNode.height()).putInBounds(20, scrollBarSpace);
				this.setHeight(height);
				this.scrollToProportion(this.scrollProportion);
			};

			scrollBar.getNodeHeight = function() {
				return this.scrollProportion * (self.spacesNode.height() - self.boxHeight);
			},

			scrollBar.scrollToHeight = function(height) {
				var proportion = height/(self.spacesNode.height() - self.boxHeight);
				this.scrollToProportion(proportion);
			};

			scrollBar.scrollToRow = function(rowIndex) {
				var height = rowIndex * self.boxHeight;
				this.scrollToHeight(height);
			};

			scrollBar.setHeightForNumberOfRows();

			scrollBar.onTouchDown(function() {
				this.processUserScroll();
			});

			scrollBar.onMoved(function() {
				this.processUserScroll();
			});

			scrollBar.onMoveEnded(function() {
				self.enableVisibleBoxes();
			});
		},

		enableVisibleBoxes:function() {
			if (!this.playing) {
				var visibleBox = cc.RectMake(15, 10, this.boxWidth, this.boxHeight);
				for (var i = 0; i < this.instructions.length; i++) {
					var instruction =  this.instructions[i];
					var positionInWorld = instruction.getParent().convertToWorldSpace(instruction.getPosition());
					var positionInTicker = this.convertToNodeSpace(positionInWorld);
					if (cc.rectContainsPoint(visibleBox, positionInTicker)) {
						instruction.setEnabled(true);
					} else {
						instruction.setEnabled(false);
					};
				};
			};
		},

		setupSpaceRows:function() {
			for (var i = 0; i < this.startingNumberOfRows; i++) {
				this.addSpaceRow(i);
			};
			this.processChangeInNumberOfRows();
		},

		addSpaceRow:function(index) {
			var spaceRow = new cc.Node();
			spaceRow.spaces = [];
			for (var j = 0; j < this.spacesPerRow; j++) {

				var space = new cc.Node();

				var emptySpace = new cc.Sprite();
				emptySpace.initWithFile(window.bl.getResource('insert_box'));
				space.addChild(emptySpace);
				space.emptySpace = emptySpace;
				if (this.spaceHeight === null) {
					this.spaceHeight = emptySpace.getContentSize().height + this.verticalSpacing;
				};
				if (this.spaceWidth === null) {
					this.spaceWidth = emptySpace.getContentSize().width + this.horizontalSpacing;
				};

				space.setPosition(53 + j * this.spaceWidth, 0);
				space.positionIndex = index * this.spacesPerRow + j;
				spaceRow.addChild(space);
				spaceRow.spaces.push(space);

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
			this.spaceRows.push(spaceRow);
			spaceRow.setPosition(0, 115 - index * this.spaceHeight);
			this.spacesNode.addChild(spaceRow);

		},

		removeLastSpaceRow:function() {
			var lastRow = this.spaceRows[this.spaceRows.length - 1];
			lastRow.removeFromParent();
			this.spaceRows.splice(this.spaceRows.length - 1, 1);
		},

		processChangeInNumberOfRows:function() {
			this.correctSpaces();
			this.scrollBar.setHeightForNumberOfRows();
		},

		correctSpaces:function() {
			var self = this;
			this.spaces =  _.reduce(self.spaceRows, function(memo, spaceRow) {return memo.concat(spaceRow.spaces)}, []);
		},

		getPositionForInstructionSpace:function(index) {
			var positionsPerRow = 13;
			var row = Math.floor(index/positionsPerRow);
			var column = index % positionsPerRow;
			return cc.p(53 + column * this.spaceWidth, 115 - row * this.spaceHeight);
		},

		positionForDrop:function(touchLocation) {
			var dropIndex;
			var leftPositionRelativeToSpace = cc.p(-this.spaceWidth/2, 0);
			for (var i = 0; i < this.spaces.length; i++) {
				var space = this.spaces[i];
				var leftPositionWorld = space.convertToWorldSpace(leftPositionRelativeToSpace);
				var leftPosition = this.convertToNodeSpace(leftPositionWorld);
				if (space.instruction === null) {
					dropIndex = i;
					break;
				} else if (Math.abs(leftPosition.x - touchLocation.x) < this.spaceWidth/2 && Math.abs(leftPosition.y - touchLocation.y) < this.spaceHeight/2) {
					dropIndex = i;
					break;
				};
			};
			return dropIndex;
		},

		highlightHovered:function(touchLocation) {
			var index = this.positionForDrop(touchLocation);
			var highlightSpace = this.spaces[index];

			this.clearHighlight();
			if (highlightSpace.instruction === null || highlightSpace.instruction.type === InstructionTypes.INSERT_IN_LOOP) {
				this.highlightSpace(highlightSpace);
			} else {
				var previousSpace = this.spaces[index-1];
				if (previousSpace !== undefined && previousSpace.instruction.type === InstructionTypes.INSERT_IN_LOOP) {
					this.highlightSpace(previousSpace);
				} else {
					this.highlightBeforeSpace(highlightSpace);
				};
			};
		},

		highlightSpace:function(space) {
			this.highlight.setScale(53);
			this.highlight.setPosition(0,0);
			space.addChild(this.highlight);
		},

		highlightBeforeSpace:function(space) {
			this.highlight.setScaleX(6);
			this.highlight.setScaleY(45);
			this.highlight.setPosition(-33, 0);
			space.addChild(this.highlight);
		},

		clearHighlight:function() {
			if (this.highlight) {
				this.highlight.removeFromParent();
			};
		},

		positionInstructions:function() {
			for (var i = this.instructions.length - 1; i >= 0; i--) {
				var instruction = this.instructions[i];
				instruction.removeFromParent();
				if (instruction.type === InstructionTypes.INSERT_IN_LOOP) {
					this.instructions.splice(i, 1);
				} else if (instruction.type === InstructionTypes.OPEN_BRACKET) {
					var close = instruction.linked[0];
					if (this.instructions.indexOf(close) === i + 1) {
						var addTip = new InstructionDraggable();
						addTip.initWithType(InstructionTypes.INSERT_IN_LOOP);
						this.insertInstructionBoxInPosition(addTip, i+1);
					};
				};
			};
			for (var i = 0; i < this.spaces.length; i++) {
				var instruction = this.instructions[i] || null;
				this.spaces[i].setInstruction(instruction);
			};
			var totalNumberOfRows = this.spaceRows.length;
			var numberOfRowsUsed = Math.ceil(this.instructions.length/this.spacesPerRow);
			if (numberOfRowsUsed >= totalNumberOfRows) {
				this.changeSpaceRows(true);
			} else if (numberOfRowsUsed <= totalNumberOfRows - 2 && numberOfRowsUsed >= 1) {
				this.changeSpaceRows(false);
			};
		},

		linkBrackets:function() {
			var valid = true;
			var stack = [];
			var pairs = [];
			for (var i = 0; i < this.instructions.length; i++) {
				var instruction = this.instructions[i];
				if (instruction.type === InstructionTypes.OPEN_BRACKET) {
					stack.push(instruction);
				} else if (instruction.type === InstructionTypes.CLOSE_BRACKET) {
					if (stack.length === 0) {
						valid = false;
						break;
					} else {
						var open = stack.pop();
						pairs.push([open, instruction]);
					};
				};
			};
			if (stack.length !== 0) {
				valid = false;
			};
			if (valid) {
				for (var i = 0; i < pairs.length; i++) {
					var pair = pairs[i];
					pair[0].linked = [pair[1]];
					pair[1].linked = [pair[0]];
				};
			}
			this.valid = valid;
		},

		changeSpaceRows:function(increase) {
			var height = this.scrollBar.getNodeHeight();
			if (increase) {
				this.addSpaceRow(this.spaceRows.length);
			} else {
				this.removeLastSpaceRow();
			};
			this.processChangeInNumberOfRows();
			this.scrollBar.scrollToHeight(height);
		},

		dropInInstructionBoxes:function(instructionBoxes, touchLocation) {
			var dropIndex = this.positionForDrop(touchLocation);
			for (var i = 0; i < instructionBoxes.length; i++) {
				var instructionBox = instructionBoxes[i];
				this.insertInstructionBoxInPosition(instructionBox, dropIndex + i);
				this.setInstructionTouchFunctions(instructionBox);
			};
			this.linkBrackets();
			this.positionInstructions();
			var controlsVisible = false;
			for (var i = 0; i < instructionBoxes.length; i++) {
				var instructionBox = instructionBoxes[i];
				if (instructionBox.type['adjustable'] && !controlsVisible) {
					this.showControlForInstruction(instructionBox);
					controlsVisible = true;
				};
			};
		},

		insertInstructionBoxInPosition:function(instructionBox, positionIndex) {
			this.instructions.splice(positionIndex, 0, instructionBox);
		},

		setInstructionsDraggable:function(draggable) {
			for (var i = 0; i < this.instructions.length; i++) {
				this.instructions[i].setEnabled(draggable);
			};
		},

		setInstructionTouchFunctions:function(instructionBox) {
			var self = this;

			var highlighting = false;

			var dragged = false;

			instructionBox.onTouchDown(function(touchLocation) {
			});


            instructionBox.onMoved(function(touchLocation) {
            	if (!dragged) {
            		if (this.distanceMoved() > 10) {
            			dragged = true;
						this.highlight(false);
						self.removeInstructions([this]);
						self.addChild(this);
						var position = self.convertToNodeSpace(touchLocation);
						this.setPosition(position);
            		};
            	} else {
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
            	};
            });

            instructionBox.onMoveEnded(function(touchLocation) {
                if (self.touched(touchLocation)) {
                	if (!dragged) {
                		this.returnToLastPosition()
                	} else {;
	                    var touchRelative = self.convertToNodeSpace(touchLocation);
	                    this.removeFromParent();
		                self.dropInInstructionBoxes([this], touchRelative);

		            	dragged = false;
		            }
	        		if (this.type['adjustable']) {
	            		self.showControlForInstruction(this);
	        		};
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

		clearInstructions:function() {
			this.removeInstructions(this.instructions);
			while (this.spaceRows.length > 2) {
				this.removeLastSpaceRow();
			};
			this.processChangeInNumberOfRows();
		},

		unhighlightAll:function() {
			for (var i = 0; i < this.instructions.length; i++) {
				this.instructions[i].highlight(false);
			};
		},

		showControlForInstruction:function(instruction) {
			var index = this.instructions.indexOf(instruction);
			this.controlLayer.setTarget(instruction);
			var positionInWorld = this.spaces[index].getParent().convertToWorldSpace(this.spaces[index].getPosition());
			var position = this.convertToNodeSpace(positionInWorld);
			this.controlLayer.setPosition(position);
			this.controlLayer.setActive(true);
		},

		setPlaying:function(playing) {
			this.playing = playing;
			this.showPlayingDisplay(playing);
			this.setInstructionsDraggable(!playing);
			if (!playing) {
				this.unhighlightAll();
			};
		},

		showPlayingDisplay:function(playing) {
			for (var i = 0; i < this.instructions.length; i++) {
				var instruction = this.instructions[i];
				if (instruction.type === InstructionTypes.OPEN_BRACKET) {
					instruction.numberOfLoopsLabel.setVisible(!playing);
					instruction.loopCounter.setVisible(playing);
					if (playing) {
						instruction.totalLoopsLabel.setString(instruction.parameters['loop_times']);
					};
				};
			};
		},


		showInvalidBrackets:function() {
			var brackets = [];
			for (var i = 0; i < this.instructions.length; i++) {
				var instruction = this.instructions[i];
				if (instruction.type === InstructionTypes.OPEN_BRACKET || instruction.type === InstructionTypes.CLOSE_BRACKET) {
					brackets.push(instruction);
				};
			};
			var shakeAction = function(index) {
				var shakes = [];
				var homePosition = brackets[index].getPosition();
				var radius = 7;
				for (var i = 0; i < 20; i++) {
					var angle = i * 0.618 * Math.PI * 2;
					var offset = cc.p(Math.random() * 2 + radius * Math.cos(angle), Math.random() * 2 + radius * Math.sin(angle));
					var shake = cc.MoveTo.create(0.05, cc.pAdd(homePosition, offset));
					shakes.push(shake);
				};
				var returnAction = cc.MoveTo.create(0.05, homePosition);
				shakes.push(returnAction);
				var sequence = cc.Sequence.create(shakes);
				return sequence;
			};
			for (var i = 0; i < brackets.length; i++) {
				brackets[i].runAction(shakeAction(i));
			};
		},
	})

	return InstructionTicker;
})