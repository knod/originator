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
			|| currentTarget.classList.contains("label");

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
		} else {
			originatorVisible = true;
		}
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


var labelElems = function ( elemList ) {
/* ( [ DOM ] ) -> ?

Places position labels on all the elements in the list
*/

	for ( var elemi = 0; elemi < elemList.length; elemi++ )	{

		placeLabel( elemList[ elemi ], "ancestor" );
	}

	return elemList;
};  // end labelElems()


var removeElements = function ( elemNodeList ) {
/*
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

	return true;
};  // End removeElements()


var handleVisibility = function ( elem, isVisible ) {
/*

Figures out if helper should be visible or not
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


var getRootElementFontSize = function () {
/*

Returns the pixel value of one rem
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

	// When we're done with them, rememeber to remove in other function
	// parent.removeChild(child);

	return position;

};  // End placeLabel()


// Testing
// var anElem = document.getElementsByClassName('first')[0];
// placeLabel( anElem );


