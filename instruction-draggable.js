define(['draggable', 'constants'], function(Draggable, constants) {
	'use strict';

	var InstructionTypes = constants["InstructionTypes"];

	var Instruction = Draggable.extend({
		ctor:function() {
			this._super();
			this.instruction;
			this.type;
			this.highlighter;
			this.adjustableLabel;
			this.setChangePositionOnTouchDown(false);
		},

		initWithType:function(type) {
			this.initWithFile(window.bl.getResource(window.bl.getResource(type['filename'])));
			this.type = type;
			this.parameters = _.clone(type['instruction_parameters']);
			this.setZoomOnTouchDown(false);
			if (this.type['setup']) {
				this.type['setup'].call(this);
			};
			this.highlighter = new cc.Sprite();
			this.highlighter.initWithFile(window.bl.getResource('block_highlight'));
			this.highlighter.setPosition(0, 3);
			this.addChild(this.highlighter);
			this.highlighter.setVisible(false);

			var self = this;
			if (this.type['adjustable']) {
				var formatString = function(string) {
					var returnString;
					if (self.type['formatter']) {
						returnString = self.type['formatter'].call(null, string);
					} else {
						returnString = string;
					};
					return returnString;
				};

				this.processUp = function() {
					var adjustableParameter = this.parameters[this.type["adjustable_parameter"]];
					if (adjustableParameter < this.type['adjustable_max']) {
						adjustableParameter = Math.min(this.type['adjustable_max'], adjustableParameter + this.type['adjustable_step']);
						if (this.adjustableLabel !== undefined) {
							this.adjustableLabel.setString(formatString(adjustableParameter + ""));
						};
					};
					this.parameters[this.type["adjustable_parameter"]] = adjustableParameter;
				};
				this.processDown = function() {
					var adjustableParameter = this.parameters[this.type["adjustable_parameter"]];
					if (adjustableParameter > this.type['adjustable_min']) {
						adjustableParameter = Math.max(this.type['adjustable_min'], adjustableParameter - this.type['adjustable_step']);
						if (this.adjustableLabel !== undefined) {
							this.adjustableLabel.setString(formatString(adjustableParameter + ""));
						};
					};
					this.parameters[this.type["adjustable_parameter"]] = adjustableParameter;
				};
			};
		},


		setAdjustableLabel:function(label) {
			this.adjustableLabel = label;
		},

		highlight:function(highlight) {
			this.highlighter.setVisible(highlight);
		},
	})

	return Instruction
})