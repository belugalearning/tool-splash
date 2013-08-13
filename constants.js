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
			},

			DOWN_ARROW: {
				filename:"arrow_down",
				include_in_container: true,
				container_position: 1,
				instruction_parameters: {
					turn_to_direction:90,
					move_by_distance:1,
				},
			},

			LEFT_ARROW: {
				filename: "arrow_left",
				include_in_container: true,
				container_position: 2,
				instruction_parameters: {
					turn_to_direction:180,
					move_by_distance:1,
				}
			},

			RIGHT_ARROW: {
				filename: "arrow_right",
				include_in_container: true,
				container_position: 3,
				instruction_parameters: {
					turn_to_direction:0,
					move_by_distance:1,
				}
			},

			DEGREES_30: {
				filename: "degrees_30",
				include_in_container: true,
				container_position: 4,
				instruction_parameters: {
					turn_by_direction:30,
					move_by_distance:0,
				}
			},

			DEGREES_45: {
				filename: "degrees_45",
				include_in_container: true,
				container_position: 5,
				instruction_parameters: {
					turn_by_direction:45,
					move_by_distance:0,
				}
			},

			DEGREES_60: {
				filename: "degrees_60",
				include_in_container: true,
				container_position: 6,
				instruction_parameters: {
					turn_by_direction:60,
					move_by_distance:0,
				}
			},

			DEGREES_90: {
				filename: "degrees_90",
				include_in_container: true,
				container_position: 7,
				instruction_parameters: {
					turn_by_direction:90,
					move_by_distance:0,
				}
			},

			STEP: {
				filename: "step",
				include_in_container: true,
				container_position: 8,
				instruction_parameters: {
					move_by_distance: 1,
				}
			},

			LOOP: {
				filename: "loop",
				include_in_container: true,
				container_position: 9,
			},

			OPEN_BRACKET: {
				filename: "blank_red",
				include_in_container: false,
				instruction_parameters: {
					loop_times: 2,
				},
				label: "(",
			},

			CLOSE_BRACKET: {
				filename: "blank_red",
				include_in_container: false,
				label: ")",
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