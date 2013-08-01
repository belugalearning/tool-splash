define([], function() {
	'use strict';

	return {
		'InstructionTypes':
		{
			UP_ARROW: {
				filename:"arrow_up",
				container_position: {row: 0, column: 0},
				instruction:function() {
					console.log("Move up!");
				},
			},

			DOWN_ARROW: {
				filename:"arrow_down",
				container_position: {row: 0, column: 1},
				instruction:function() {
					console.log("Move down!");
				},
			},

			LEFT_ARROW: {
				filename: "arrow_left",
				container_position: {row: 0, column: 2},
				instruction:function() {
					console.log("Move left!");
				},
			},

			RIGHT_ARROW: {
				filename: "arrow_right",
				container_position: {row: 0, column: 3},
				instruction:function() {
					console.log("Move right!");
				},
			},

			DEGREES_30: {
				filename: "degrees_30",
				container_position: {row: 1, column: 0},
				instruction:function() {
					console.log("Turn 30!");
				},
			},

			DEGREES_45: {
				filename: "degrees_45",
				container_position: {row: 1, column: 1},
				instruction:function() {
					console.log("Turn 45!");
				},
			},

			DEGREES_60: {
				filename: "degrees_60",
				container_position: {row: 1, column: 2},
				instruction:function() {
					console.log("Turn 60!");
				},
			},

			DEGREES_90: {
				filename: "degrees_90",
				container_position: {row: 1, column: 3},
				instruction:function() {
					console.log("Turn 90!");
				},
			}
		}
	}

})