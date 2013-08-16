define(['instructiondragbutton', 'scrollbar', 'constants'], function(InstructionDragButton, ScrollBar, constants) {
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
            });

            this.setupScrollBar();

		},

		getPositionForInstruction:function(type) {
			return cc.p(50 + 63 * this.buttons.length, this.getContentSize().height/2 + 3);
		},

		setupScrollBar:function() {
			var self = this;

			var scrollBarLowerX = 20;
			var scrollBarUpperX = 1000;
			var scrollBarY = 16;

            var scrollBar = new ScrollBar();
            this.scrollBar = scrollBar;
            scrollBar.initWithOrientation(false);
            this.addChild(scrollBar);

            scrollBar.setDragAreaRect(cc.RectMake(scrollBarLowerX + scrollBar.bottomHeight(), scrollBarY,
                scrollBarUpperX - scrollBarLowerX - scrollBar.topHeight() - scrollBar.bottomHeight(), 0));
            var barSpace = scrollBarUpperX - scrollBarLowerX;
            var scrollNodeSpace = this.getPositionForInstruction(this.buttons.length - 1).x
            var height = (barSpace * this.getContentSize().width/scrollNodeSpace).putInBounds(20, barSpace);
            scrollBar.setHeight(height);
            var lowerLimit = scrollBarLowerX + scrollBar.getHeight()/2;
            var upperLimit = scrollBarUpperX - scrollBar.getHeight()/2;
            scrollBar.setPosition(cc.p(lowerLimit, scrollBarY));


            scrollBar.onTouchDown(function() {
                this.processUserScroll();
            });

            scrollBar.onMoved(function() {
                this.processUserScroll();
            });

            scrollBar.processUserScroll = function() {
                var scrollProportion = (this.getPosition().x - lowerLimit)/(upperLimit - lowerLimit);
                self.scrollNode.setPosition(-scrollProportion * (scrollNodeSpace - self.getContentSize().width), 0);
            };
		},
	})

	return InstructionBox;
})