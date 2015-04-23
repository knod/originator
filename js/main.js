// main.js

'use strict'

var originDiv = document.getElementById( "origin-container" );
var target;
var oldTarget,
	currentTarget,
	clickCount = 1,
	originatorVisible = false;

document.addEventListener( "click", function (event) {

	// =========
	// SETUP
	currentTarget = event.target;
	// console.log(currentTarget)

	// Don't respond to a click on our helper (or on a label?)
	// Don't make it disappear either. What if they want to inspect the element?
	var isOrigin = currentTarget.classList.contains("origin")
		|| currentTarget.parentNode.classList.contains("origin") // Taking care of the svg lines
		|| currentTarget.classList.contains("label"); // And the labels

	// The body doesn't have a parent of a parent
	if ( !(currentTarget == document.getElementsByTagName("body")[0]) ) {
		isOrigin = isOrigin || currentTarget.parentNode.parentNode.classList.contains("origin")
	}

	if ( !isOrigin ) {
		// ================
		// LABELS
		// ================
		// Get rid of all the old labels. If needed, new ones will be made
		var labels = document.getElementsByClassName( "label" );
		removeElements( labels );

		// ================
		// VISIBILITY
		// ================
		// Toggle visibility when the same element is clicked on
		if ( currentTarget === oldTarget ) {
			originatorVisible = !originatorVisible;
		// Make originator visible if a new element is clicked on
		} else { originatorVisible = true; }

		handleVisibility( originDiv, originatorVisible );

		// ================
		// PLACE THINGS
		// ================
		// If stuff is visible, make it look good
		if ( originatorVisible ) {

			// ORIGINATOR
			placeOriginator( currentTarget, oldTarget );

			// ================
			// LABELS
			// ================
			// Always show the label of the current element
			// TODO: imo, it's kind of awkward that placeLabel returns a position value
			// 		Not sure what to do about it though
			var position = placeLabel( currentTarget, "original" );
			// If the element is position: aboslute
			if ( position === "absolute" ) {
				// put labels on all the parents untill the positioning parent
				var ancestors = getAncestorsUntil( currentTarget, currentTarget.offsetParent );
				labelElems( ancestors );
			}

			// Prepare for next click on non-originator element
			oldTarget = currentTarget;
		}  // end if visible


	}  // end if !isOrigin

});  // end document on click


// ==================
// General
// ==================
// -----------------------------
// --- Mostly for originator ---
var handleVisibility = function ( elem, isVisible ) {
/*

Hides or shows elem
*/
		// ========================
		// SHOW OR HIDE OUR HELPER
		// ========================
		if ( isVisible ) {
			elem.style.visibility = "visible";
		} else {
			
			elem.style.visibility = "hidden";
		}

		return elem;
};  // End handleVisibility()

// -----------------------------
// --- Mostly for labels ---
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


var getAncestorsUntil = function ( childElem, ancestorElem ) {
/* ( HTML, HTML ) -> [ DOM ]

Return all ancestor of childElem up to and including ancestorElem
*/
	var elemList 			= [];
	var currentElem			= childElem.parentNode;
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

};  // End getAncestorsUntil()


var removeElements = function ( elemNodeList ) {
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
};  // End removeElements()


function getOffsetRect(elem) {
//http://javascript.info/tutorial/coordinates
/*

Gets the top and left offsets of an element
relative to the document (takes scrolling into account)
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
}  // End getOffsetRect()


var isOutOfWindow = function ( elem ) {
/* ( DOM ) -> bool

Tests whether an element peeks above viewport.
Not sure how to do just out of window...
*/
	// var elemRect 	= elem.getBoundingClientRect();
	// var elemTop 	= elemRect.top;
	var elemTop = getOffsetRect( elem ).top;
	console.log( elemTop );
	return elemTop < 0
};  // End isOutOfWindow()


// =====================
// LABELS
// =====================
// --- Bring labels back into window --- \\
// If I do this, I'm going to need something to indicate what
// elements they actually belong to, aren't I?
// Damnit. I don't want to do that. We'll see
var fixOutOfWindow = function ( elem ) {
/*

Tests if an element is out of the window. If it is,
it moves it into the window
*/
	if ( isOutOfWindow(elem) ) {
		elem.style.top = 0;
	}
	
	return elem;
};  // End fixOutOfWindow


var placeLabel = function ( elem, relationshipToOriginal ) {
/* ( DOM, str ) -> str

Places a label at the top of an element that says its position
attribute value.

relationshipToOriginal can either be "original" or "ancestor"

// http://stackoverflow.com/questions/6338217/get-a-css-value-with-javascript
*/

	// Get elem values
	var elemStyle 	= window.getComputedStyle( elem )
	var position 	= elemStyle.getPropertyValue( 'position' );

	// Build text and style based on values
	var labelString = "position: " + position;

	// ===============
	// LABEL COLOR
	// ===============
	var labelColor 	= 'lightgreen';
	// If it's the original element, its label should be
	// green no matter what
	if ( relationshipToOriginal !== 'original' ) {
		// If position is not absolute or relative, make box red.
		// Add a note?
		if ( position !== 'relative' && position !== 'absolute' ) {
			labelColor = 'tomato';
		}
	}

	// Build label
	var label 		= document.createElement('div');
	label.className = 'label';
	label.style['background-color'] = labelColor;

	var elemLeft 	= elem.offsetLeft,
		elemTop 	= elem.offsetTop;
	// Calculate 1.2 rem above elem
	// TODO: if the label is going off of the page, move it back on
	// Use clientRect?
	var topDiff 	= 1.2 * getRootElementFontSize();
	label.style.top = elemTop - topDiff;
	label.style.left = elemLeft;

	var labelText 	= document.createTextNode( labelString );
	label.appendChild( labelText );

	// Place in DOM
	var parent = elem.parentNode;
	parent.insertBefore( label, elem );

	// If it's out of the window after placement, get it back in
	fixOutOfWindow( label );

	return position;
};  // End placeLabel()


var labelElems = function ( elemList ) {
/* ( [ DOM ] ) -> same

Places position labels on all the elements in the list
*/

	for ( var elemi = 0; elemi < elemList.length; elemi++ )	{
		placeLabel( elemList[ elemi ], "ancestor" );
	}

	return elemList;
};  // end labelElems()


// ====================
// ORIGINATOR
// ====================
var createOriginator = function () {
/*

Creates the originator element with its properties
and its children
*/


};  // End createOriginator()


var placeOriginator = function ( currentTarget, oldTarget ) {
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
		var targetLeft = currentTarget.offsetLeft,
			targetTop = currentTarget.offsetTop;

		originDiv.style.width = targetLeft;
		originDiv.style.height = targetTop;

		return currentTarget;

};  // End placeOriginator()



