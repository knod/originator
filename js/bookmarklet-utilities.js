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



toolManagerUtils.importCSS = function (href, look_for, onload) {
/* From Selector Gadget */
  var s = document.createElement('link');
  s.setAttribute('rel', 'stylesheet');
  s.setAttribute('type', 'text/css');
  s.setAttribute('media', 'screen');
  s.setAttribute('href', href);
  if (onload) wait_for_script_load(look_for, onload);
  var head = document.getElementsByTagName('head')[0];
  if (head) {
    head.appendChild(s);
  } else {
    document.body.appendChild(s);
  }
}

