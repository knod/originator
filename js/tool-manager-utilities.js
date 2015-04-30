// tool-manager-utilities.js

'use strict';

var toolManagerUtils = {}; 
/*

Long name so it doesn't interfere with other names
*/

// ===================
// INITIALIZATION
// ===================
toolManagerUtils.setAttributes = function ( elem, attrs ) {
/*

Sets a bunch of attributes all at once because that's annoying
and messy
Usecase: setAttributes(elem, {"width": "50%, "height": "100%", ...});
*/
	for( var key in attrs ) {
		elem.setAttribute( key, attrs[key] );
	}

	return elem;
};  // End toolManagerUtils.setAttributes()

