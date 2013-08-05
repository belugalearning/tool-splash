define([], function() {
	'use strict';

	return {
		'InstructionTypes':
		{
			UP_ARROW: {
				filename:"arrow_up",
				include_in_container: true,
				container_position: 0,
				instruction:function() {
					console.log("Move up!");
				},
			},

			DOWN_ARROW: {
				filename:"arrow_down",
				include_in_container: true,
				container_position: 1,
				instruction:function() {
					console.log("Move down!");
				},
			},

			LEFT_ARROW: {
				filename: "arrow_left",
				include_in_container: true,
				container_position: 2,
				instruction:function() {
					console.log("Move left!");
				},
			},

			RIGHT_ARROW: {
				filename: "arrow_right",
				include_in_container: true,
				container_position: 3,
				instruction:function() {
					console.log("Move right!");
				},
			},

			DEGREES_30: {
				filename: "degrees_30",
				include_in_container: true,
				container_position: 4,
				instruction:function() {
					console.log("Turn 30!");
				},
			},

			DEGREES_45: {
				filename: "degrees_45",
				include_in_container: true,
				container_position: 5,
				instruction:function() {
					console.log("Turn 45!");
				},
			},

			DEGREES_60: {
				filename: "degrees_60",
				include_in_container: true,
				container_position: 6,
				instruction:function() {
					console.log("Turn 60!");
				},
			},

			DEGREES_90: {
				filename: "degrees_90",
				include_in_container: true,
				container_position: 7,
				instruction:function() {
					console.log("Turn 90!");
				},
			},

			LOOP: {
				filename: "loop",
				include_in_container: true,
				container_position: 8,
				instruction:function() {
					console.log("Loop!");
				},
			},

			OPEN_BRACKET: {
				filename: "blank_red",
				include_in_container: false,
				label: "(",
				instruction:function() {
					console.log("HUH?");
				},
			},

			CLOSE_BRACKET: {
				filename: "blank_red",
				include_in_container: false,
				label: ")",
				instruction:function() {
					console.log("Urgh");
				},
				
			},
		}
	}

})