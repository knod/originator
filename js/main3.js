/* main3.js

TODO:
- Get stuff out of global namespace

Resources no longer used:
- http://tzi.fr/js/snippet/convert-em-in-px (1 rem to pixels)
	getRootElementFontSize()
- Custom event method: http://jsfiddle.net/jump7b9k/2/
- If label is clicked on, put it on the top

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

HandHeldBookmarkletManagerTM.removed = false;



// HandHeldBookmarkletManagerTM.removeOne = function () {


// };  // End HandHeldBookmarkletManagerTM.removeOne()


// HandHeldBookmarkletManagerTM.removeAll = function () {
// /*

// Gets rid of the bookmarklet stuff
// */

// 	var myBookmarklets = document.getElementsByClassName( main.removalClass );

// 	// Remove all the other scripts
// 	main.utils.dom.removeElements( main.allScripts );

// 	// Remove all the elements
// 	main.utils.dom.removeElements( myBookmarklets );
// 	// Reset all the objects?
// 	main.Tools 		= {}; main.tools 	= {};
// 	main.utils 		= {};
// 	main.toolMenu 	= {};
// 	main.labels 	= {};

// };  // End HandHeldBookmarkletManagerTM.removeAll()

// ??: HOW DO I TAKE STUFF OUT OF THE GLOBAL NAMESPACE?!
HandHeldBookmarkletManagerTM.begin = function () {
/* ( none ) -> HandHeldBookmarkletManagerTM

Handles the setting up of all Hand Held Bookmarklest TM tools
and tool managers
*/
	var main = HandHeldBookmarkletManagerTM;

	main.baseColor 		= 'rgb(55, 55, 55)';
	main.removalClass 	= 'hand-held-bookmarklets';


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

		// So it can be removed if needed
		return script;
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

		// So it can be removed if needed
		return script;
	};  // End utils_dom.importJS()



	// Utilities
	// //https://rawgit.com/knod/originator/one-name-space/js/utilities-labels.js

	//https://rawgit.com/knod/originator/one-name-space/js/utilities-math.js
	//https://rawgit.com/knod/originator/one-name-space/js/utilities-color.js
	//https://rawgit.com/knod/originator/one-name-space/js/utilities-dom.js

	// Components
	// Wrong capitalization on github for some reason
	//https://rawgit.com/knod/originator/one-name-space/js/labels.js
	//https://rawgit.com/knod/originator/one-name-space/js/Tool-Menu.js

	// Tools
	// Wrong capitalization on github for some reason
	//https://rawgit.com/knod/originator/one-name-space/js/originator.js



	// // First Utilities
	// main.importJS( 'https://rawgit.com/knod/originator/one-name-space/js/utilities-math.js',
	// 		'HandHeldBookmarkletManagerTM.utils.math', function () {
	// 	main.importJS('https://rawgit.com/knod/originator/one-name-space/js/utilities-dom.js',
	// 			'HandHeldBookmarkletManagerTM.utils.dom', function () {
	// 		main.importJS('https://rawgit.com/knod/originator/one-name-space/js/utilities-color.js',
	// 				'HandHeldBookmarkletManagerTM.utils.color', function () {
	// 			// Then Components
	// 			main.importJS('https://rawgit.com/knod/originator/one-name-space/js/labels.js',
	// 					'HandHeldBookmarkletManagerTM.Labels', function () {

	// main.labels = main.Labels( main.baseColor, main.utils );  // It's actually a function

	// 				main.importJS('https://rawgit.com/knod/originator/one-name-space/js/Tool-Menu.js',
	// 						'HandHeldBookmarkletManagerTM.ToolMenu', function () {

	// main.ToolMenu 	= main.ToolMenu( 'bookmarkletToolManager', main.utils );

	//					// Then Tools
	// 					main.importJS('https://rawgit.com/knod/originator/one-name-space/js/originator.js',
	// 							'HandHeldBookmarkletManagerTM.Tools.Originator', function () {
							


	// // ======================== 
	// // ADD ALL TOOLS, manually I guess
	// // ========================
	// var originator = main.Tools.Originator( main.ToolMenu, main.utils, main.labels, main.baseColor );
	// originator.menuItem.addEventListener (
	// 	'click', function ( evnt ) { originator.toggle( evnt, main.ToolMenu ); }
	// );
	// main.tools.originator = originator;



	// 					});  // End Tools Menu
	// 				});  // End Tools Menu
	// 			});  // End Labels
	// 			// End Components
	// 		});  // End color utils
	// 	});  // End dom utils
	// });  // End math utils
	// // End Utilities



	main.startAll = function () {
	/*  */

		main.allScripts;
		var mathScript, domScript, colorScript, labelsScript, toolMenuScript, originatorScript;

		// First Utilities
		mathScript = main.importJS( "http://127.0.0.1:8000/js/utilities-math.js",
				"HandHeldBookmarkletManagerTM.utils.math", function () {
			domScript = main.importJS("http://127.0.0.1:8000/js/utilities-dom.js",
					"HandHeldBookmarkletManagerTM.utils.dom", function () {
				colorScript = main.importJS("http://127.0.0.1:8000/js/utilities-color.js",
						"HandHeldBookmarkletManagerTM.utils.color", function () {
					// Then Components
					labelsScript = main.importJS("http://127.0.0.1:8000/js/labels.js",
							"HandHeldBookmarkletManagerTM.Labels", function () {

		main.labels = main.Labels( main.baseColor, main.utils, main.removalClass );  // It's actually a function

						toolMenuScript = main.importJS("http://127.0.0.1:8000/js/Tool-Menu.js",
								"HandHeldBookmarkletManagerTM.ToolMenu", function () {

		main.toolMenu 	= main.ToolMenu( "bookmarkletToolMenu", main.utils, main.removalClass );

							// Then Tools
							originatorScript = main.importJS("http://127.0.0.1:8000/js/Originator.js",
									"HandHeldBookmarkletManagerTM.Tools.Originator", function () {
								

										// Originator adds itself

		// Used to remove all scripts if needed.
		// main.allScripts = [ mathScript, domScript, colorScript, labelsScript, toolMenuScript, originatorScript ];


							});  // End Tools Menu
						});  // End Tools Menu
					});  // End Labels
					// End Components
				});  // End color utils
			});  // End dom utils
		});  // End math utils
		// End Utilities


		return main;
	};  // End main.startAll()

	main.startAll();

	return main;
};  // End HandHeldBookmarkletManagerTM {}

var handHeldBookmarkletsTM = HandHeldBookmarkletManagerTM.begin();





