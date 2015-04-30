// Bookmarklet-Utilities-Labels.js

'use strict';

window.BookmarkletUtilsLabels = function ( Utils_DOM ) {

	var labelUtils 	= {},
		Utils 		= BookmarkletUtils;

	labelUtils.fixOutOfWindow = function ( elem, nudging ) {
	/* ( Node, num ) -> same Node

	Tests if an element is out of the window. If it is,
	it moves it into the window. Nudging nudges it up or
	down - caller determines negative or positive
	*/
		// Take away any extra space at the top
		if ( Utils.isOutOfWindow(elem) ) {
			// Except whatever vertical shift you want
			elem.style.top = nudging;
		}

		return elem;
	};  // End BookmarkletUtilsLabels.fixOutOfWindow()

	return labelUtils;
};

// var bookmarkletUtilsLabels = BookmarkletUtilsLabels();