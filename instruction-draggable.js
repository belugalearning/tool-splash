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
			this.highlighter.initWithFile(window.bl.getResource('blank_grey'));
			this.addChild(this.highlighter);
			this.highlighter.setOpacity(128);
			this.highlighter.setVisible(false);

			var self = this;
			if (this.type['adjustable']) {
				this.processUp = function() {
					var adjustableParameter = this.parameters[this.type["adjustable_parameter"]];
					if (adjustableParameter < this.type['adjustable_max']) {
						adjustableParameter = Math.min(this.type['adjustable_max'], adjustableParameter + this.type['adjustable_step']);
						if (this.adjustableLabel !== undefined) {
							this.adjustableLabel.setString(adjustableParameter);
						};
					};
					this.parameters[this.type["adjustable_parameter"]] = adjustableParameter;
				};
				this.processDown = function() {
					var adjustableParameter = this.parameters[this.type["adjustable_parameter"]];
					if (adjustableParameter > this.type['adjustable_min']) {
						adjustableParameter = Math.max(this.type['adjustable_min'], adjustableParameter - this.type['adjustable_step']);
						if (this.adjustableLabel !== undefined) {
							this.adjustableLabel.setString(adjustableParameter);
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