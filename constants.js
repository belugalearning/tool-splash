define([], function() {
	'use strict';

	return {
		'InstructionTypes':
		{
			UP_ARROW: {
				filename:"arrow_up",
				container_position: 0,
				instruction:function() {
					console.log("Move up!");
				},
			},

			DOWN_ARROW: {
				filename:"arrow_down",
				container_position: 1,
				instruction:function() {
					console.log("Move down!");
				},
			},

			LEFT_ARROW: {
				filename: "arrow_left",
				container_position: 2,
				instruction:function() {
					console.log("Move left!");
				},
			},

			RIGHT_ARROW: {
				filename: "arrow_right",
				container_position: 3,
				instruction:function() {
					console.log("Move right!");
				},
			},

			DEGREES_30: {
				filename: "degrees_30",
				container_position: 4,
				instruction:function() {
					console.log("Turn 30!");
				},
			},

			DEGREES_45: {
				filename: "degrees_45",
				container_position: 5,
				instruction:function() {
					console.log("Turn 45!");
				},
			},

			DEGREES_60: {
				filename: "degrees_60",
				container_position: 6,
				instruction:function() {
					console.log("Turn 60!");
				},
			},

			DEGREES_90: {
				filename: "degrees_90",
				container_position: 7,
				instruction:function() {
					console.log("Turn 90!");
				},
			}
		}
	}

})