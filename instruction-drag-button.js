define(['instructiondraggable', 'constants'], function(InstructionDraggable, constants) {

	var InstructionTypes = constants["InstructionTypes"];

	var InstructionDragButton = cc.Node.extend({

		ctor:function() {
			this._super();
			this.draggable;
			this.dummyButton;
			this.startZOrder;
			this.type;

			this.moving = false;
		},

		initWithType:function(type) {
			this.type = type;

			this.setupDraggable();

			this.dummyButton = new cc.Sprite();
			this.dummyButton.initWithFile(window.bl.getResource(type['filename']));
			this.addChild(this.dummyButton);
		},

		setupDraggable:function() {
			this.draggable = new InstructionDraggable();
			this.draggable.initWithType(this.type);
			this.draggable.setVisible(false);
			this.draggable.setZOrder(1);
			this.addChild(this.draggable);
		},

		onTouchDown:function(cb) {
			this.draggable.onTouchDown(cb);
		},

		onMoved:function(cb) {
			this.draggable.onMoved(cb);
		},

		onMoveEnded:function(cb) {
			this.draggable.onMoveEnded(cb);
		},

		setEnabled:function(enabled) {
			this.draggable.setEnabled(enabled);
		},
	})

	return InstructionDragButton;

})