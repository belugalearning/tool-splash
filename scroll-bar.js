define(['draggable'], function(Draggable) {
	'use strict';

	var ScrollBar = Draggable.extend({
		ctor:function() {
			this._super();
			this.vertical;
		},

		initWithOrientation:function(vertical) {
			this.vertical = vertical;
			var filename = vertical ? 'scroll_bar_vertical' : 'scroll_bar_horizontal';
			this.initWithFile(window.bl.getResource(filename));
			this.height = vertical ? this.getContentSize().height : this.getContentSize.width;
			this.barSprite = this.getCurrentBackgroundSprite();
			this.setZoomOnTouchDown(false);
		},

		getHeight:function() {
			return this.height;
		},

		setHeight:function(height) {
			this.height = height;
			if (this.vertical) {
				this.barSprite.setScaleY(height/this.barSprite.getContentSize().height);
			} else {
				this.barSprite.setScaleX(height/this.barSprite.getContentSize().width);
			};
		},
	});

	return ScrollBar;

})