// tools-manager.js

'use strict';

var BookmarkletToolManager = function ( variableName ) {

	var manager = {};
	var utils 	= toolManagerUtils;  // shorter name inside here

	manager.container 	= null;
	manager.menu 		= null;
	manager.items 		= [];

	// =====================
	// SETUP
	// =====================
	manager.newInput = function ( item, managerName ) {
	/*  */
		var input 	= document.createElement( 'input' );

		var inputID = managerName + '_toggle';
		
		utils.setAttributes( input, {
			'className': 'manager-checkbox',
			'type': 'checkbox', 'checked': 'checked',
			'id': inputID, 'name': managerName
		});

		item.appendChild( input );
	};  // manager.newInput()


	manager.newItem = function ( obj ) {
	/* ( str, str ) -> DOM */

		var item 	= document.createElement( 'li' );

		// --- INPUT --- \\
		// manager.newInput( item, obj.managerName );
		var input 	= document.createElement( 'input' );
		var inputID = obj.managerName + '_toggle';
		
		utils.setAttributes( input, {
			'className': 'manager-checkbox',
			'type': 'checkbox', 'checked': 'checked',
			'id': inputID, 'name': obj.managerName
		});

		item.appendChild( input );

		// --- VISUAL CHECKBOX --- \\
		// The thing that's actually visible instead of the checkbox
		var visual 			= document.createElement( 'span' );
		visual.className 	= 'fa fa-check-square-o checkbox-visual';

		item.appendChild( visual );

		// --- LABEL --- \\
		var label 			= document.createElement( 'label' );
		utils.setAttributes( label, {
			'className': 'manager-label', 'for': inputID
		} );

		// label.className 	= 'manager-label';
		// label['for'] 		= inputID;

		var text 		= document.createTextNode( obj.labelText );
		label.appendChild( text );

		item.appendChild( label );

		// --- DOM --- \\
		manager.menu.appendChild( item );
		// I think it has to be done after being added to the DOM
		item.addEventListener( 'click', function (evnt) { obj.toggle( evnt ) } );

		// --- INTERNAL --- \\
		manager.items.push( item );
		return item;
	};  // End manager.newItem()


	manager.createNew = function ( variableName ) {
	/* ( str ) -> DOM */

		var container = document.createElement( 'div' );
		utils.setAttributes( container, {
			'id': 'bookmarklet_collection_manager', 'data-varName': variableName
		});

		// --- MANAGER HEADER --- \\
		var header 	= document.createElement( 'h1' );
		var title 	= document.createTextNode( 'Tool Manager' );
		header.appendChild( title );

		container.appendChild( header );

		// --- MENU --- \\
		// Into which each tool will add itself
		var menu 	= document.createElement( 'menu' );
		menu.id 	= 'bookmarklets-settings';

		container.appendChild( menu );

		// --- Into action --- \\
		document.body.appendChild( container );
		manager.container 	= container;
		manager.menu 		= menu;

		return container
	};  // manager.createNew()


	// =====================
	// START EVERYTHING
	// =====================
	manager.createNew( variableName );

	return manager;
};  // BookmarkletToolManager()

// Give it to the global namespace
var bookmarkletToolManager = BookmarkletToolManager( 'bookletToolManager' );
