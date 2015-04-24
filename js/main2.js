// main2.js

//

'use strict'

var Originator = function () {
/*

*/
	var origr = {};

	origr.node 				= null;
	origr.oldTarget 		= null;


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


	// --- MOSTLY FOR ORIGINATOR ---
	// utils.handleVisibility = function ( elem, isVisible ) {
	// /*

	// Hides or shows elem
	// */
	// 		if ( isVisible ) {
	// 			elem.style.visibility = "visible";
	// 		} else {
				
	// 			elem.style.visibility = "hidden";
	// 		}

	// 		return elem;
	// };  // End utils.handleVisibility()

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

	// util.offsetFromParent = function ( child ) {
	// /*

	// Gets the pixel distances between the origin of the parent
	// and the origin of the child

	// !!! WARNING !!! I think this only works if the child is not
	// above or to the left of the parent
	// */
	// 	var childRect 	= child.getBoundingClientRect(),
	// 		parentRect 	= child.parentNode.getBoundingClientRect();
	// 		console.log(childRect.top, parentRect.top)
	// 	// var parent = child.parentNode;
	// 	// var leftDiff 	= child.clientLeft - parent.clientLeft,
	// 	// 	topDiff 	= child.clientTop - parent.clientTop;

	// 	// // This works for the element right before the body
	// 	// // But not others.
	// 	// var parent = child.parentNode;
	// 	// var leftDiff 	= childRect.left - parent.clientLeft,
	// 	// 	topDiff 	= childRect.top - parent.clientTop;

	// 	// Seems to work fine with margins other than BODY's margin
	// 	var leftDiff 	= childRect.left - parentRect.left,
	// 		topDiff 	= childRect.top - parentRect.top;
			
	// 	return { x: leftDiff, y: topDiff };
	// };  // End util.offsetFromParent()

	utils.getPositionStyle = function ( elem ) {

		var elemStyle 	= window.getComputedStyle( elem )
		return elemStyle.getPropertyValue( 'position' );

	}  // End utils.getPositionStyle()


	// --- MOSTLY FOR LABELS ---

	// !!! ??: USE BOTTOM AND RIGHT PROPERTIES INSTEAD? !!!
	// var getRootElementFontSize = function () {
	// /* ( None ) -> int

	// Returns the pixel value of one rem (for placement of labels)
	// */
	//     // Returns a number
	//     return parseFloat(
	//         // of the computed font-size, so in px
	//         getComputedStyle(
	//             // for the root <html> element
	//             document.documentElement
	//         )
	//         .fontSize
	//     );
	// };  // End getRootElementFontSize()


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


	origr.placeOriginator = function ( currentTarget, positionStyle ) {
	/* ( DOM, DOM ) -> DOM

	Places the originator at the correct starting and ending points.
	Returns the element that was passed in as the currentTarget
	*/


			// ========================
			// INSERT INTO DOM
			// ========================
			var parent = currentTarget.parentNode;
			parent.insertBefore( originDiv, currentTarget );

			// ========================
			// END POINT (of originator)
			// ========================
			// var targetLeft 	= currentTarget.offsetLeft;
			// 	targetTop 	= currentTarget.offsetTop;

			
			var originLeft, originTop,
				targetLeft, targetTop;

			if ( positionStyle === "absolute" ) {
				originLeft 	= 0; originTop 	= 0;
				targetLeft 	= currentTarget.offsetLeft;
				targetTop 	= currentTarget.offsetTop;

			} else {
			// Attempting to connect non-absolute positioned
			// elements to their direct parents...

				var parentPosStyle = getPositionStyle( currentTarget.parentNode );
				if ( parentPosStyle !== 'static' ) {
					originLeft = 0; originTop = 0;

				} else {
					originLeft 	= parent.offsetLeft;
					originTop 	= parent.offsetTop;
				}

				var offsets = offsetFromParent( currentTarget );
				targetLeft 	= offsets.x;
				targetTop 	= offsets.y;
				// console.log(offsets)
			}

			// Do it
			originDiv.style.left 	= originLeft + "px";
			originDiv.style.top 	= originTop + "px";

			originDiv.style.width 	= targetLeft;
			originDiv.style.height 	= targetTop;

			return currentTarget;

	};  // End placeOriginator()




	// ===============================================================
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

		// Needed for all svg stuff for some reason
		var NS 			= 'http://www.w3.org/2000/svg';

		var svg 		= buildSVG( NS );
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
		origr.node = container;

		return container;
	}  // End createNew()

	createNew();

	// ========================================
	// =================
	// EVENTS
	// =================
	document.addEventListener( "click", function (event) {

		// =========
		// SETUP
		var currentTarget = event.target;
		// console.log(currentTarget)

		// ================
		// LABELS
		// ================
		// // Get rid of all the old labels. If needed, new ones will be made
		// var labels = document.getElementsByClassName( "label" );
		// removeElements( labels );

		// ================
		// VISIBILITY
		// ================
		var visibility = origr.getNewVisibility( currentTarget, origr.oldTarget );
		origr.node.style.visibility = visibility;

		// =================
		// EXCLUSIONS
		// =================
		// Don't try to track originator parts or labels
		// Don't make originator unclickable either. What if they want to inspect the element?
		var exclude = origr.shouldExclude( currentTarget );

		// // Always exceptions for HTML!!! ARGH!!!
		// if ( currentElem.tagName === "HTML" ) {
		// 	// removeElements( labels );
		// 	origr.node.style.visibility = "hidden";

		// } else 

		if ( !exclude ) {
			console.log( "not excluded!" )
			// ================
			// PLACE THINGS
			// ================
			// If stuff is visible, make it look good
			if ( visibility === "visible" ) {
			console.log( "visible!" )


		// 		// TODO: imo, it's kind of awkward that placeLabel returns a position value
		// 		// 		Not sure what to do about it though
		// 		var position = placeLabel( currentTarget, "original" );

		// 		// ================
		// 		// LABELS
		// 		// ================
		// 		// Always show the label of the current element
		// 		// If the element is position: aboslute
		// 		if ( position === "absolute" ) {
		// 			// put labels on all the parents untill the positioning parent
		// 			var ancestors = getElemsFromUntil( currentTarget, currentTarget.offsetParent );
		// 			labelElems( ancestors );
		// 		}

		// 		// ORIGINATOR
		// 		placeOriginator( currentTarget, position );

		// 		// Prepare for next click on non-originator element
				// origr.oldTarget = currentTarget;
			}  // end if visible

			// If new non-excluded target has been clicked, prepre oldTarget for new iteration
			origr.oldTarget = currentTarget;

		}  // end if !excluded

	});  // end document on click


	return origr;
};




// ============
// START
// ============
var org = new Originator();

