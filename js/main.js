/* 04/21/15

!!! WARNING !!! This doesn't handle "position: sticky" yet
	https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
*/

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

	// Want to disappear on html click, but not if originator is clicked?
	if ( currentTarget.tagName === "HTML" ) { originatorVisible = false; }

	handleVisibility( originDiv, originatorVisible );

	// =================
	// EXCLUSIONS
	// =================
	// Don't try to track originator parts or labels
	// Don't make originator unclickable either. What if they want to inspect the element?
	var exclude = shouldExclude( currentTarget );

	if ( !exclude ) {

		// ================
		// PLACE THINGS
		// ================
		// If stuff is visible, make it look good
		if ( originatorVisible ) {

			// TODO: imo, it's kind of awkward that placeLabel returns a position value
			// 		Not sure what to do about it though
			var position = placeLabel( currentTarget, "original" );

			// ================
			// LABELS
			// ================
			// Always show the label of the current element
			// If the element is position: aboslute
			if ( position === "absolute" ) {
				// put labels on all the parents untill the positioning parent
				var ancestors = getAncestorsUntil( currentTarget, currentTarget.offsetParent );
				labelElems( ancestors );
			}

			// ORIGINATOR
			placeOriginator( currentTarget, position );

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
		if ( isVisible ) {
			elem.style.visibility = "visible";
		} else {
			
			elem.style.visibility = "hidden";
		}

		return elem;
};  // End handleVisibility()


var offsetFromOffsetParent = function ( elem ) {
/*
Get the difference between an element's ancestor and
an element's offsetParent 
*/
	var offsetLeft 	= elem.offsetLeft,
		offsetTop 	= elem.offsetTop;



};  // End offsetFromOffsetParent()


var offsetFromParent = function ( child ) {
/*

Gets the pixel distances between the origin of the parent
and the origin of the child

!!! WARNING !!! I think this only works if the child is not
above or to the left of the parent
*/
	var childRect 	= child.getBoundingClientRect(),
		parentRect 	= child.parentNode.getBoundingClientRect();

	var leftDiff 	= childRect.left - parentRect.left,
		topDiff 	= childRect.top - parentRect.top;
		
	return { x: leftDiff, y: topDiff };
};  // End offsetFromParent()


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


function getOffsetRect( elem ) {
/* ( DOM ) -> {}

http://javascript.info/tutorial/coordinates
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
	var elemTop = getOffsetRect( elem ).top;
	return elemTop < 0
};  // End isOutOfWindow()


// =====================
// START OF APP
// =====================
var shouldExclude = function ( currentElem ) {
/* ( DOM ) -> Bool

Makes sure the current element doesn't belong to the list of
excluded elements
*/
	var exclude = false;

	// --- Is or belongs to originator ---
	var isOrigin 	= currentElem.classList.contains("origin");
	var isHTML 		= (currentElem.tagName === "HTML");
	var isBody 		= (currentElem.tagName === "BODY");
	if ( !isHTML ) {
		// avoid html error, take care of the end-point dots
		isOrigin = isOrigin || currentElem.parentNode.classList.contains("origin")
	}
	// tag name BODY is not excluded, we just can't check the parent of its parent
	if ( !isHTML && !isBody ) {
		// avoid body error, take care of the svg lines
		isOrigin = isOrigin || currentElem.parentNode.parentNode.classList.contains("origin")
	}

	// --- labels ---
	var isLabel = currentElem.classList.contains("label");

	// --- result ---
	if ( isOrigin || isLabel || isHTML ) { exclude = true; }
	return exclude;
};  // End shouldExclude()


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
	var tagName 	= elem.tagName;

	// Build text and style based on values
	var labelString = "position: " + position + " <" + tagName + ">";

	// ===============
	// LABEL COLOR
	// ===============
	var labelColor 	= 'lightgreen';
	// If it's the original element, its label should be
	// green no matter what
	if ( relationshipToOriginal !== 'original' ) {
		// If position is not absolute or relative, make box red.
		// Add a note?
		if ( position === 'static' ) {
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


var placeOriginator = function ( currentTarget, position ) {
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

		// Attempting to connect non-absolute positioned
		// elements to their direct parents...
		var originLeft, originTop,
			targetLeft, targetTop;

		if ( position === "absolute" ) {
			originLeft 	= 0; originTop 	= 0;
			targetLeft 	= currentTarget.offsetLeft;
			targetTop 	= currentTarget.offsetTop;
		} else {

			var parent 	= currentTarget.parentNode;

			originLeft 	= parent.offsetLeft;
			originTop 	= parent.offsetTop;
			console.log( parent.offsetParent );
			console.log( originLeft, originTop );


			var offsets = offsetFromParent( currentTarget );
			targetLeft 	= offsets.x;
			targetTop 	= offsets.y;
			// console.log(offsets)
		}

		// Do it
		originDiv.style.left 	= originLeft;
		originDiv.style.top 	= originTop;

		originDiv.style.width 	= targetLeft;
		originDiv.style.height 	= targetTop;

		return currentTarget;

};  // End placeOriginator()



