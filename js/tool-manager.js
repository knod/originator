/* tools-manager.js

TODO:
- Add a 'Remove' button for each tool?
- Add a 'Remove All' button?
*/

'use strict';

var BookmarkletToolManager = function ( variableName ) {
/* ( str ) -> BookmarkletToolManager

Creates and adds the tool manager to the DOM.
variableName = name of the variable that called this. Planning
for each tool to use that name to access the manager...
*/

	var manager = {};
	var utils 	= toolManagerUtils;  // shorter name inside here

	// manager.container 	= null;  // Needed?
	manager.menu 		= null;
	manager.items 		= [];

	manager.checkedClasses 		= 'fa fa-check-square-o checkbox-visual';
	manager.uncheckedClasses 	= 'fa fa-square-o checkbox-visual';

	// ==========================
	// FOR MAKING NEW MENU ITEMS
	// ==========================
	manager.addNewInput = function ( item, inputID, managerName ) {
	/*  ( DOM, str, str ) -> other DOM
	*/
		var input = document.createElement( 'input' );
		utils.setAttributes( input, {
			'class': 'manager-checkbox', 'type': 'checkbox', 'checked': 'checked',
			'id': inputID, 'name': managerName
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
		utils.setAttributes( label, {'class': 'manager-label', 'for': inputID} );

		var text 	= document.createTextNode( labelText );
		label.appendChild( text );

		item.appendChild( label );

		return label;
	};  // End manager.addNewLabel()


	manager.addNewItem = function ( obj ) {
	/* ( str, str ) -> DOM */

		// --- MENU ITEM --- \\
		var item 	= document.createElement( 'li' );
		// Two things will use this
		var inputID = obj.managerName + '_toggle';

		// --- INSIDE MENU ITEM --- \\
		manager.addNewInput( item, inputID, obj.managerName );
		manager.addNewIcon( item );
		manager.addNewLabel( item, inputID, obj.labelText )

		// --- DOM --- \\
		manager.menu.appendChild( item );
		// I think listener has to be done after node is added to the DOM
		item.addEventListener( 'click', function (evnt) { obj.toggle( evnt ) } );

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
		utils.setAttributes( container, {
			'id': 'bookmarklet_collection_manager', 'data-varName': variableName
		});

		manager.addHeaderTo( container );
		// Into which each tool will add itself
		manager.menu = manager.addMenuTo( container );

		// --- DOM --- \\
		document.body.appendChild( container );
		// manager.container 	= container;

		return container
	};  // manager.createNew()


	// =====================
	// START EVERYTHING
	// =====================
	manager.createNew( variableName );

	return manager;
};  // BookmarkletToolManager()

// Give this to the global namespace
var bookmarkletToolManager = BookmarkletToolManager( 'bookletToolManager' );
