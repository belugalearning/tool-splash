define(['draggable'], function(Draggable) {
	'use strict';

	var ScrollBar = Draggable.extend({
		ctor:function() {
			this._super();
			this.vertical;
			this.height;
		},

		initWithOrientation:function(vertical) {
/*			this.vertical = vertical;
			var filename = vertical ? 'scroll_bar_vertical' : 'scroll_bar_horizontal';
			this.initWithFile(window.bl.getResource(filename));
			this.setZoomOnTouchDown(false);*/

			this.vertical = vertical;
			var filenameInsert = vertical ? "vertical" : "horizontal";
			this.initWithFile(window.bl.getResource("scrollbar_" + filenameInsert + "_middle"));
			this.barSprite = this.getCurrentBackgroundSprite();

			this.top = new cc.Sprite();
			this.top.initWithFile(window.bl.getResource("scrollbar_" + filenameInsert + "_top"));
			this.addChild(this.top);
			this.bottom = new cc.Sprite();
			this.bottom.initWithFile(window.bl.getResource("scrollbar_" + filenameInsert + "_bottom"));
			this.addChild(this.bottom);

			this.setZoomOnTouchDown(false);
			// this.height = vertical ? this.getContentSize().height : this.getContentSize().width;

		},

		getHeight:function() {
			return this.height;
		},

		setHeight:function(height) {
			this.height = height;
			if (this.vertical) {
				var topHeight = this.top.getContentSize().height;
				var bottomHeight = this.bottom.getContentSize().height;
				this.barSprite.setScaleY((height - topHeight - bottomHeight)/this.barSprite.getContentSize().height);
				this.top.setPosition(0, height/2 - topHeight/2);
				this.bottom.setPosition(0, -height/2 + bottomHeight/2);
			} else {
				var topWidth = this.top.getContentSize().width;
				var bottomWidth = this.bottom.getContentSize().width;
				this.barSprite.setScaleX((height - topWidth - bottomWidth)/this.barSprite.getContentSize().width);
				this.top.setPosition(-height/2 + topWidth/2, 0);
				this.bottom.setPosition(height/2 - bottomWidth/2, 0);
			};
		},

		topHeight:function() {
			return this.vertical ? this.top.getContentSize().height : this.top.getContentSize().width;
		},

		bottomHeight:function() {
			return this.vertical ? this.bottom.getContentSize().height : this.bottom.getContentSize().width;
		},
	});

	return ScrollBar;

})