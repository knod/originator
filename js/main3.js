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

// The tool factories
HandHeldBookmarkletManagerTM.Tools 	= {};
// The tools once they've been instantiated
HandHeldBookmarkletManagerTM.tools 	= {};
// Same for utilities
HandHeldBookmarkletManagerTM.Utils 	= {};
HandHeldBookmarkletManagerTM.utils 	= {};


HandHeldBookmarkletManagerTM.run = function () {
/* ( none ) -> HandHeldBookmarkletManagerTM

Handles the setting up of all Hand Held Bookmarklest TM tools
and tool managers

Long name so it doesn't interfere with other names
*/
	// HandHeldBookmarkletManagerTM is the same as "this" in here
	// ??: If I console log HandHeldBookmarkletManagerTM up here,
	// it has a .baseColor already set. How is that possible?
	var mainMan = HandHeldBookmarkletManagerTM;

	mainMan.baseColor 	= 'rgb(55, 55, 55)';

	// --- Utilities --- \\
	mainMan.utils 				= {
		// Ones that don't rely on other utilities
		Utils_DOM: 		mainMan.Utils.DOM(),
		Utils_Math: 	mainMan.Utils.Math(),
		Utils_Color:  	mainMan.Utils.Color()
	}
	mainMan.utils.Utils_Labels 	= mainMan.Utils.Labels( mainMan.utils.Utils_DOM )

	// --- Non-tools, non-utilities --- \\
	mainMan.labels 		= mainMan.Labels;  // It's actually a function
	mainMan.toolManager = mainMan.ToolManager( 'bookmarkletToolManager', mainMan.utils );

	// mainMan.possibleTools 	= [ 'Originator' ];
	mainMan.currentTools 		= [];

	mainMan.newComponentHandler = function ( compData ) {

		var main = mainMan;  // for shorter name
		// console.log( componentData )

		var cmpKey  	= compData.key;

		// --- Component Factory --- \\
		// Send the properties requested by the component
		var propsToGet 	= compData.propertiesNeeded;
		var props 		= {};

		for ( var propi = 0; propi < propsToGet.length; propi++ ) {
			var prop 		= propsToGet[ propi ];
			props[ prop ] 	= main[ prop ];
		}

		var newCmp = new compData.Factory( props );

		// If the component needs to go inside another dictionary
		console.log( compData.ownerDict );
		if ( compData.ownerDict !== undefined ) {

			main[ compData.ownerDict ][ cmpKey ] = newCmp;

		// Otherwise it's just a property of this object
		} else {
			main[ cmpKey ] = newCmp;
		}

	};  // End mainMan.newComponentHandler()


	document.addEventListener('newComponentAdded', function ( componentEvent ) { 
		// Each component creates a custom event that triggers this
		// And passes in its own information and needs
		// http://jsfiddle.net/jump7b9k/2/
		// .detail is a custom event _thing_ and has to be called exactly that
		mainMan.newComponentHandler( componentEvent.detail );
	});


	// mainMan.newToolAddedHandler 	= function ( toolData ) {
	// /*

	// Handles newToolAdded event. Inits the tool and adds it to this manager
	// toolData has... we'll figure that out
	// */
	// 	var main = mainMan;  // for shorter name

	// 	// console.log(toolData);
	// 	var toolKey 	= toolData.key;

	// 	var propsToGet 	= toolData.propertiesNeeded
	// 	var props 		= {};
	// 	for ( var propi = 0; propi < propsToGet.length; propi++ ) {

	// 	}

	// 	var newTool 	= toolData.Factory(
	// 		main.toolManager, main.utils, main.labels, main.baseColor
	// 	);

	// 	// Not sure if this is necessary
	// 	main.tools[ toolKey ] = newTool;

	// 	// --- Tool Manager Event --- \\
	// 	newTool.formItemNode.addEventListener(
	// 		'click', function (evnt) { newTool.toggle( evnt, main.toolManager ); }
	// 	);

	// 	// Which one?
	// 	main.currentTools.push 	= newTool;
	// 	main[ toolKey ] 		= newTool;
	// 	main.tools[ toolKey ] 	= newTool;

	// };  // End mainMan.addTool()

	// document.addEventListener('newToolAdded', function ( toolEvent ) { 
	// 	// Each tool creates a custom event that triggers this
	// 	// And passes in its own information
	// 	mainMan.newToolAddedHandler( toolEvent.detail );
	// });

	
	// Each tool will add an instance of itself to mainMan.tools

	// Initiate instances of the tools, which will add
	// themselves to mainMan.tools
	// for ( var ToolName in mainMan.Tools ) {
	// 	// "Tool" apparently arrives as a string
	// 	// http://www.sitepoint.com/call-javascript-function-string-without-using-eval/
	// 	// http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
	// 	// http://stackoverflow.com/questions/912596/how-to-turn-a-string-into-a-javascript-function-call
	// 	// Testing if the event works
	// 	document.dispatchEvent( newToolAddedEvent );
	// }  // End for ToolName in Tools

	// for ( var tooli = 0; tooli < main.possibleTools.length; tooli++ ) {
	// 	var funcStr 	= main.possibleTools[ tooli ],
	// 		toolFunc	= window[ funcStr ];

	// 	// Add any functions to our list of existing functions.
	// 	// Maybe tools should add themselves to the list?
	// 	if (typeof toolFunc === "function") {

	// 		// Only originator needs labels atm...
	// 		var newTool = toolFunc( main.manager, main.utils, main.labels, main.baseColor );

	// 		// --- Disabling Event --- \\
	// 		newTool.managerItem.addEventListener(
	// 			'click', function (evnt) { newTool.toggle( evnt, main.manager ) }
	// 		);

	// 		// Which one?
	// 		main.currentTools.push 					= newTool;
	// 		// Make it lowercase first?
	// 		main[ funcStr.toLowerCase() ] 			= newTool;
	// 		main.tools[ funcStr.toLowerCase() ] 	= newTool;

	// 	} else {
	// 		console.log( funcStr, 'is not the name of a function in', window );
	// 	}
	// }  

	// for ( var ToolName in mainMan.Tools ) {

	// 	if ( typeof mainMan.Tools[ ToolName ] === 'function' ) {

	// 		var 

	// 	}

	// }  // End for Tool in possibleTools

	// Somehow, if another bookmarklet is added, run this again and add it...?
	// Maybe tools should add themselves to the manager, but then there's cross
	// contamination. Maybe each tool will give off a custom event?

	return mainMan;
};  // End HandHeldBookmarkletManagerTM {}

var handHeldBookmarkletsTM = HandHeldBookmarkletManagerTM;


