define(['draggable', 'constants'], function(Draggable, constants) {

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionDragButton = cc.Node.extend({

		ctor:function() {
			this._super();
			this.draggable;
			this.dummyButton;
		},

		initWithInstructionType:function(type) {
			this.initWithFile(window.bl.getResource(type["filename"]));
		},

		initWithFile:function(filename) {
			var self = this;

			this.draggable = new Draggable();
			this.draggable.initWithFile(filename);
			this.draggable.setZoomOnTouchDown(false);
			this.draggable.setVisible(false);
			this.draggable.setZOrder(1);
			this.addChild(this.draggable);



			this.draggable.onTouchDown(function() {
				this.setVisible(true);
				self.getParent().reorderChild(self, 100);
			})

			this.draggable.onMoveEnded(function() {
				self.getParent().reorderChild(self, 0);
				this.setVisible(false);
				this.returnToHomePosition();
			})

			this.dummyButton = new cc.Sprite();
			this.dummyButton.initWithFile(filename);
			this.addChild(this.dummyButton);
		},
	})

	return InstructionDragButton;

})