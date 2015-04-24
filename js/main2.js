// main2.js

//

'use strict'

var Originator = function () {
/*

*/

	var originator = {};

	originator.node = null;

	// =================
	// GENERAL
	// =================
	var utils = {};

	utils.setAttributes = function ( elem, attrs ) {
	/*

	Sets a bunch of attributes all at once because that's annoying
	and messy
	Use Example: setAttributes(elem, {"width": "50%, "height": "100%", ...});
	*/
		for( var key in attrs ) {
			elem.setAttribute( key, attrs[key] );
		}

		return elem;
	};  // End utils.setAttributes()

	// =================
	// INITIALIZATION
	// =================
	var buildContainerDiv = function () {

		var container 		= document.createElement('div');
		container.className = 'originator';

		var attributes 		= {
			// 'visbility': 'hidden',
			'style': 'position: absolute; left: 200px; top: 100px;' +
			'z-index: 200; pointer-events: none;' +
			'width: 100px; height: 100px'
		}; // end attributes{}

		utils.setAttributes( container, attributes );

		// container.style.position = 'absolute';

		return container;
	};  // End buildContainerDiv()


	var buildSVG 	= function ( NS ) {

		var svg 		= document.createElementNS( NS,'svg' );
		var attributes 	= {
			'version': '1.1', 'width': '100%', 'height': '100%',
			'style': 'overflow: visible; pointer-events: all;'
		};

		utils.setAttributes( svg, attributes );

		return svg;
	};  // End buildSVG()


	var buildLine 	= function ( NS, strokeColor, strokeWidth, strokeLength ) {
	/*

	Build one originator line. Goes from top left to bottom right.
	*/
		var line 		= document.createElementNS( NS,'line' );
		var attributes 	= {
			'x1': '0', 'y1': '0', 'x2': '100%', 'y2': '100%',
			'stroke': strokeColor, 'stroke-width': strokeWidth
		};

		utils.setAttributes( line, attributes);
		// line.setAttribute( 'stroke-linecap', 'butt' );

		return line;
	}  // End buildLine()


	var buildCircle = function ( NS, placement ) {
	/*

	Build originator circles
	*/
		// Sizes
		var radius = 4, strokeWidth = 1.5;

		var circle 		= document.createElementNS( NS, 'circle' );
		var attributes 	= {
			'cx': placement, 'cy': placement, 'r': radius,
			'fill': 'black', 'stroke': 'white', 'stroke-width': strokeWidth
		};

		utils.setAttributes( circle, attributes );

		return circle;
	};  // End buildCircle()


	var createNew 	= function () {
	/*

	Creates the originator DOM element, its node
	http://www.i-programmer.info/programming/graphics-and-imaging/3254-svg-javascript-and-the-dom.html
	TODO: Make this look better by having the lines "go into" the circles
		That would involve animation, I think
	*/

		// ==============
		// CONTAINERS
		// ==============
		var container 	= buildContainerDiv();
		document.body.appendChild( container );

		var NS 			= 'http://www.w3.org/2000/svg';
		var svg 		= buildSVG( NS );
		// document.createElementNS( NS,'svg' );
		// var attributes 	= {
		// 	'version': '1.1', 'width': '100%', 'height': '100%',
		// 	'style': 'overflow: visible; pointer-events: all;'
		// };

		// utils.setAttributes( svg, attributes );

		container.appendChild( svg );

		// ==============
		// LINES
		// ==============
		// Line widths
		var inner = 2, outer = 4;

		var outline 	= buildLine( NS, 'white', outer );
		var line 		= buildLine( NS, 'black', inner );

		svg.appendChild( outline );
		svg.appendChild( line );

		// ===============
		// CIRCLES
		// ===============
		// Sizes
		var radius = 4, strokeWidth = 1.5;

		var leftTop 	= buildCircle( NS, '0' );
		var rightBottom = buildCircle( NS, '100%' );

		svg.appendChild( leftTop );
		svg.appendChild( rightBottom );
		
		// ======================
		// SET OBJECT PROPERTIES
		// ======================
		originator.node = container;

		return container;
	}  // End createNew()

	createNew();

	return originator;
};


var OrgUtils = {};




// ============
// START
// ============
var org = new Originator();

