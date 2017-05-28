/**
 * @author Mirko Bay
 *
 * 2017-04-15
 *
 * examples: https://dperjar.github.io/rule30/
 * http://cs.swan.ac.uk/~csandy/research/play/ca/
 *
 *  @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
 *
 */

// TODO: only odd width
// TODO: numb of ruleset in specific range

// the amount of cells
var width = 50;
// the selected wolfram rule
var rule = 90;
// amount of generations
var generations = 100;
// counter used for the drawing
var generationCounter = 0;
// wrap the edges of the automata
var wrapEdges = true;
// length of a cell edge
var edge = 5;
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
// if true, there are multiple "living cells" at the beginning on a randomized position -> disorderd initial state
var randomStart = false;

/**
 * entry point, start the creation of the ca
 */
function startAutomata() {
    generationCounter = 0;

    getValuesFromInputElements();
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
 * set the ruleset and create the first generation
 *
 */
function init() {

    cells = new Array(width);

    var ruleAsBinary = rule.toString(2);
    if (ruleAsBinary.length < 8) {
        ruleAsBinary = new Array(9 - ruleAsBinary.length).join("0") + ruleAsBinary;
    }
    var ruleAsBinaryReversed = ruleAsBinary.split("").reverse();
    for (var j = 0; j < ruleAsBinaryReversed.length; j++) {
        ruleAsBinaryReversed[j] = parseInt(ruleAsBinaryReversed[j]);
    }
    ruleset = ruleAsBinaryReversed;


    if (randomStart) {
        // disorderd initial state
        for (var i = 0; i < cells.length; i++) {
            var random = Math.random();
            if (random < 0.5) {
                cells[i] = 0;
            } else {
                cells[i] = 1;
            }
        }
    } else {
        // All cells start with state 0, except the center cell has state 1.
        for (var i = 0; i < cells.length; i++) {
            cells[i] = 0;
        }

        cells[cells.length / 2] = 1;
    }

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
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        if (cells[i] === 1) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect((i * (edge + padding)),
                (generationCounter * (edge + padding)), edge, edge);
            ctx.stroke();
        }
    }
}

function getValuesFromInputElements() {

    generations = parseInt(document.getElementById("generations").value);
    width = parseInt(document.getElementById("width").value);
    rule = parseInt(document.getElementById("rule").value);
    if (document.getElementById("randomStart").checked) {
        randomStart = true;
    } else {
        randomStart = false;
    }
}




// @license-end