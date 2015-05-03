/* tools-manager.js

TODO:
- Add a 'Remove' button for each tool?
- Add a 'Remove All' button?
*/

'use strict';

HandHeldBookmarkletManagerTM.manager = function ( variableName, utilsDict ) {
/* ( str ) -> HandHeldBookmarkletManagerTM.manager

Creates and adds the tool manager to the DOM.
variableName = name of the variable that called this. Planning
for each tool to use that name to access the manager...
*/

	var manager 	= {};
	var utils_DOM 	= utilsDict.dom;  // shorter name inside here

	manager.container 	= null;  // Needed?
	manager.menu 		= null;
	manager.items 		= [];

	manager.checkedClasses 		= 'fa fa-check-square-o checkbox-visual';
	manager.uncheckedClasses 	= 'fa fa-square-o checkbox-visual';

	// FontAwesome
	utils_DOM.importCSS('https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');
	// tool manager css when we have a cdn
	// utils_DOM.importCSS();

	// ==========================
	// FOR MAKING NEW MENU ITEMS
	// ==========================
	manager.addNewInput = function ( item, inputID, toolName ) {
	/*  ( DOM, str, str ) -> other DOM
	*/
		var input = document.createElement( 'input' );
		utils_DOM.setAttributes( input, {
			'class': 'manager-checkbox', 'type': 'checkbox', 'checked': 'checked',
			'id': inputID, 'name': toolName
		});

		item.appendChild( input );

		return input;
	};  // End manager.addNewInput()


	manager.addNewIcon = function ( item ) {
	/* ( DOM ) -> other DOM

	The thing that's actually visible instead of the checkbox
	Fontawesome icon right now
	*/
		var visual 		 = document.createElement( 'span' );
		visual.className = manager.checkedClasses;

		item.appendChild( visual );

		return visual;
	};  // End manager.addNewIcon()


	manager.addNewLabel = function ( item, inputID, labelText ) {
	/* ( DOM, str, str ) -> other DOM

	Creates, adds to the DOM, and returns, the label linked to the
	checkbox (including the label text)
	*/
		var label 	= document.createElement( 'label' );
		utils_DOM.setAttributes( label, {'class': 'manager-label', 'for': inputID} );

		var text 	= document.createTextNode( labelText );
		label.appendChild( text );

		item.appendChild( label );

		return label;
	};  // End manager.addNewLabel()


	manager.addNewItem = function ( tool ) {
	/* ( str, str ) -> DOM */

		// --- MENU ITEM --- \\
		var item 	= document.createElement( 'li' );
		// Two things will use this
		var inputID = tool.name + '_toggle';

		// --- INSIDE MENU ITEM --- \\
		manager.addNewInput( item, inputID, tool.name );
		manager.addNewIcon( item );
		manager.addNewLabel( item, inputID, tool.labelText )

		// --- DOM --- \\
		manager.menu.appendChild( item );
		// Exclude the container from the attention of this tool
		manager.container.className = 
			manager.container.className + ' ' + tool.name + '-exclude';

		// --- INTERNAL --- \\
		manager.items.push( item );
		return item;
	};  // End manager.addNewItem()


	// =====================
	// LOGIC (there's gotta be a better name... runtime?)
	// =====================
	manager.changeIcon = function ( checkbox ) {
	/* ( DOM ) -> other DOM

	Changes the fake checkbox appearance based on checkbox
	Should I pass in the event target instead?
	*/
		var checked 	= checkbox.checked;
		// var parent 		= eventTarget.parentNode;
		// var checkbox 	= parent.getElementsByClassName( 'manager-checkbox' )[0];
		var iconElem 	= checkbox.parentNode.getElementsByClassName( 'checkbox-visual' )[0];

		if ( checked === true ) {
			iconElem.className = manager.checkedClasses;
		} else if ( checked === false ) {
			iconElem.className = manager.uncheckedClasses;
		}

		return checkbox;
	};  // End manager.changeIcon()


	// =====================
	// MANAGER INITIALIZATION
	// =====================
	manager.addHeaderTo = function ( container ) {
	/* ( DOM ) -> other DOM
	*/
		var header 	= document.createElement( 'h1' );
		var title 	= document.createTextNode( 'Tool Manager' );
		header.appendChild( title );

		container.appendChild( header );

		return header;
	};  // End manager.addHeaderTo()

	manager.addMenuTo = function ( container ) {
	/* ( DOM ) -> other DOM

	*/
		var menu 	= document.createElement( 'menu' );
		menu.id 	= 'bookmarklets-settings';

		container.appendChild( menu );

		return menu;
	};  // End manager.addMenuTo()

	manager.createNew = function ( variableName ) {
	/* ( str ) -> DOM */

		var container = document.createElement( 'div' );
		utils_DOM.setAttributes( container, {
			'id': 'bookmarklet_collection_manager', 'data-varName': variableName
		});

		manager.addHeaderTo( container );
		// Into which each tool will add itself
		manager.menu = manager.addMenuTo( container );

		// --- DOM --- \\
		document.body.appendChild( container );
		manager.container 	= container;

		return container
	};  // manager.createNew()


	// =====================
	// START EVERYTHING
	// =====================
	manager.createNew( variableName );

	return manager;
};  // HandHeldBookmarkletManagerTM.manager()

// Give this to the global namespace
// var bookmarkletToolManager = HandHeldBookmarkletManagerTM.manager( 'bookletToolManager' );
