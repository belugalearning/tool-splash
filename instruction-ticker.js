define([], function() {
	'use strict';

	var InstructionTicker = cc.Sprite.extend({
		ctor:function() {
			this._super();
			this.initWithFile(window.bl.getResource('ControlCentre_bg'));

			var panel = new cc.Sprite();
			panel.initWithFile(window.bl.getResource('ControlCentre_panel'));
			panel.setPosition(this.getAnchorPointInPoints());
			this.addChild(panel);
		}

	})

	return InstructionTicker;
})