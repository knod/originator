/* Tool-Menu.js

TODO:
- Add a 'Remove' button for each tool?
- Add a 'Remove All' button?
*/

'use strict';

HandHeldBookmarkletManagerTM.ToolMenu = function ( variableName, utilsDict ) {
/* ( str ) -> HandHeldBookmarkletManagerTM.ToolMenu

Creates and adds the tool manager to the DOM.
variableName = name of the variable that called this. Planning
for each tool to use that name to access the manager...
*/

	var toolMenu 	= {};

	toolMenu.container 	= null;  // Needed?
	toolMenu.menu 		= null;
	toolMenu.items 		= [];

	toolMenu.checkedClasses 		= 'fa fa-check-square-o tool-menu-checkbox-icon';
	toolMenu.uncheckedClasses 	= 'fa fa-square-o tool-menu-checkbox-icon';


	var utils_DOM 		= utilsDict.dom;
	// FontAwesome
	utils_DOM.importCSS('https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');
	utils_DOM.importCSS('http://127.0.0.1:8000/css/tool-menu.css');


	// ==========================
	// FOR MAKING NEW MENU ITEMS
	// ==========================
	toolMenu.addNewInput = function ( item, inputID, toolName ) {
	/*  ( DOM, str, str ) -> other DOM
	*/
		var input = document.createElement( 'input' );
		utils_DOM.setAttributes( input, {
			'class': 'bookmarklet-tools-menu-checkbox', 'type': 'checkbox', 'checked': 'checked',
			'id': inputID, 'name': toolName
		});

		item.appendChild( input );

		return input;
	};  // End toolMenu.addNewInput()


	toolMenu.addNewIcon = function ( item ) {
	/* ( DOM ) -> other DOM

	The thing that's actually visible instead of the checkbox
	Fontawesome icon right now
	*/
		var visual 		 = document.createElement( 'span' );
		visual.className = toolMenu.checkedClasses;

		item.appendChild( visual );

		return visual;
	};  // End toolMenu.addNewIcon()


	toolMenu.addNewLabel = function ( item, inputID, labelText ) {
	/* ( DOM, str, str ) -> other DOM

	Creates, adds to the DOM, and returns, the label linked to the
	checkbox (including the label text)
	*/
		var label 	= document.createElement( 'label' );
		utils_DOM.setAttributes( label, {'class': 'bookmarklet-tools-menu-label', 'for': inputID} );

		var text 	= document.createTextNode( labelText );
		label.appendChild( text );

		item.appendChild( label );

		return label;
	};  // End toolMenu.addNewLabel()


	toolMenu.addNewItem = function ( tool ) {
	/* ( str, str ) -> DOM */

		// --- MENU ITEM --- \\
		var item 	= document.createElement( 'li' );
		// Two things will use this
		var inputID = tool.name + '_toggle';

		// --- INSIDE MENU ITEM --- \\
		toolMenu.addNewInput( item, inputID, tool.name );
		toolMenu.addNewIcon( item );
		toolMenu.addNewLabel( item, inputID, tool.labelText )

		// --- DOM --- \\
		toolMenu.menu.appendChild( item );
		// Exclude the container from the attention of this tool
		toolMenu.container.className = 
			toolMenu.container.className + ' ' + tool.name + '-exclude';

		// --- INTERNAL --- \\
		toolMenu.items.push( item );
		return item;
	};  // End toolMenu.addNewItem()


	// =====================
	// LOGIC (there's gotta be a better name... runtime?)
	// =====================
	toolMenu.changeIcon = function ( checkbox ) {
	/* ( DOM ) -> other DOM

	Changes the fake checkbox appearance based on checkbox
	Should I pass in the event target instead?
	*/
		var checked 	= checkbox.checked;
		// var parent 		= eventTarget.parentNode;
		// var checkbox 	= parent.getElementsByClassName( 'toolMenu-checkbox' )[0];
		var iconElem 	= checkbox.parentNode.getElementsByClassName( 'tool-menu-checkbox-icon' )[0];

		if ( checked === true ) {
			iconElem.className = toolMenu.checkedClasses;
		} else if ( checked === false ) {
			iconElem.className = toolMenu.uncheckedClasses;
		}

		return checkbox;
	};  // End toolMenu.changeIcon()


	// =====================
	// toolMenu INITIALIZATION
	// =====================
	toolMenu.addHeaderTo = function ( container ) {
	/* ( DOM ) -> other DOM
	*/
		var header 	= document.createElement( 'h1' );
		var title 	= document.createTextNode( 'Tool Menu' );
		header.appendChild( title );

		container.appendChild( header );

		return header;
	};  // End toolMenu.addHeaderTo()

	toolMenu.addMenuTo = function ( container ) {
	/* ( DOM ) -> other DOM

	*/
		var menu 	= document.createElement( 'menu' );
		menu.id 	= 'bookmarklets-settings';

		container.appendChild( menu );

		return menu;
	};  // End toolMenu.addMenuTo()

	toolMenu.createNew = function ( variableName ) {
	/* ( str ) -> DOM */

		var container = document.createElement( 'div' );
		utils_DOM.setAttributes( container, {
			'id': 'bookmarklet_tool_menu', 'data-varName': variableName
		});

		toolMenu.addHeaderTo( container );
		// Into which each tool will add itself
		toolMenu.menu = toolMenu.addMenuTo( container );

		// --- DOM --- \\
		document.body.appendChild( container );
		toolMenu.container 	= container;

		return container
	};  // toolMenu.createNew()


	// =====================
	// START EVERYTHING
	// =====================
	toolMenu.createNew( variableName );

	return toolMenu;
};  // HandHeldBookmarkletManagerTM.ToolMenu()

// Give this to the global namespace
// var bookmarkletToolManager = HandHeldBookmarkletManagerTM.ToolMenu( 'bookletToolManager' );
