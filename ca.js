/**
 * @author Mirko Bay
 * 
 * 2017-04-15
 * 
 * examples: https://dperjar.github.io/rule30/
 * http://cs.swan.ac.uk/~csandy/research/play/ca/
 * 
 */

// the amount of cells
var width = 200;
// the selected wolfram rule
var rule = 90;
// amount of generations
var generations = 500;
// counter used for the drawing
var generationCounter = 0;
// wrap the edges of the automata
var wrapEdges = true;
// length of a cell edge
var edge = 15;
// padding between the cells
var padding = 0;
// calculated width of the canvas element
var canvasWidth;
// calculated height of the canvas element
var canvasHeight;
// the canvas element itself
var canvas;
// int array with the cell values
var cells;
// int array with the binary ruleset
var ruleset;

/**
 * entry point, start the creation of the ca
 */
function startAutomata() {

	init();
	initCanvas();
	drawRow();
	for (var i = 0; i < generations; i++) {
		generate();
		generationCounter++;
		drawRow();
	}
}

/**
 * 
 * @param width
 * @param rule
 * @param wrapEdges
 * @returns
 */
function init() {

	wrapEdges = wrapEdges;
	cells = new Array(width);

	// insert the rules backward
	switch (rule) {
	case 90:
		ruleset = [ 0, 1, 0, 1, 1, 0, 1, 0 ];
		break;
	case 184:
		ruleset = [ 0, 0, 0, 1, 1, 1, 0, 1 ];
		break;
	default:
		System.exit(-1);
		;
		break;
	}

	for (var i = 0; i < cells.length; i++) {
		cells[i] = 0;
	}
	// All cells start with state 0, except the center
	// cell has state 1.
	cells[cells.length / 2] = 1;
}

/**
 * 
 * create a new generation, according to the selected ruleset and whether the
 * edges of the automata are wrapped
 * 
 */
function generate() {

	var nextgen = new Array(width);

	if (wrapEdges) {
		for (var i = 0; i < cells.length; i++) {

			// in java we need a trick for calculating modulo of negative
			// numbers
			var left = cells[((((i - 1) % cells.length) + cells.length) % cells.length)];
			var me = cells[i];
			var right = cells[(i + 1) % cells.length];
			nextgen[i] = rules(left, me, right);
		}
	} else {
		for (var i = 1; i < cells.length - 1; i++) {
			var left = cells[i - 1];
			var me = cells[i];
			var right = cells[i + 1];
			nextgen[i] = rules(left, me, right);
		}
	}

	cells = nextgen;
}

/**
 * look up the new state of the cell, depends of the selected ruleset
 * 
 * int a, int b, int c
 */
function rules(a, b, c) {
	var s = "" + a + b + c;
	var index = Number.parseInt(s, 2);
	return ruleset[index];
}

/**
 * 
 * initalize the canvas element, dynamically with the amount of generations and
 * cells
 * 
 */
function initCanvas() {

	canvas = document.getElementById("ca");
	canvasWidth = (edge + padding) * width;
	canvasHeight = (edge + padding) * generations;
	canvas.height = canvasHeight;
	canvas.width = canvasWidth;
	// set a initial background color
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

}

/**
 * 
 * draw a single generation to the canvas element
 * 
 */
function drawRow() {

	var ctx = canvas.getContext("2d");

	for (var i = 0; i < cells.length; i++) {
		if (cells[i] == 1) {
			ctx.fillStyle = "#ffffff";
			ctx.fillRect((i * (edge + padding)),
					(generationCounter * (edge + padding)), edge, edge);
			ctx.stroke();
		}
	}
}
