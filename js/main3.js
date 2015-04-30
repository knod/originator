/* main3.js

TODO:
- Get stuff out of global namespace

Resources no longer used:
	- http://tzi.fr/js/snippet/convert-em-in-px (1 rem to pixels)
		getRootElementFontSize()
*/

'use strict';

//===============================
//===============================
//===============================
// Refactoring
//===============================
// DON'T WANT THIS IN TOOL MANAGER because then
// Tool Manager will be calling Tool, but also visa versa
// Wait for some signal

// ??: HOW DO I TAKE STUFF OUT OF THE GLOBAL NAMESPACE?!
var HandHeldBookmarkletManagerTM = function () {
/* ( none ) -> HandHeldBookmarkletManagerTM

Handles the setting up of all Hand Held Bookmarklest TM tools
and tool managers
*/
	var main = {}

	main.utils = {
		Utils_Math: BookmarkletsUtilsMath,
		// This one is a function
		Utils_Labels: BookmarkletUtilsLabels(),
		Utils_Color:  BookmarkletsUtilsColor,
		Utils_DOM: BookmarkletUtils
	}

	main.labels = HandHeldLabels;  // It's actually a function

	main.manager = BookmarkletToolManager( 'bookmarkletToolManager', main.utils );

	// http://www.sitepoint.com/call-javascript-function-string-without-using-eval/
	// http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
	// http://stackoverflow.com/questions/912596/how-to-turn-a-string-into-a-javascript-function-call
	main.possibleTools 	= [ 'Originator' ];
	main.currentTools 	= [];

	for ( var tooli = 0; tooli < main.possibleTools.length; tooli++ ) {
		var funcStr 	= main.possibleTools[ tooli ],
			toolFunc	= window[ funcStr ];

		// Add any functions to our list of existing functions.
		// Maybe tools should add themselves to the list?
		if (typeof toolFunc === "function") {

			// Only originator needs labels atm...
			var newTool = toolFunc( main.manager, main.utils, main.labels );

			// --- Disabling Event --- \\
			newTool.managerItem.addEventListener(
				'click', function (evnt) { newTool.toggle( evnt, main.manager ) }
			);

			main.currentTools.push = newTool;

		} else {
			console.log( funcStr, 'is not the name of a function in', window );
		}
	}

	// Somehow, if another bookmarklet is added, run this again and add it...?
	// Maybe tools should add themselves to the manager, but then there's cross
	// contamination. Maybe each tool will give off a custom event?

	return main;
};  // End HandHeldBookmarkletManagerTM {}

var handHeldBookmarkletsTM = HandHeldBookmarkletManagerTM();





