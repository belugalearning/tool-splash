define([], function() {
	'use strict';

	return {
		'InstructionTypes':
		{
			UP_ARROW: {
				filename:"arrow_up",
				include_in_container: true,
				container_position: 0,
				instruction_parameters: {
					turn_to_direction:270,
					move_by_distance:1,
				},
				adjustable: false,
			},

			DOWN_ARROW: {
				filename:"arrow_down",
				include_in_container: true,
				container_position: 1,
				instruction_parameters: {
					turn_to_direction:90,
					move_by_distance:1,
				},
				adjustable: false,
			},

			LEFT_ARROW: {
				filename: "arrow_left",
				include_in_container: true,
				container_position: 2,
				instruction_parameters: {
					turn_to_direction:180,
					move_by_distance:1,
				},
				adjustable: false,
			},

			RIGHT_ARROW: {
				filename: "arrow_right",
				include_in_container: true,
				container_position: 3,
				instruction_parameters: {
					turn_to_direction:0,
					move_by_distance:1,
				},
				adjustable: false,
			},

			DEGREES_30: {
				filename: "degrees_30",
				include_in_container: true,
				container_position: 4,
				instruction_parameters: {
					turn_by_direction:30,
					move_by_distance:0,
				},
				adjustable: false,
			},

			DEGREES_45: {
				filename: "degrees_45",
				include_in_container: true,
				container_position: 5,
				instruction_parameters: {
					turn_by_direction:45,
					move_by_distance:0,
				},
				adjustable: false,
			},

			DEGREES_60: {
				filename: "degrees_60",
				include_in_container: true,
				container_position: 6,
				instruction_parameters: {
					turn_by_direction:60,
					move_by_distance:0,
				},
				adjustable: false,
			},

			DEGREES_90: {
				filename: "degrees_90",
				include_in_container: true,
				container_position: 7,
				instruction_parameters: {
					turn_by_direction:90,
					move_by_distance:0,
				},
				adjustable: false,
			},

			STEP_MULTIPLE: {
				filename: "step_multiple",
				include_in_container: true,
				container_position: 8,
				replace_with:["STEP"],
			},

			STEP: {
				filename: "step",
				include_in_container: false,
				// container_position: 8,
				instruction_parameters: {
					move_by_distance: 1,
				},
				setup:function() {
					var label = cc.LabelTTF.create("1", "mikadoBold", 15);
					label.setPosition(2, -9);
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
				container_position: 9,
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
		},

		'TurnStyles': {
			CLOCKWISE: 'clockwise',
			ANTICLOCKWISE: 'anticlockwise',
			SHORTEST: 'shortest',
			LONGEST: 'longest'
		},
	}

})