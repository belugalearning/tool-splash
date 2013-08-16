define([], function() {
	'use strict';

	var upCommand = {
		include_in_container: true,
		instruction_parameters: {
			turn_to_direction:270,
			move_by_distance:1,
		},
		adjustable: false,
	};

	var downCommand = {
		include_in_container: true,
		instruction_parameters: {
			turn_to_direction:90,
			move_by_distance:1,
		},
		adjustable: false,
	};

	var leftCommand = {
		include_in_container: true,
		instruction_parameters: {
			turn_to_direction:180,
			move_by_distance:1,
		},
		adjustable: false,
	};

	var rightCommand = {
		include_in_container: true,
		instruction_parameters: {
			turn_to_direction:0,
			move_by_distance:1,
		},
		adjustable: false,
	};


	return {
		'InstructionTypes':
		{
			UP_ARROW: _.extend(_.clone(upCommand), {filename:"arrow_up"}),
			DOWN_ARROW: _.extend(_.clone(downCommand), {filename:"arrow_down"}),
			LEFT_ARROW: _.extend(_.clone(leftCommand), {filename:"arrow_left"}),
			RIGHT_ARROW: _.extend(_.clone(rightCommand), {filename:"arrow_right"}),


			DEGREES_30: {
				filename: "degrees_30",
				include_in_container: true,
				instruction_parameters: {
					turn_by_direction:30,
					move_by_distance:0,
				},
				adjustable: false,
			},

			DEGREES_45: {
				filename: "degrees_45",
				include_in_container: true,
				instruction_parameters: {
					turn_by_direction:45,
					move_by_distance:0,
				},
				adjustable: false,
			},

			DEGREES_60: {
				filename: "degrees_60",
				include_in_container: true,
				instruction_parameters: {
					turn_by_direction:60,
					move_by_distance:0,
				},
				adjustable: false,
			},

			DEGREES_90: {
				filename: "degrees_90",
				include_in_container: true,
				instruction_parameters: {
					turn_by_direction:90,
					move_by_distance:0,
				},
				adjustable: false,
			},

			DEGREES_BLANK: {
				filename: "degrees_questionmark",
				include_in_container:true,
				replace_with: ["DEGREES_VARIABLE"],
				setup:function() {
					var label = cc.LabelTTF.create("?", "mikadoBold", 20);
					this.addChild(label);
				},
			},

			DEGREES_VARIABLE: {
				filename: "degrees_blank",
				include_in_container: false,
				instruction_parameters: {
					turn_by_direction: 0,
					move_by_distance: 0,
				},
				setup:function() {
					var label = cc.LabelTTF.create("0°", "mikadoBold", 20);
					this.addChild(label);
					this.setAdjustableLabel(label);
				},
				adjustable: true,
				adjustable_parameter:"turn_by_direction",
				adjustable_min:0,
				adjustable_max:355,
				adjustable_step:5,
				formatter: function(string) {
					return string + "°";
				},
			},

			STEP_MULTIPLE: {
				filename: "step_multiple",
				include_in_container: true,
				replace_with:["STEP"],
			},

			STEP: {
				filename: "step_multiple_blank",
				include_in_container: false,
				instruction_parameters: {
					move_by_distance: 1,
				},
				setup:function() {
					var label = cc.LabelTTF.create("1", "mikadoBold", 16);
					label.setPosition(2, -6);
					this.addChild(label);
					this.setAdjustableLabel(label);
				},
				adjustable: true,
				adjustable_parameter: "move_by_distance",
				adjustable_min:1,
				adjustable_max:9,
				adjustable_step:1,
			},

			LOOP: {
				filename: "loop",
				include_in_container: true,
				replace_with:["OPEN_BRACKET", "CLOSE_BRACKET"],
			},

			OPEN_BRACKET: {
				filename: "blank_red",
				include_in_container: false,
				instruction_parameters: {
					loop_times: 2,
				},
				setup:function() {
					var bracketLabel = cc.LabelTTF.create("(", "mikadoBold", 20);
					bracketLabel.setPosition(10, 3);
					this.addChild(bracketLabel);
					this.numberOfLoopsLabel = cc.LabelTTF.create("2", "mikadoBold", 20);
					this.numberOfLoopsLabel.setPosition(-10, 3);
					this.addChild(this.numberOfLoopsLabel);
					this.setAdjustableLabel(this.numberOfLoopsLabel);

					this.loopCounter = new cc.Node();
					this.loopsSoFarLabel = cc.LabelTTF.create("0", "mikadoBold", 15);
					this.loopsSoFarLabel.setPosition(0, 15);
					this.loopCounter.addChild(this.loopsSoFarLabel);
					var ofLabel = cc.LabelTTF.create("of", "mikadoBold", 10);
					ofLabel.setPosition(0, 3);
					this.loopCounter.addChild(ofLabel);
					this.totalLoopsLabel = cc.LabelTTF.create("0", "mikadoBold", 15);
					this.totalLoopsLabel.setPosition(0, -10);
					this.loopCounter.addChild(this.totalLoopsLabel);

					this.loopCounter.setPosition(-10, 0);
					this.addChild(this.loopCounter);
					this.loopCounter.setVisible(false);
				},
				adjustable: true,
				adjustable_parameter: "loop_times",
				adjustable_min: 1,
				adjustable_max: 9,
				adjustable_step: 1,
			},

			CLOSE_BRACKET: {
				filename: "blank_red",
				include_in_container: false,
				setup:function() {
					var label = cc.LabelTTF.create(")", "mikadoBold", 20);
					label.setPosition(0, 3);
					this.addChild(label);
				},
				adjustable: false,
			},
			
			UP_WORD: _.extend(_.clone(upCommand), {filename:"up_word"}),
			DOWN_WORD: _.extend(_.clone(downCommand), {filename:"down_word"}),
			LEFT_WORD: _.extend(_.clone(leftCommand), {filename:"left_word"}),
			RIGHT_WORD: _.extend(_.clone(rightCommand), {filename:"right_word"}),

			NORTH: _.extend(_.clone(upCommand), {filename:"north"}),
			SOUTH: _.extend(_.clone(downCommand), {filename:"south"}),
			WEST: _.extend(_.clone(leftCommand), {filename:"west"}),
			EAST: _.extend(_.clone(rightCommand), {filename:"east"}),
		},

		'TurnStyles': {
			CLOCKWISE: 'clockwise',
			ANTICLOCKWISE: 'anticlockwise',
			SHORTEST: 'shortest',
			LONGEST: 'longest'
		},
	}

})