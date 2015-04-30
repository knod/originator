/* originator.js

TODO:
- Add green color and special text for body label
- Fix originator showing on Tool Manager

Resources no longer used:
	- http://tzi.fr/js/snippet/convert-em-in-px (1 rem to pixels)
		getRootElementFontSize()
*/

'use strict';


window.Originator = function ( manager, utilsDict, labelsFunct ) {
/* ( BookmarkletToolManager, {}, HandHeldLabels() ) -> Originator

What do we really need to pass in? Do we need to pass in its checkbox
element too?
*/
	var origr = {};

	origr.node 				= null;
	origr.oldTarget 		= null;
	origr.currentTarget 	= null;

	origr.circleLT 			= null;
	origr.circleRB 			= null;

	origr.active 			= true;
	origr.loopPaused 		= false;

	origr.name 				= 'originator';

	// baseColor needs to be for labels too. Needs to be in main?
	origr.baseColor 		= 'rgb(55, 55, 55)';
	origr.labelsObj 		= labelsFunct( origr.baseColor, utilsDict );

	var outlineColor		= 'white';


	// ===============================================================
	// =================
	// UTILITY OBJECTS
	// =================
	var Utils_DOM 	= utilsDict.Utils_DOM,
		// OrigrUtils 	= OriginatorUtils,
		Utils_Color = utilsDict.Utils_Color,
		Utils_Math 	= utilsDict.Utils_Math;


	// ===============================================================
	// =================
	// TOOL MANAGER
	// =================
	origr.className = 'originator';

	origr.toggle = function ( evnt, manager ) {
	/*

	Based on checkbox, disable or enable the originator tool
	*/
		var target 		= evnt.target,
			parent 		= target.parentNode,
			checkbox 	= parent.getElementsByClassName( 'manager-checkbox' )[0];

		var checked 	= checkbox.checked;

		if ( checked === true ) {
			// Show checkmark
			manager.changeIcon( checkbox );
			origr.active = true;

		// Not for 'undefined', just for 'false'
		} else if ( checked === false ) {
			manager.changeIcon( checkbox );
			origr.active = false;

		}

		return evnt.target;
	};  // End origr.toggle()


	// ===============================================================
	// =================
	// LOGIC
	// =================
	origr.shouldExclude = function ( currentElem ) {
	/* ( DOM ) -> Bool

	Makes sure the current element doesn't belong to the list of
	excluded elements
	*/
		var exclude = false;

		// --- Is or belongs to originator ---
		var allElems 	= Utils_DOM.getElemsFromUntil( currentElem, document.body.parentNode );
		var isManager 	= Utils_DOM.oneHasId( allElems, 'bookmarklet_collection_manager' );
		var isOrigin 	= Utils_DOM.oneHasClass( allElems, origr.className );

		var isLabel 	= Utils_DOM.oneHasClass( allElems, 'label-shadow-cutoff' );

		// --- result ---
		if ( isOrigin || isLabel || isManager ) { exclude = true; }
		// console.log(exclude);
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
	// --- COLORS ---
	// SEEMS TO WORK!!! :D :D :D
	var determineColor = function ( elem ) {
	/* ( DOM ) -> Str

	Returns an rgb string
	*/
		var styles = getComputedStyle( elem )

		var color 	= styles.getPropertyValue( 'background-color' );

		var borderWidth = styles.getPropertyValue( 'border-width' );
		borderWidth = parseFloat( borderWidth );

		// If the border will completely contain the circle, get its color instead
		if ( borderWidth > 3 ) {
			color = styles.getPropertyValue( 'border-color' );
		}

		return color;
	};  // End determineColor()


	var toChildColor = function ( rgbs ) {
	/* ( {nums} ) -> Str
	
	Returns an hsl str ready to be used in a style value
	*/
		var min = 80, modifier = 30;

		// lightness to 80%
		var rgbNums 	= Utils_Color.rgbStrToNums( rgbs ),
			hsls 		= Utils_Color.rgbNumsToHslNums( rgbNums );

		// Prepare to send the new value to be converted
		hsls.l 			= min;
		hsls.l 	= Math.min( ( hsls.l + modifier ), min );

		// console.log('Child:', hsls);

		return Utils_Color.hslNumsToStr( hsls );
	};  // End toChildColor()

	var toParentColor = function ( rgbs ) {
	/* ( {nums} ) -> Str
	
	Returns an hsl str ready to be used in a style value
	*/
		var max = 35, modifier = 30;

		// lightness to 30%
		var rgbNums 	= Utils_Color.rgbStrToNums( rgbs ),
			hsls 		= Utils_Color.rgbNumsToHslNums( rgbNums );

		// Prepare to send the new value to be converted
		hsls.l 			= max;
		hsls.l 	= Math.max( ( hsls.l - modifier ), max );

		// console.log('Parent:', hsls);

		return Utils_Color.hslNumsToStr( hsls );
	};  // End toParentColor()


	var changeCirclesColor = function ( childElem, parentElem ) {
	/*

	Changes circle's colors to match the 
	*/
		var childColor 			= determineColor( childElem ),
			childCircleColor 	= toChildColor( childColor );
		origr.circleChild.setAttribute( 'fill', childCircleColor );

		var parentColor 		= determineColor( parentElem ),
			parentCircleColor 	= toParentColor( parentColor );
		origr.circleParent.setAttribute( 'fill', parentCircleColor );

		return [ origr.circleChild.getAttribute('fill'), origr.circleParent.getAttribute('fill') ]
	};  // End changeCirclesColor()

	// --- EVERYTHING ELSE ---
	origr.placeOriginator = function ( currentTarget, positionStyle, targetParent ) {
	/* ( DOM, DOM ) -> DOM

	Places the originator at the correct starting and ending points.
	Returns the element that was passed in as the currentTarget
	*/
		var origrNode_ = origr.node;
		// Rotation is accumulative. Always reset first.
		Utils_DOM.resetRotation( origrNode_ );

		// Positions left and top to x and y
		var parentPos 	= Utils_DOM.getOffsetRect( targetParent ),
			pCoords		= { 'x': parentPos.left, 'y': parentPos.top };
		var targetPos 	= Utils_DOM.getOffsetRect( currentTarget ),
			tCoords		= { 'x': targetPos.left, 'y': targetPos.top };

		// Line Length
		var distance 	= Utils_Math.distanceBetween( pCoords, tCoords );
		origrNode_.style.width = distance + "px";

		// Line rotation (from top left because of css)
		var degrees 	= Utils_Math.degreesFromHorizontal( pCoords, tCoords );
		Utils_DOM.rotateByDegrees( origrNode_, degrees );

		// Position
		var parentLeft 	= parentPos.left;
		origrNode_.style.left 	= parentLeft;

		var parentTop 	= parentPos.top;
		origrNode_.style.top 	= parentTop;

		// Color
		changeCirclesColor( currentTarget, targetParent );

		return currentTarget;

	};  // End placeOriginator()


	origr.makeMagic = function ( currentTarget, active ) {
	/*

	In its own function so we can call it in update
	*/

		// Just always get rid of them. They'll be replaced further down if needed
		// For times when new element is clicked on and originator isn't hidden,
		// but new labels have to be placed.
		origr.labelsObj.removeLabels();

		// If the target is removed, it still exists in our js as origr.currentTarget
		// Check if it's actually in the DOM. Using 'body' for IE:
		// https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect
		// and http://stackoverflow.com/questions/5629684/how-to-check-if-element-exists-in-the-visible-dom csuwldcat
		var elemInDOM 	= document.body.contains( currentTarget );
		var visibility 	= origr.node.style.visibility;

		// If the DOM has mutated getting rid of the element, we don't
		// want to do this.
		if ( elemInDOM && (visibility !== 'hidden') && active ) {

			var positionStyle = Utils_DOM.getPositionStyle( currentTarget );

			// --- CORRECT PARENT ---
			// Absolutely positioned elements have this final ancestor
			var targetParent = currentTarget.offsetParent;
			if ( positionStyle !== 'absolute' ) {
				// Other position styles have their direct parent as their final ancestor
				targetParent = currentTarget.parentNode;
			}

			// --- LABELS --- \\
			// Get the current element and all ancestors up to and including the determined parent
			var elems = Utils_DOM.getElemsFromUntil( currentTarget, targetParent );
			origr.labelsObj.labelTheseElems( elems, positionStyle );

			// --- ORIGINATOR --- \\
			origr.placeOriginator( currentTarget, positionStyle, targetParent );

		// If not in DOM, hidden, or inactive...
		} else {
			// Get rid of everything other than the disable button
			origr.node.style.visibility = 'hidden';

		}  // end if should show and/or place elements

	};  // End origr.makeMagic()




	// ===============================================================
	// =================
	// INITIALIZATION
	// =================
	var buildContainerDiv = function () {
	/*

	Container is always 0.5px high, will be rotated for placement
	*/
		var container 		= document.createElement('div');
		container.className = origr.className + ' originator-exclude';
		return container;
	};  // End buildContainerDiv()


	var buildSVG 	= function ( NS ) {
	/* ( str ) -> DOM */

		var svg 		= document.createElementNS( NS,'svg' );
		var attributes 	= {  // ??: Why is version needed?
			'version': '1.1', 'width': '100%', 'height': '100%',
			'style': 'overflow: visible;'
		};

		Utils_DOM.setAttributes( svg, attributes );

		return svg;
	};  // End buildSVG()


	var buildLine 	= function ( NS, strokeColor, strokeWidth ) {
	/* ( str, str, num ) -> DOM

	Build one originator line. Goes straigh across horizontally.
	Will be rotated
	*/
		var line 		= document.createElementNS( NS,'line' );
		var attributes 	= {
			// 'x1': '0', 'y1': '0', 'x2': '100%', 'y2': '100%',
			'x1': '0', 'y1': '0', 'x2': '100%', 'y2': '0',
			'stroke': strokeColor, 'stroke-width': strokeWidth
		};

		// To pulse a color first
		line.style.transition = 'stroke .4s ease;';

		Utils_DOM.setAttributes( line, attributes);
		// line.setAttribute( 'stroke-linecap', 'butt' );

		return line;
	}  // End buildLine()


	var buildCircle = function ( NS, position, outline ) {
	/* ( str, str ) -> DOM

	Build originator circles
	*/
		// Sizes
		var radius 		= 4, strokeWidth = 1.5;
		var circle 		= document.createElementNS( NS, 'circle' );

		var attributes 	= {
			// They should be at the same height? Everything starts out horizontal
			'cx': position, 'cy': 0, 'r': radius,
			'fill': origr.baseColor, 'stroke': outline, 'stroke-width': strokeWidth
		};

		Utils_DOM.setAttributes( circle, attributes );

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
		var innerLine 		= buildLine( NS, origr.baseColor, inner );
		innerLine.className = 'inner-line';

		svg.appendChild( outline );
		svg.appendChild( innerLine );

		// --- CIRCLES --- \\
		// Circle thicknesses
		var radius = 4, strokeWidth = 1.5;

		var parentCircle 	= buildCircle( NS, '0', outlineColor );
		var childCircle 	= buildCircle( NS, '100%', origr.baseColor );

		svg.appendChild( parentCircle );
		svg.appendChild( childCircle );
		
		//  --- SET OBJECT PROPERTIES --- \\
		origr.node 			= container;
		origr.circleChild 	= childCircle;
		origr.circleParent 	= parentCircle;

		return container;
	};  // End createNew()

	createNew();


	// ============================================
	// =================
	// EVENTS
	// =================



	// ------------------- \\
	// --- ORIGINATOR ---- \\
	document.addEventListener( 'click', function ( event ) {
		// Basically just gets and sets targets and sets visibility
		// Everything else is called in update()

		origr.currentTarget = event.target;

		// Don't try to track originator parts or labels, but do allow
		// clicking so elements can be inspected
		var exclude = origr.shouldExclude( origr.currentTarget );

		// At least change the oldTarget (down at the bottom)
		if ( !exclude ) {
			// "hidden" will prevent movement as well
			// Note: This MUST not happen in update()
			var visibility = origr.getNewVisibility( origr.currentTarget, origr.oldTarget );
			origr.node.style.visibility = visibility;

			// Prepare for next click on non-originator element
			origr.oldTarget = origr.currentTarget;
		}  // end if !excluded

	});  // end document on click


	// ========================================================
	// ===================
	// TRIGGER ORIGINATOR ACTIONS
	// ===================
	// --- IN CASE OF CHANGES TO DOM OR VIEW --- \\
	origr.update = function () {
		// Loop forever and ever?
		if ( !origr.loopPaused ) {
		// Deactive state is taken care of in makeMagic
			origr.makeMagic( origr.currentTarget, origr.active );
			window.requestAnimationFrame( origr.update );
		}
	};  // End update()

	origr.update();



	origr.disabler = document.getElementById( origr.className + '_toggle' );
	// To account for new and old scripts
	if ( origr.disabler !== null ) {
		origr.disabler.addEventListener( 'click', function ( evnt ) { origr.toggle( evnt); });
	}

	origr.labelText 	= 'Position Guidance';
	origr.managerItem = manager.addNewItem( origr );

	return origr;
};  // End Originator {}


// ============
// START
// ============
// var originator3000 = new Originator();


/*
Selector Gadget's way of handling the code:
(function(){
  importCSS('https://dv0akt2986vzh.cloudfront.net/stable/lib/selectorgadget.css');
  importJS('https://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js', 'jQuery', function() { // Load everything else when it is done.
    jQuery.noConflict();
    importJS('https://dv0akt2986vzh.cloudfront.net/stable/vendor/diff/diff_match_patch.js', 'diff_match_patch', function() {
      importJS('https://dv0akt2986vzh.cloudfront.net/stable/lib/dom.js', 'DomPredictionHelper', function() {
        importJS('https://dv0akt2986vzh.cloudfront.net/stable/lib/interface.js');
      });
    });
  });
})();
*/


