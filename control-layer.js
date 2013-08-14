define(['blbutton'], function(BLButton) {

	var ControlLayer = cc.Layer.extend({
		ctor:function() {
			this._super();
			this.target;

			var upButton = new BLButton();
			upButton.registerWithTouchDispatcher = function() {
				cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, -210, true);
			};
			upButton.initWithFile(window.bl.getResource('up_button'));
			upButton.setPosition(0, 55);
			upButton.onTouchUp(function() {
				this.target.processUp();
			});
			this.addChild(upButton);
			this.upButton = upButton;

			var downButton = new BLButton();
			downButton.registerWithTouchDispatcher = function() {
				cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, -210, true);
			};
			downButton.initWithFile(window.bl.getResource('down_button'));
			downButton.setPosition(0, -60);
			downButton.onTouchUp(function() {
				this.target.processDown();
			});
			this.addChild(downButton);
			this.downButton = downButton;

			this.setActive(false);
		},

		onEnter:function() {
			this._super();
			this.setTouchEnabled(true);
			this.upButton.setTouchPriority(-210);
			this.downButton.setTouchPriority(-210);

		},

	    registerWithTouchDispatcher:function () {
	        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, -200, false);
	    },

	    setActive:function(active) {
	    	this.setVisible(active);
	    	this.upButton.setEnabled(active);
	    	this.downButton.setEnabled(active);
	    },

	    onTouchBegan:function() {
	    	return true;
	    },

		onTouchEnded:function() {
			this.setActive(false);
		},
	})

	return ControlLayer;

})