// tool-manager-utilities.js

'use strict';

var BookmarkletUtils = {}; 
/*

Long name so it doesn't interfere with other names
*/

// ===================
// ATTRIBUTES
// ===================
BookmarkletUtils.setAttributes = function ( elem, attrs ) {
/*

Sets a bunch of attributes all at once because that's annoying
and messy
Usecase: setAttributes(elem, {"width": "50%, "height": "100%", ...});
*/
	for( var key in attrs ) {
		elem.setAttribute( key, attrs[key] );
	}

	return elem;
};  // End BookmarkletUtils.setAttributes()

//


// ==================
// COLORS
// ==================



// ==================
// IMPORTING
// ==================
// From selector gadget bookmarklet

BookmarkletUtils.wait_for_script_load = function ( look_for, callback ) {
	var interval = setInterval( function() {

		if (eval("typeof " + look_for) != 'undefined') {
			clearInterval( interval );
			callback();
		}

	}, 50);
};  // End BookmarkletUtils.wait_for_script_load()

BookmarkletUtils.importCSS = function (href, look_for, onload) {
	var script = document.createElement('link');
	script.setAttribute('rel', 'stylesheet');
	script.setAttribute('type', 'text/css');
	script.setAttribute('media', 'screen');
	script.setAttribute('href', href);
	if ( onload ) wait_for_script_load( look_for, onload );
		var head = document.getElementsByTagName('head')[0];
	if ( head ) {
		head.appendChild( script );
	} else {
		document.body.appendChild( script );
	}
};  // End BookmarkletUtils.importCSS()

BookmarkletUtils.importJS = function (src, look_for, onload) {
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', src);
	if (onload) wait_for_script_load( look_for, onload );
		var head = document.getElementsByTagName('head')[0];
	if (head) {
		head.appendChild( script );
	} else {
		document.body.appendChild( script );
	}
};  // End BookmarkletUtils.importJS()
