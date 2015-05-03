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
var HandHeldBookmarkletManagerTM 	= {};

HandHeldBookmarkletManagerTM.utils 	= {};
HandHeldBookmarkletManagerTM.Tools 	= {};
HandHeldBookmarkletManagerTM.tools 	= {};




// ??: HOW DO I TAKE STUFF OUT OF THE GLOBAL NAMESPACE?!
HandHeldBookmarkletManagerTM.run = function () {
/* ( none ) -> HandHeldBookmarkletManagerTM

Handles the setting up of all Hand Held Bookmarklest TM tools
and tool managers
*/
	var main = HandHeldBookmarkletManagerTM;

	main.baseColor 	= 'rgb(55, 55, 55)';


	// ===============================================
	// ==================
	// IMPORTING
	// ==================
	// From selector gadget bookmarklet

	main.wait_for_script_load = function ( look_for, callback ) {
		var interval = setInterval( function() {

			if (eval("typeof " + look_for) != 'undefined') {
				clearInterval( interval );
				callback();
			}

		}, 50);
	};  // End utils_dom.wait_for_script_load()

	main.importCSS = function (href, look_for, onload) {
		var script = document.createElement('link');
		script.setAttribute('rel', 'stylesheet');
		script.setAttribute('type', 'text/css');
		script.setAttribute('media', 'screen');
		script.setAttribute('href', href);
		if ( onload ) main.wait_for_script_load( look_for, onload );
			var head = document.getElementsByTagName('head')[0];
		if ( head ) {
			head.appendChild( script );
		} else {
			document.body.appendChild( script );
		}
	};  // End utils_dom.importCSS()

	main.importJS = function (src, look_for, onload) {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', src);
		if (onload) main.wait_for_script_load( look_for, onload );
			var head = document.getElementsByTagName('head')[0];
		if (head) {
			head.appendChild( script );
		} else {
			document.body.appendChild( script );
		}
	};  // End utils_dom.importJS()


	// First Utilities
	main.importJS( 'https://rawgit.com/knod/originator/one-name-space/js/utilities-math.js',
			'HandHeldBookmarkletManagerTM.utils.math', function () {
		main.importJS('https://rawgit.com/knod/originator/one-name-space/js/utilities-dom.js',
				'HandHeldBookmarkletManagerTM.utils.dom', function () {
			main.importJS('https://rawgit.com/knod/originator/one-name-space/js/utilities-color.js',
					'HandHeldBookmarkletManagerTM.utils.color', function () {
				// Then Components
				main.importJS('https://rawgit.com/knod/originator/one-name-space/js/labels.js',
						'HandHeldBookmarkletManagerTM.Labels', function () {

	main.labels = main.Labels( main.baseColor, main.utils );  // It's actually a function

					main.importJS('https://rawgit.com/knod/originator/one-name-space/js/Tools-Menu.js',
							'HandHeldBookmarkletManagerTM.ToolsMenu', function () {

	main.toolsMenu 	= main.ToolsMenu( 'bookmarkletToolManager', main.utils );

						main.importJS('https://rawgit.com/knod/originator/one-name-space/js/originator.js',
								'HandHeldBookmarkletManagerTM.Tools.Originator', function () {
							


	// ======================== 
	// ADD ALL TOOLS, manually I guess
	// ========================
	var originator = main.Tools.Originator( main.toolsMenu, main.utils, main.labels, main.baseColor );
	originator.toolsMenuItem.addEventListener (
		'click', function ( evnt ) { originator.toggle( evnt, main.toolsMenu ); }
	);
	main.tools.originator = originator;



						});  // End Tools Menu
					});  // End Tools Menu
				});  // End Labels
				// End Components
			});  // End color utils
		});  // End dom utils
	});  // End math utils
	// End Utilities

// Utilities
// //https://rawgit.com/knod/originator/one-name-space/js/utilities-labels.js

//https://rawgit.com/knod/originator/one-name-space/js/utilities-math.js
//https://rawgit.com/knod/originator/one-name-space/js/utilities-color.js
//https://rawgit.com/knod/originator/one-name-space/js/utilities-dom.js

// Components
//
//https://rawgit.com/knod/originator/one-name-space/js/Labels.js
//https://rawgit.com/knod/originator/one-name-space/js/Menu.js

// Tools
//https://rawgit.com/knod/originator/one-name-space/js/Originator.js


	// main.utils 		= {
	// 	Utils_Math: BookmarkletsUtilsMath,
	// 	// This one is a function
	// 	Utils_Labels: BookmarkletUtilsLabels(),
	// 	Utils_Color:  BookmarkletsUtilsColor,
	// 	Utils_DOM: BookmarkletUtils
	// }
	// Maybe not do labels utils, maybe put labels utils in dom utils

	// Import the component files?

	// main.labels = main.Labels( main.baseColor, main.utils );  // It's actually a function

	// main.importJS('https://rawgit.com/knod/originator/one-name-space/js/Menu.js', 'HandHeldBookmarkletManagerTM.manager', function () {
	// 	console.log()
	// 	// main.importJS('http://127.0.0.1:<port num>/filename');
	// 	main.toolsMenu 	= main.ToolsMenu( 'bookmarkletToolManager', main.utils );

	// 	// // http://www.sitepoint.com/call-javascript-function-string-without-using-eval/
	// 	// // http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
	// 	// // http://stackoverflow.com/questions/912596/how-to-turn-a-string-into-a-javascript-function-call
	// 	// main.possibleTools 	= [ 'Originator' ];
	// 	// main.currentTools 	= [];

	// 	// ======================== 
	// 	// ADD ALL TOOLS, manually I guess
	// 	// ========================
	// 	// Import all the tools, and at the end, add them?
	// 	var originator = main.Tools.Originator( main.toolsMenu, main.utils, main.labels, main.baseColor );
	// 	originator.toolsMenuItem.addEventListener (
	// 		'click', function ( evnt ) { originator.toggle( evnt, main.toolsMenu ); }
	// 	);
	// 	main.tools.originator = originator;


	// 	// for ( var tooli = 0; tooli < main.possibleTools.length; tooli++ ) {
	// 	// 	var funcStr 	= main.possibleTools[ tooli ],
	// 	// 		toolFunc	= window[ funcStr ];

	// 	// 	// Add any functions to our list of existing functions.
	// 	// 	// Maybe tools should add themselves to the list?
	// 	// 	if (typeof toolFunc === "function") {

	// 	// 		// Only originator needs labels atm...
	// 	// 		var newTool = toolFunc( main.toolsMenu, main.utils, main.labels, main.baseColor );

	// 	// 		// --- Disabling Event --- \\
	// 	// 		newTool.toolsMenuItem.addEventListener(
	// 	// 			'click', function (evnt) { newTool.toggle( evnt, main.toolsMenu ) }
	// 	// 		);

	// 	// 		// Which one?
	// 	// 		main.currentTools.push 					= newTool;
	// 	// 		// Make it lowercase first?
	// 	// 		main[ funcStr.toLowerCase() ] 			= newTool;
	// 	// 		main.tools[ funcStr.toLowerCase() ] 	= newTool;

	// 	// 	} else {
	// 	// 		console.log( funcStr, 'is not the name of a function in', window );
	// 	// 	}
	// 	// }

	// 	// Somehow, if another bookmarklet is added, run this again and add it...?
	// 	// Maybe tools should add themselves to the manager, but then there's cross
	// 	// contamination. Maybe each tool will give off a custom event?
	// });

	return main;
};  // End HandHeldBookmarkletManagerTM {}

// var handHeldBookmarkletsTM = HandHeldBookmarkletManagerTM.run();





