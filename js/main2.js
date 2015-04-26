/* main2.js

TODO:
- Pulse color of line and circles when they first appear?
 or just make them a color other than black?
- Maybe put abs pos element's left and top values
 in label?
*/

'use strict'

var Originator = function () {
/*

*/
	var origr = {};

	origr.node 				= null;
	origr.oldTarget 		= null;
	origr.cssFirstPart 		= null;

	var baseColor 			= 'rgb(75, 75, 75)',
		outlineColor		= 'white',
		wrongColor 			= 'tomato',
		rightColor 			= 'lightgreen';


	// ===============================================================
	// =================
	// GENERAL
	// =================
	var utils = {};

	// --- INITIALIZATION ---
	utils.setAttributes = function ( elem, attrs ) {
	/*

	Sets a bunch of attributes all at once because that's annoying
	and messy
	Usecase: setAttributes(elem, {"width": "50%, "height": "100%", ...});
	*/
		for( var key in attrs ) {
			elem.setAttribute( key, attrs[key] );
		}

		return elem;
	};  // End utils.setAttributes()


	// --- MOSTLY FOR ORIGINALTOR ---
	utils.oneHasClass = function ( elems, testClass ) {
	/* ( [ DOM ], str ) -> bool

	Returns whether one element in the list of elements has a class
	*/
		var oneHasClass = false;

		for ( var elemi = 0; elemi < elems.length; elemi++ ) {

			if ( elems[ elemi ].classList.contains( testClass ) ) {
				oneHasClass = true;
			}
		}

		return oneHasClass;
	};  // End oneHasClass()

	utils.distanceBetween = function ( point1, point2 ) {
	/* ( {}, {} ) -> num
	
	Returns the pixel distance between point1 and point2
	*/
		var xDistance = 0;
		var yDistance = 0;

		xDistance = point2.x - point1.x;
		xDistance = xDistance * xDistance;

		yDistance = point2.y - point1.y;
		yDistance = yDistance * yDistance;

		return Math.sqrt( xDistance + yDistance );

	};  // End distanceBetween()


	utils.degreesFromHorizontal = function ( point1, point2 ) {
	/* ( {}, {} ) -> num

	Returns number of degrees between a horizontal line to the right
	and the line made by the two given points.
	*/
		var deltaY = point2.y - point1.y,
			deltaX = point2.x - point1.x;

		var angleInDegrees = Math.atan2( deltaY, deltaX ) * 180 / Math.PI;

		return angleInDegrees;
	};  // End degreesFromHorizontal()


	utils.rotateByDegrees = function ( elem, degrees ) {
	/* ( DOM, num ) -> same DOM */

		elem.style.webkitTransform = 'rotate(' + degrees + 'deg)'; 
		elem.style.mozTransform    = 'rotate(' + degrees + 'deg)'; 
		elem.style.msTransform     = 'rotate(' + degrees + 'deg)'; 
		elem.style.oTransform      = 'rotate(' + degrees + 'deg)'; 
		elem.style.transform       = 'rotate(' + degrees + 'deg)';

		return elem;
	};  // End rotateByDegrees()


	utils.resetRotation = function ( elem ) {
	/* ( DOM ) -> same */

		elem.style.webkitTransform = 'rotate( 0deg )'; 
		elem.style.mozTransform    = 'rotate( 0deg )';
		elem.style.msTransform     = 'rotate( 0deg )';
		elem.style.oTransform      = 'rotate( 0deg )';
		elem.style.transform       = 'rotate( 0deg )';

		return elem;
	};  // End resetRotation()


	// --- MOSTLY FOR LABELS ---
	var getRootElementFontSize = function () {
	/* ( None ) -> int

	Returns the pixel value of one rem (for placement of labels)
	*/
	    // Returns a number
	    return parseFloat(
	        // of the computed font-size, so in px
	        getComputedStyle(
	            // for the root <html> element
	            document.documentElement
	        )
	        .fontSize
	    );
	};  // End getRootElementFontSize()


	utils.getElemsFromUntil = function ( childElem, ancestorElem ) {
	/* ( HTML, HTML ) -> [ DOM ]

	Return all ancestor of childElem up to and including ancestorElem
	*/
		var elemList 			= [];
		var currentElem			= childElem;
		var ancestorNotFound 	= true;

		// Cycle through the ancestors, until the right ancestor is reached
		// ??: Can document.body have a sibling?
		while ( ancestorNotFound ) {

			elemList.push( currentElem );

			if ( currentElem === ancestorElem ) {
				ancestorNotFound = false;
			} else {
				// For next loop iteration
				currentElem = currentElem.parentNode;
			}
		}  // end while ancestorNotFound

		if ( currentElem !== ancestorElem ) { elemList = "There was no such ancestor!"; }

		return elemList;

	};  // End utils.getElemsFromUntil()


	utils.removeElements = function ( elemNodeList ) {
	/* ( Node list ) -> same

	Removes all elements in elemList from the DOM
	*/

		// Some browsers have dynamic node lists, others have static node lists
		// Using nodeList[0] in each loop would therefore break sometimes
		var elemArray = [].slice.call( elemNodeList );

		for ( var elemi = 0; elemi < elemArray.length; elemi++ ) {

			var elem = elemArray[ elemi ];
			var parent = elem.parentNode;

			parent.removeChild( elem );

		}

		return elemNodeList;
	};  // End utils.removeElements()


	utils.isOutOfWindow = function ( elem ) {
	/* ( DOM ) -> bool

	Tests whether an element peeks above viewport.
	Not sure how to do just out of window...
	*/
		var elemTop = getOffsetRect( elem ).top;
		return elemTop < 0
	};  // End utils.isOutOfWindow()


	// --- FOR BOTH ---
	utils.getOffsetRect = function ( elem ) {
	/* ( DOM ) -> {}

	http://javascript.info/tutorial/coordinates
	Gets the top and left offsets of an element relative
	to the document (takes scrolling into account)
	*/
	    // (1)
	    var box = elem.getBoundingClientRect()
	     
	    var body = document.body
	    var docElem = document.documentElement
	     
	    // (2)
	    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
	    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
	     
	    // (3)
	    var clientTop = docElem.clientTop || body.clientTop || 0
	    var clientLeft = docElem.clientLeft || body.clientLeft || 0
	     
	    // (4)
	    var top  = box.top +  scrollTop - clientTop
	    var left = box.left + scrollLeft - clientLeft
	     
	    return { top: Math.round(top), left: Math.round(left) }
	}  // End utils.getOffsetRect()


	utils.getPositionStyle = function ( elem ) {

		var elemStyle 	= window.getComputedStyle( elem )
		return elemStyle.getPropertyValue( 'position' );

	}  // End utils.getPositionStyle()



	// ===============================================================
	// =================
	// APP LOGIC
	// =================
	origr.shouldExclude = function ( currentElem ) {
	/* ( DOM ) -> Bool

	Makes sure the current element doesn't belong to the list of
	excluded elements
	*/
		var exclude = false;

		// --- Is or belongs to originator ---
		var allElems 	= utils.getElemsFromUntil( currentElem, document.body.parentNode );
		// allElems.push( currentElem );
		var isOrigin 	= utils.oneHasClass( allElems, "originator" );

		var isHTML 		= currentElem.tagName === "HTML";
		var isLabel = currentElem.classList.contains("label");

		// --- result ---
		if ( isOrigin || isLabel || isHTML ) { exclude = true; }
		return exclude;
	};  // End origr.shouldExclude()


	origr.getNewVisibility = function ( currentTarget, oldTarget ) {
	/* ( DOM, DOM ) -> str

	This is a bit messy. Not sure if there's anything to do about it.
	Gets a style.visibility value depending on what is clicked on
	*/

		// --- DETERMINE VISIBILITY --- \\
		var isVisible = false;
		if ( origr.node.style.visibility === 'visible' ) { isVisible = true; }

		// If same target, toggle visibility
		if ( currentTarget === oldTarget ) {
			isVisible = !isVisible;
		// Make originator visible if a new element is clicked on
		} else { isVisible = true; }

		// Always disappear if HTML is clicked
		if ( currentTarget.tagName === "HTML" ) { isVisible = false; }

		// --- TRANSLATE TO PROPERTY TYPE --- \\
		var visibility = "hidden";
		if ( isVisible ) { visibility = "visible" }

		return visibility;
	};  // End getNewVisibility()

	// ====================
	// ORIGINATOR
	// ====================
	origr.placeOriginator = function ( currentTarget, positionStyle, targetParent ) {
	/* ( DOM, DOM ) -> DOM

	!!! WARNING !!! ??: only works if child is down and to the right of targetParent?

	Places the originator at the correct starting and ending points.
	Returns the element that was passed in as the currentTarget

	Break this up into multiple functions
	*/
		var origrNode_ = origr.node;
		utils.resetRotation( origrNode_ );

		// --- CORRECT PARENT ---
		var parentPos 	= utils.getOffsetRect( targetParent ),
			pCoords		= { 'x': parentPos.left, 'y': parentPos.top };
		var targetPos 	= utils.getOffsetRect( currentTarget ),
			tCoords		= { 'x': targetPos.left, 'y': targetPos.top };

		var distance 	= utils.distanceBetween( pCoords, tCoords );
		origrNode_.style.width = distance + "px";

		var degrees 	= utils.degreesFromHorizontal( pCoords, tCoords );

		utils.rotateByDegrees( origrNode_, degrees );

		// // ==================
		// // HORIZONTAL
		// // ==================
		// // Get left to calc right
		var parentLeft 	= parentPos.left;
		// var targetLeft 	= targetPos.left;

		// // Calc and do right
		// var origrWidth 		= targetLeft - parentLeft,
		// 	flipHorizontal 	= false;

		// if ( origrWidth < 0) {
		// 	origrWidth 		= parentLeft - targetLeft;
		// 	// Flip later
		// 	flipHorizontal 	= true;
		// }

		// origrNode_.style.width 	= origrWidth;

		// // Calc and do left
		// origrNode_.style.transform = "";
		origrNode_.style.left 	= parentLeft;

		// // ==================
		// // VERTICAL
		// // ==================
		// // Get top to calc bottom
		var parentTop 	= parentPos.top;
		// var targetTop 	= targetPos.top;

		// // Calc and do bottom
		// var origrHeight 	= targetTop - parentTop,
		// 	flipVertical 	= false;

		// if ( origrHeight < 0 ) {
		// 	origrHeight 	= parentTop - targetTop;
		// 	// Flip later
		// 	flipVertical 	= true;
		// }

		// origrNode_.style.height = origrHeight;

		// // Calc and do top
		// origrNode_.style.transform = "";
		origrNode_.style.top 	= parentTop;

		// // ==============================
		// // FLIPPING (for negtive left or top values)
		// // ==============================
		// var transformX = "";
		// if ( flipHorizontal ) {
		// 	transformX = "scaleX(-1)";
		// 	origrNode_.style.left 	= parentLeft - origrWidth;
		// }

		// var transformY = "";
		// if ( flipVertical ) {
		// 	transformY = "scaleY(-1)"
		// 	origrNode_.style.top 	= parentTop - origrHeight;
		// }

		// // --- TRANSFORMS --- \\
		// origrNode_.style.transform = transformX + " " + transformY;

		return currentTarget;

	};  // End placeOriginator()

	// ====================
	// LABELS
	// ====================
	var createLabel = function ( elem, labelColor ) {
	/*

	Create one label for an element
	*/
		var label 		= document.createElement('div');
		label.className = 'label';

		var style = 'position: absolute; z-index: 100; '
			+ 'border: solid ' + baseColor + ' 1px; padding: 0 0.2rem; '
			+ 'box-shadow:  -0.25px -0.25px 0.25px 0px rgba(0, 0, 0, .5); '
			+ 'border-radius: 3px 3px 0px 0px; '
			+ 'background-color: ' + labelColor;
		
		label.setAttribute('style', style);

		var elemRect 	= utils.getOffsetRect( elem );
		var elemLeft 	= elemRect.left,
			elemTop 	= elemRect.top;

		// Calculate 1.2 rem above elem
		var topDiff 		= 1.2 * getRootElementFontSize();
		label.style.top 	= elemTop - topDiff;
		label.style.left 	= elemLeft;

		return label
	};  // End createLabel()


	var isOutOfWindow = function ( elem ) {
	/* ( DOM ) -> bool

	Tests whether an element peeks above document
	*/
		var elemTop = utils.getOffsetRect( elem ).top;
		return elemTop < 0
	};  // End isOutOfWindow()


	var fixOutOfWindow = function ( elem ) {
	/*

	Tests if an element is out of the window. If it is,
	it moves it into the window
	*/
		if ( isOutOfWindow(elem) ) { elem.style.top = 0; }
		return elem;
	};  // End fixOutOfWindow


	var placeLabel = function ( elem, placeInChain, childPosition ) {
	/* ( DOM, str ) -> str

	Places a label at the top of an element that says its position
	attribute value.

	placeInChain can either be "child" or "ancestor #"
	// TODO?: 
	// http://stackoverflow.com/questions/6338217/get-a-css-value-with-javascript
	*/

		// Get elem values
		var positionStyle 	= utils.getPositionStyle( elem );
		var tagName 		= elem.tagName;

		// Build text and style based on values
		var labelString = "position: " + positionStyle + " (" + placeInChain + ")";

		var labelColor 	= rightColor;
		// If it's the original element, its label should be
		// green no matter what
		if ( placeInChain !== 'child' ) {
			// if it isn't and it's static, then its out of sync
			if ( (childPosition === 'absolute') && (positionStyle === 'static') ) {
				labelColor = wrongColor;
			}
		}

		// Build label
		var label 		= createLabel( elem, labelColor );

		var labelText 	= document.createTextNode( labelString );
		label.appendChild( labelText );

		// Place in DOM
		// var parent = elem.parentNode;
		// parent.insertBefore( label, elem );
		document.body.appendChild( label );

		// If it's out of the window after placement, get it back in
		fixOutOfWindow( label );

		return elem;
	};  // End placeLabel()


	var labelElems = function ( elemList, childPosition ) {
	/* ( [ DOM ] ) -> same

	Places positionStyle labels on all the elements in the list
	*/

		// Backwards through the list so ancestors don't cover children
		for ( var elemi = (elemList.length - 1); elemi >= 0; elemi-- )	{
			var placeInChain = 'ancestor ' + (elemi - 1) ;

			if ( elemi === 0 ) {
				placeInChain = 'child';
			}

			placeLabel( elemList[ elemi ], placeInChain, childPosition );
		}  // end for elemList

		return elemList;
	};  // end labelElems()


	// ===============================================================
	// =================
	// INITIALIZATION
	// =================
	var buildContainerDiv = function () {
	/*

	Container is always 0.5px high, will be rotated for placement
	*/

		var container 		= document.createElement('div');
		container.className = 'originator';

		var attributesStr 	= 'position: absolute; left: 0; top: 0; ' +
			'visibility: hidden; z-index: 200; pointer-events: none; ' +
			'height: 0.5px; min-width: 0.5px; ' +
			// Always rotate from top left corner
			'-webkit-transform-origin: top left; -moz-transform-origin: top left;' +
            '-o-transform-origin: top left; transform-origin: top left;';
			// 'min-width: 0.5px; min-height: 0.5px;';

		container.setAttribute( 'style', attributesStr );

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


	var buildLine 	= function ( NS, strokeColor, strokeWidth ) {
	/* ( str, str, num ) -> DOM

	Build one originator line. Goes from top left to bottom right.
	*/
		var line 		= document.createElementNS( NS,'line' );
		var attributes 	= {
			// 'x1': '0', 'y1': '0', 'x2': '100%', 'y2': '100%',
			'x1': '0', 'y1': '0', 'x2': '100%', 'y2': '0',
			'stroke': strokeColor, 'stroke-width': strokeWidth
		};

		// To pulse a color first
		line.style.transition = 'stroke .4s ease;';

		utils.setAttributes( line, attributes);
		// line.setAttribute( 'stroke-linecap', 'butt' );

		return line;
	}  // End buildLine()


	var buildCircle = function ( NS, position ) {
	/* ( str, str ) -> DOM

	Build originator circles
	*/
		// Sizes
		var radius = 4, strokeWidth = 1.5;

		var circle 		= document.createElementNS( NS, 'circle' );
		var attributes 	= {
			'cx': position, 'cy': position, 'r': radius,
			'fill': baseColor, 'stroke': outlineColor, 'stroke-width': strokeWidth
		};
		// To pulse a color first
		circle.style.transition = 'fill .4s ease;';

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

		// --- CONTAINERS --- \\
		var container 	= buildContainerDiv();
		document.body.appendChild( container );

		// Needed for all svg stuff for some reason
		var NS 			= 'http://www.w3.org/2000/svg';

		var svg 		= buildSVG( NS );
		container.appendChild( svg );

		// --- LINES --- \\
		// Line widths
		var inner = 2, outer = 4;

		var outline 		= buildLine( NS, outlineColor, outer );
		var innerLine 		= buildLine( NS, baseColor, inner );
		innerLine.className = 'inner-line';

		svg.appendChild( outline );
		svg.appendChild( innerLine );

		// --- CIRCLES --- \\
		// Circle thicknesses
		var radius = 4, strokeWidth = 1.5;

		var leftTop 	= buildCircle( NS, '0' );
		var rightBottom = buildCircle( NS, '100%' );

		svg.appendChild( leftTop );
		svg.appendChild( rightBottom );
		
		//  --- SET OBJECT PROPERTIES --- \\
		origr.node = container;

		return container;
	};  // End createNew()

	createNew();

	// ========================================
	// =================
	// EVENTS
	// =================
	document.addEventListener( "click", function (event) {

		var currentTarget = event.target;
		// console.log(currentTarget)

		// Don't try to track originator parts or labels
		// Don't make originator unclickable either. What if they want to inspect the element?
		var exclude = origr.shouldExclude( currentTarget );

		// Get rid of all the old labels. If needed, new ones will be made
		var labels = document.getElementsByClassName( "label" );
		utils.removeElements( labels );

		// "hidden" will prevent movement as well
		var visibility = origr.getNewVisibility( currentTarget, origr.oldTarget );
		origr.node.style.visibility = visibility;

		// At least change the oldTarget (down at the bottom)
		if ( !exclude ) {

			// If stuff is visible, make it look good
			if ( visibility === "visible" ) {
				// ================
				// PLACE THINGS
				// ================
				var positionStyle = utils.getPositionStyle( currentTarget );

				// --- CORRECT PARENT ---
				var targetParent = currentTarget.parentNode;
				if ( positionStyle === "absolute" ) {
					targetParent = currentTarget.offsetParent;
				}

				// --- LABELS --- \\
				var elems = utils.getElemsFromUntil( currentTarget, targetParent );
				labelElems( elems, positionStyle );

				// --- ORIGINATOR --- \\
				origr.placeOriginator( currentTarget, positionStyle, targetParent );
			}  // end if visible

			// Prepare for next click on non-originator element
			origr.oldTarget = currentTarget;
		}  // end if !excluded

	});  // end document on click

	return origr;
};


// ============
// START
// ============
var originator3000 = new Originator();

