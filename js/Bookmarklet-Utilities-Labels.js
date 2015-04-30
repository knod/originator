// Bookmarklet-Utilities-Labels.js

'use strict';

window.BookmarkletUtilsLabels = function () {

	var labelUtils 	= {},
		utils 		= BookmarkletUtils;

	labelUtils.fixOutOfWindow = function ( elem, shadowContainerPadding ) {
	/* ( DOM ) -> same DOM

	Tests if an element is out of the window. If it is,
	it moves it into the window
	*/
		// Doesn't include the shadow, just the colored bit of the label
		if ( BookmarkletUtils.isOutOfWindow(elem) ) { elem.style.top = -1 * shadowContainerPadding; }
		return elem;
	};  // End BookmarkletUtilsLabels.fixOutOfWindow()


	return labelUtils;
};

var bookmarkletUtilsLabels = BookmarkletUtilsLabels(;)
