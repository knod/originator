/* main3.js

TODO:
- Get stuff out of global namespace
- If label is clicked on, put it on the top
- Test adding the bookmarklet multiplle times

Resources no longer used:
- http://tzi.fr/js/snippet/convert-em-in-px (1 rem to pixels)
	getRootElementFontSize()
- Custom event method: http://jsfiddle.net/jump7b9k/2/

*/

'use strict';

//===============================
// SET UP FOR WHEN OTHER SCRIPTS ARE ADDED
// ==============================
var HandHeldBookmarkletManagerTM 	= {};

HandHeldBookmarkletManagerTM.utils 	= {};
HandHeldBookmarkletManagerTM.Tools 	= {};
HandHeldBookmarkletManagerTM.tools 	= {};


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



	// First Utilities
	main.importJS( 'https://rawgit.com/knod/originator/gh-pages/js/utilities-math.js',
			'HandHeldBookmarkletManagerTM.utils.math', function () {
		main.importJS('https://rawgit.com/knod/originator/gh-pages/js/utilities-dom.js',
				'HandHeldBookmarkletManagerTM.utils.dom', function () {
			main.importJS('https://rawgit.com/knod/originator/gh-pages/js/utilities-color.js',
					'HandHeldBookmarkletManagerTM.utils.color', function () {
				// Then Components
				main.importJS('https://rawgit.com/knod/originator/gh-pages/js/Labels.js',
						'HandHeldBookmarkletManagerTM.Labels', function () {

	main.labels = main.Labels( main.baseColor, main.utils );  // It's actually a function

					main.importJS('https://rawgit.com/knod/originator/gh-pages/js/Tool-Menu.js',
							'HandHeldBookmarkletManagerTM.ToolMenu', function () {

	main.toolMenu 	= main.ToolMenu( 'bookmarkletToolManager', main.utils );

						// Then Tools
						main.importJS('https://rawgit.com/knod/originator/gh-pages/js/Originator.js',
								'HandHeldBookmarkletManagerTM.Tools.Originator', function () {
							
							// Tools add themselves


						});  // End Tools Menu
					});  // End Tools Menu
				});  // End Labels
				// End Components
			});  // End color utils
		});  // End dom utils
	});  // End math utils
	// End Utilities



	// // First Utilities
	// main.importJS( "http://127.0.0.1:8000/js/utilities-math.js",
	// 		"HandHeldBookmarkletManagerTM.utils.math", function () {
	// 	main.importJS("http://127.0.0.1:8000/js/utilities-dom.js",
	// 			"HandHeldBookmarkletManagerTM.utils.dom", function () {
	// 		main.importJS("http://127.0.0.1:8000/js/utilities-color.js",
	// 				"HandHeldBookmarkletManagerTM.utils.color", function () {
	// 			// Then Components
	// 			main.importJS("http://127.0.0.1:8000/js/Labels.js",
	// 					"HandHeldBookmarkletManagerTM.Labels", function () {

	// main.labels = main.Labels( main.baseColor, main.utils );  // It"s actually a function

	// 				main.importJS("http://127.0.0.1:8000/js/Tool-Menu.js",
	// 						"HandHeldBookmarkletManagerTM.ToolMenu", function () {

	// main.toolMenu 	= main.ToolMenu( "bookmarkletToolManager", main.utils );

	// 					// Then Tools
	// 					main.importJS("http://127.0.0.1:8000/js/Originator.js",
	// 							"HandHeldBookmarkletManagerTM.Tools.Originator", function () {
							

	// 								// Originator adds itself


	// 					});  // End Tools Menu
	// 				});  // End Tools Menu
	// 			});  // End Labels
	// 			// End Components
	// 		});  // End color utils
	// 	});  // End dom utils
	// });  // End math utils
	// // End Utilities


	main.removeAll 	= function () {
	/*

	Removes all the tool elements from the page
	*/
		for ( var toolKey in main.tools ) {
			// Each tool removes any labels it uses
			main.tools[ toolKey ].removeSelf();
		}
		main.toolMenu.removeSelf()

		return main;
	};

	document.addEventListener( 'removeAll clicked', main.removeAll );


	return main;
};  // End HandHeldBookmarkletManagerTM {}

var handHeldBookmarkletsTM = HandHeldBookmarkletManagerTM.run();





