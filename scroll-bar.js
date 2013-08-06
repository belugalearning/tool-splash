define(['draggable'], function(Draggable) {
	'use strict';

	var ScrollBar = Draggable.extend({
		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('scroll_bar'));
			this.setZoomOnTouchDown(false);
			this.height = this.getContentSize().height;
			this.barSprite = this.getCurrentBackgroundSprite();
		},

		getHeight:function() {
			return this.height;
		},

		setHeight:function(height) {
			this.height = height;
			this.barSprite.setScaleY(height/this.barSprite.getContentSize().height);
		},
	});

	return ScrollBar;

})