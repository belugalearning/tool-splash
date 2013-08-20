## Overview

The splash tool allows the user to drag and drop a set of predefined instructions from a container into a 'ticker', which direct a sprite around a grid. The movement of the sprite can be started, paused, stopped and fastforwarded. Some of the instructions have changeable variables, allowing the user to vary the parameters of the instruction. The sprite also draws a line around the screen as it moves, tracing out a path as it goes.


## Initialising

When the page is first initialised, it sets up:
* An instruction container that holds the buttons for dragging instructions (note these buttons are a sprite with an invisible Draggable on top) 
* An instruction ticker that holds the list of instructions to follow 
* A splash node that is the parent of three nodes:
	* One that holds the grid dots 
	* One that holds the arrow 
	* A TraceNode (extended from DrawNode) that draws the line traced out by the arrow. 
* Control buttons (play, pause, fastforward, stop and clear)

It also sets up touch functions for the draggables.

It is intended in future to allow different sets of instructions and different splashNodes to allow movements on vectors, number line and coordinates.


## Instructions

The different instruction types are defined in "constants". The types have some or all of these keys:

* `include_in_container`: boolean that determines whether the instruction is shown in the container, some aren't (e.g., open/close brackets) and are only placed in the ticker when another instruction is dragged in.
* `instruction_parameters`: object that holds the default parameters for instructions (e.g., which angle to turn to or how far to move). The instructions' parameter property is set to a clone of this object.
* `adjustable`: boolean that determines whether the instruction has an adjustable variable. If so, when stopping touching an instruction it will display up/down arrows that change the variable value. If true, the instruction should also have keys:
	* `adjustable_parameter`: string key of the parameter in `instruction_parameters` that is changed by the up/down controls.
	* `adjustable_min`, `adjustable_max`, 'adjustable_step': numbers that determine the min/max and step side of the adjustable parameter.
	* `formatter`: function that takes a string as argument and returns the string that should be displayed on the instruction block.
	* The instruction should also have a property `adjustableLabel` as a child of the instruction block
* `filename`: The filename to pass into the window.bl.getResource() method for the background of the instruction draggable
* `setup`: function that runs other code after initialising the draggable, used to set up labels etc., note this code is not run to setup the dummy button as draggables have anchor points set differently to sprites so labels appear incorrectly.
* `replace_with`: array of strings, each a key of an instruction type to replace this one when it is dragged from the container to the ticker


## Dragging instructions

When an instruction in the container is clicked, it becomes visible, is removed from the container and added to the main layer. If dragged onto the ticker, it is removed from the main layer and added a descendent of the ticker (or replaced by other instructions, see `replace_by`. When dropped into the ticker the touch functions are changed (it may be worth refactoring this as the new touch functions are copy-pasted with only slight differences).

When an instruction is being dragged over the ticker there are highlights displayed, either a space for an instruction or the position between spaces. There is a workaround in the code for this to deal with the "Add to loop" instruction so that the instruction is highlighted instead of the space, since the "Add to loop" instruction is an instruction masquerading as an empty space.

The ticker has an array of instructionDraggables and an array of spaces which either have an instruction draggable in them or display the 'empty space' sprite. Whenever an instruction is added/removed, the instructions array is changed accordingly and then positioned in the spaces. There is another workaround here for the "Add to loop" instructions: when an open bracket and a close bracket appear one after the other we add an "Add to loop" instruction between them. The "Add to loop" instruction is not draggable.


## Scroll bars

This tool is the first done to use scroll bars. These are not yet reusable, which would be a useful refactoring at some point. At the moment both the bars are written on the fly with a little bit of it common code. It may be necessary to write seperate classes for vertical and horizontal bars since at the moment rotated draggables don't work (I think part of this might be a problem in Cocos2d javascript that I was having trouble with before, converting between touch spaces for rotated nodes seems to be screwy. The way anchor points are set for draggables at the moment is also causing a problem). At the moment there are seperate asset files for vertical and horizontal bars.

The scroll bars will resize depending on how big the area they need to scroll is, down to a minimum height. The bars a pretty thin so this will probably need revisiting if/when it's put into the app.


## Following instructions

The code to follow instructions is done by passing an array of the instructions to the arrow. The arrow then goes through the instructions one by one, setting up an array of functions (each one returning a ccSpeed of ccCallFunc) depending on the parameters of the instruction. We call these functions in turn and run the action they return. When we reach the end of the array we move on to the next instruction. The reason I have done it this way instead of using a ccSequence or similar method is that some of the actions can only be created when the arrow is in the state that it should be in at the beginning of the action and sequences require you to define the action before you create the sequence.

Open/close brackets are treated differently from the others as they alter the flow of instructions rather than the movement of the arrow.

The arrow's setPosition has been overridden so that it will go red and shake if the position is outside of its bounds. You can stop this with setIgnoreBoundary. If the arrow is made draggable then this might cause problems.

The main layer's update method has a check to see whether the arrow has started/stopped being played and, if so, will alter the tool accordingly (greying out buttons etc.). If the arrow's state has not changed it will not do anything else so this will not do unnecessary processing.


## Drawing the line

The line is drawn on a TraceNode, extended from DrawNode. The TraceNode has an array of points, called 'vertices', as well as a property 'currentVertex'. The setPosition/setRotation methods of the arrow have been overridden so that whenever the arrow moves forward, the current vertex is changed to the position of the arrow and the line from the last vertex to the current vertex is drawn, and whenever the arrow turns (in a different spot from the last turning point) it adds this vertex to the list of vertices and permanently draws the last line. This starts to slow down the drawing when there are about 300 elements in the TraceNode's buffer, which corresponds to about 150 straight lines (we also draw a dot at each vertex to give it a rounded corner).


## Play controls

The play controls work by changing the speed of the ccSpeeds, and pausing/resuming the arrow's actions. Clicking the clear button, any of the lattice points or the play/fastforward buttons when the arrow's been stopped will reset the splashNode (i.e., return the arrow to the starting position and clear the drawing).


## Representing the tool's state

The vertices of the shape being drawn are in the vertices property of the TraceNode. However, this is only created once the shape has been drawn, so if we want to run evaluation on shapes without drawing them we will need to do extra work. (Hacky way of doing it could be to set up an invisible splash node, follow the instructions at a very fast speed and look at the vertices). Potential problem is that it is easy to make instructions that will create many vertices (just stick 10 loops with 9 iterations each inside each other with a single instruction inside that and you've already got 3 billion instructions being processed), if we try and process it in advance without checking this it will crash.

There is some functionality for setting the arrow's movement from points instead of turn/move instructions. It is currently only used for the "Go to start" instruction but it would be probably be possible to use this to have a premade path for the arrow when we come to set questions for it. I think it would be relatively simple to predraw lines rather than having them strictly when the arrow traces them out.

There is currently no evaluation for the area/perimeter of the shape the arrow makes. It would be best to refactor out the code that does this for the geoboard. This is likely to be tricky since the geoboard uses quite a lot of geoboard-specific functionality to find the area. Hacky way of doing it would be to make the geoboard stuff common, then to find the area we make a new geoboard, a new band with the vertices of the arrow's path, and calculate the area using the prewritten functions. This sounds like a bad idea.