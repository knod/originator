// main2.js

//

'use strict'

var Originator = function () {
/*

*/

	var originator = {};

	originator.node = null;

	// =================
	// INITIALIZATION
	// =================
	var buildLine 	= function ( NS, strokeColor, strokeWidth, strokeLength ) {
	/*

	Build one originator line. Goes from top left to bottom right.
	*/
		var line = document.createElementNS( NS,'line' );

		line.setAttribute( 'x1', '0' ); line.setAttribute( 'y1', '0' );
		line.setAttribute( 'x2', '100%' ); line.setAttribute( 'y2', '100%' );
		line.setAttribute( 'stroke', strokeColor );
		line.setAttribute( 'stroke-width', strokeWidth );
		line.setAttribute( 'stroke-linecap', 'butt' );

		return line;
	}  // End buildLine()


	var buildCircle = function ( NS, placement ) {
	/*

	Build originator circles
	*/
		// Sizes
		var radius = 4, strokeWidth = 1.5;

		var circle = document.createElementNS( NS, 'circle' );

		circle.setAttribute( 'cx', placement ); circle.setAttribute( 'cy', placement );
		circle.setAttribute( 'r', radius );
		circle.setAttribute( 'fill', 'black' );
		circle.setAttribute( 'stroke', 'white' ); circle.setAttribute( 'stroke-width', strokeWidth );

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
		var container 		= document.createElement('div');
		container.className = 'originator';

		document.body.appendChild( container );

		var NS 				= 'http://www.w3.org/2000/svg';
		var svg 			= document.createElementNS( NS,'svg' );
		svg.setAttribute( 'version', '1.1' );
		svg.setAttribute( 'width', '100%' );
		svg.setAttribute( 'height', '100%' );
		svg.setAttribute( 'style', 'overflow: visible' );

		container.appendChild( svg );

		// ==============
		// LINES
		// ==============
		// Line widths
		var inner = 2, outer = 4;

		var outline 		= buildLine( NS, 'white', outer );
		var line 			= buildLine( NS, 'black', inner );

		svg.appendChild( outline );
		svg.appendChild( line );

		// ===============
		// CIRCLES
		// ===============
		// Sizes
		var radius = 4, strokeWidth = 1.5;

		var leftTop 		= buildCircle( NS, '0' );
		svg.appendChild( leftTop );

		// circle is in DOM, but can't see or find where it is, not even a marker
		var rightBottom 	= buildCircle( 'NS', '100%' );

		// circle looks fine
		// var rightBottom 	= document.createElementNS( NS, 'circle' );
		// rightBottom.setAttribute( 'cx', '100%' ); rightBottom.setAttribute( 'cy', '100%' );
		// rightBottom.setAttribute( 'r', radius );
		// rightBottom.setAttribute( 'fill', 'black' );
		// rightBottom.setAttribute( 'stroke', 'white' ); rightBottom.setAttribute( 'stroke-width', strokeWidth );

		svg.appendChild( rightBottom );
		
		originator.node = container;

		return container;
	}  // End createNew()

	createNew();

	return originator;
};


// ============
// START
// ============
var org = new Originator();

