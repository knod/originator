/* main3.js

TODO:
- Get stuff out of global namespace

Resources no longer used:
	- http://tzi.fr/js/snippet/convert-em-in-px (1 rem to pixels)
		getRootElementFontSize()
*/

'use strict';

//===============================
// THE BOSS
//===============================
// DON'T WANT THIS IN TOOL MANAGER because then
// Tool Manager will be calling Tool, but also visa versa
// Wait for some signal to actually start stuff? Especially
// after we handle the name space thing.

var HandHeldBookmarkletManagerTM 	= {};

// // The tool factories
// HandHeldBookmarkletManagerTM.Tools 	= {};
// // The tools once they've been instantiated
// HandHeldBookmarkletManagerTM.tools 	= {};
// // Same for utilities
// HandHeldBookmarkletManagerTM.Utils 	= {};
// HandHeldBookmarkletManagerTM.utils 	= {};


HandHeldBookmarkletManagerTM.run = function () {
/* ( none ) -> HandHeldBookmarkletManagerTM

Handles the setting up of all Hand Held Bookmarklest TM tools
and tool managers

Long name so it doesn't interfere with other names

??: Should I keep a record of the Factories too?
*/
	// HandHeldBookmarkletManagerTM is the same as "this" in here
	// ??: If I console log HandHeldBookmarkletManagerTM up here,
	// it has a .baseColor already set. How is that possible?
	var mainMan = HandHeldBookmarkletManagerTM;

	// ============================
	// NEEDED FOR BUILDING COMPONENTS
	// ============================
	mainMan.baseColor 	= 'rgb(55, 55, 55)';

	// --- Utilities --- \\
	// mainMan.Utils = {};
	mainMan.utils 				= {
		// Ones that don't rely on other utilities
		// Utils_DOM: 		mainMan.Utils.DOM(),
		// Utils_Math: 	mainMan.Utils.Math(),
		// Utils_Color:  	mainMan.Utils.Color()
	}
	// mainMan.utils.Utils_Labels 	= mainMan.Utils.Labels( mainMan.utils.Utils_DOM )

	// --- Non-tools, non-utilities --- \\
	// mainMan.labels 		= mainMan.Labels;  // It's actually a function
	// mainMan.toolManager = mainMan.ToolManager( 'bookmarkletToolManager', mainMan.utils );

	// mainMan.Tools = {};
	mainMan.tools = {};

	// To be created by components
	// mainMan.Labels, mainMan.toolManager


	// =====================
	// ADDING COMPONENTS
	// =====================
	// mainMan.possibleTools 	= [ 'Originator' ];
	// mainMan.currentTools 		= [];

	mainMan.newComponentHandler = function ( compData ) {
	/*

	!!! Apparently it's not great to tell event handlers what to do,
	like to instantiate something or not, it's better to just say what
	happened.
	*/

		var main = mainMan;  // for shorter name
		// console.log( componentData )

		var cmpKey  = compData.key;
		// If nothing is instantiated, add the Factory to mainMan
		var toAdd 	= compData.Factory;

		// --- Component Factory --- \\
		if ( compData.mustInstantiate === true ) {
			// Send the properties requested by the component
			var propsToGet 		= compData.propertiesNeeded;
			var props 			= {};

			for ( var propi = 0; propi < propsToGet.length; propi++ ) {
				var prop 		= propsToGet[ propi ];
				props[ prop ] 	= main[ prop ];
			}

			// ??: Should I keep a record of the Factory too?
			toAdd = new compData.Factory( props );
		}

		// --- Adding To Self --- \\
		// If the component needs to go inside another dictionary
		console.log( 'ownerDict:', compData.ownerDict );
		if ( compData.ownerDict !== undefined ) {

			main[ compData.ownerDict ][ cmpKey ] = toAdd;

		// Otherwise it's just a property of this object
		} else {
			main[ cmpKey ] = toAdd;
		}
		// Haven't implemented anything more than two steps deep,
		// like a dict in a dict in a dict in mainMan

		return toAdd;
	};  // End mainMan.newComponentHandler()


	// Each tool will add an instance of itself to mainMan.tools
	document.addEventListener('newComponentAdded', function ( componentEvent ) { 
		// Each component creates a custom event that triggers this
		// And passes in its own information and needs
		// http://jsfiddle.net/jump7b9k/2/
		// .detail is a custom event _thing_ and has to be called exactly that
		mainMan.newComponentHandler( componentEvent.detail );
	});

	return mainMan;
};  // End HandHeldBookmarkletManagerTM {}

var handHeldBookmarkletsTM = HandHeldBookmarkletManagerTM;


