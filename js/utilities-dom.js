/* tool-manager-utilities.js

These don't need any info outside of this script
*/

'use strict';

// Instantiated at the bottom using the build_utils_dom function
HandHeldBookmarkletManagerTM.utils.dom;  

HandHeldBookmarkletManagerTM.utils.build_utils_dom = function () {
/* ( None ) -> HandHeldBookmarkletManagerTM.utils.dom

Stupid way to not have to use the long name for every single
property of this object. (some of the functions call on other
functions of this object, so they have to all be created
separately)
*/
	var utils_dom = {};

	// ===============================================
	// ==================
	// ELEMENT DATA (except related functions, which are below)
	// ==================
	// --- GETTING ELEMENTS --- \\
	utils_dom.getElemsFromUntil = function ( childElem, ancestorElem ) {
	/* ( HTML, HTML ) -> [ DOM ]

	Return all ancestor of childElem up to and including ancestorElem
	TODO: Stop at body (or html?)
	*/
		// HTML is the top, it has no reachable ancestors
		if ( childElem.tagName === "HTML" ) { return [ childElem ]; }

		var elemList 			= [];
		var currentElem			= childElem;
		var ancestorNotFound 	= true;

		// Cycle through the ancestors, until the right ancestor is reached
		// ??: Can document.body have a parent?
		while ( ancestorNotFound ) {

			elemList.push( currentElem );

			if ( currentElem === ancestorElem ) {
				ancestorNotFound = false;
			} else {
				// For next loop iteration
				if (currentElem.parentNode === null) {console.log('currentElem:', currentElem);debugger;}
				currentElem = currentElem.parentNode;
			}
		}  // end while ancestorNotFound

		if ( currentElem !== ancestorElem ) { elemList = "There was no such ancestor!"; }

		return elemList;

	};  // End utils_dom.getElemsFromUntil()


	utils_dom.oneHasClass = function ( elems, testClass ) {
	/* ( [ DOM ], str ) -> bool

	Returns whether one element in the list of elements has a class
	*/
		var oneHasClass = false;

		for ( var elemi = 0; elemi < elems.length; elemi++ ) {

			if ( elems[ elemi ].classList.contains( testClass ) ) {
				oneHasClass = true;
			}
		}

		return oneHasClass;
	};  // End utils_dom.oneHasClass()


	utils_dom.oneHasId = function ( elems, testId ) {
	/* ( [ DOM ], str ) -> bool

	Returns whether one element in the list of elements has an id of testId
	*/
		var oneHasId = false;

		for ( var elemi = 0; elemi < elems.length; elemi++ ) {

			if ( elems[ elemi ].id === testId ) {
				oneHasId = true;
			}
		}

		return oneHasId;
	};  // End utils_dom.oneHasId()


	// --- POSITIONS --- \\
	utils_dom.getOffsetRect = function ( elem ) {
	/* ( DOM ) -> {}

	http://javascript.info/tutorial/coordinates
	Gets the top and left offsets of an element relative
	to the document (takes scrolling into account)
	*/
	    // (1)
	    var box = elem.getBoundingClientRect()
	     
	    var body = document.body
	    var docElem = document.documentElement
	     
	    // (2)
	    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
	    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
	     
	    // (3)
	    var clientTop = docElem.clientTop || body.clientTop || 0
	    var clientLeft = docElem.clientLeft || body.clientLeft || 0
	     
	    // (4)
	    var top  = box.top +  scrollTop - clientTop
	    var left = box.left + scrollLeft - clientLeft
	     
	    return { top: Math.round(top), left: Math.round(left) }
	}  // End utils_dom.getOffsetRect()


	utils_dom.positionRelativeToParent = function ( elem ) {
	/* ( DOM ) -> {}

	Gets position relative to parent instead of offset parent
	USES OTHER UTILITY FUNCTION
	*/
		var elemPos 	= utils_dom.getOffsetRect( elem );
		var elemLeft 	= elemPos.left,
			elemTop 	= elemPos.top;

		var parentPos 	= utils_dom.getOffsetRect( elem.parentNode );
		var parentLeft 	= parentPos.left,
			parentTop 	= parentPos.top;

		var xDiff 		= elemLeft - parentLeft;
		var xDiffSign 	= Math.sqrt( xDiff * xDiff );

		var yDiff 		= elemTop - parentTop;
		var yDiffSign 	= Math.sqrt( yDiff * yDiff );

		return {x: xDiffSign, y: yDiffSign}
	};  // End utils_dom.positionRelativeToParent


	utils_dom.isOutOfWindow = function ( elem ) {
	/* ( DOM ) -> bool

	Tests whether an element is partially above the DOM
	UESES OTHER UTILITY FUNCTION
	*/
		var elemTop = utils_dom.getOffsetRect( elem ).top;
		return elemTop < 0
	};  // End utils_dom.isOutOfWindow()


	// --- OTHER ATTRIBUTES OR PROPERTIES --- \\
	utils_dom.getPositionStyle = function ( elem ) {

		var elemStyle = window.getComputedStyle( elem )
		return elemStyle.getPropertyValue( 'position' );

	}  // End utils_dom.getPositionStyle()


	// ===============================================
	// ===================
	// CHANGING ELEMENTS (except related functions, which are below)
	// ===================
	// --- GENERAL --- \\
	utils_dom.setAttributes = function ( elem, attrs ) {
	/*

	Sets a bunch of attributes all at once because that's annoying
	and messy
	Usecase: setAttributes(elem, {"width": "50%, "height": "100%", ...});
	*/
		for( var key in attrs ) {
			elem.setAttribute( key, attrs[key] );
		}

		return elem;
	};  // End utils_dom.setAttributes()


	utils_dom.removeElements = function ( elemNodeList ) {
	/* ( Node list ) or ( [Node] ) -> same

	Removes all elements in elemList from the DOM
	*/

		// Some browsers have dynamic node lists, others have static node lists
		// Using nodeList[0] in each loop would therefore break sometimes
		var elemArray = [].slice.call( elemNodeList );

		for ( var elemi = 0; elemi < elemArray.length; elemi++ ) {

			var elem = elemArray[ elemi ];
			var parent = elem.parentNode;

			parent.removeChild( elem );

			// // In case parent has already been removed, as is the case
			// // when removing all the bookmarklet elements from the page
			// if ( elem.parentNode !== null ) {

			// 	var parent = elem.parentNode;

			// 	parent.removeChild( elem );

			// }

		}

		return elemNodeList;
	};  // End utils_dom.removeElements()


	// --- POSITIONS --- \\
	utils_dom.fixAboveWindow = function ( elem, nudging ) {
	/* ( Node, num ) -> same Node

	Tests if an element is out of the window. If it is,
	it moves it into the window. Nudging nudges it up or
	down - caller determines negative or positive
	*/
		// Take away any extra space at the top
		if ( utils_dom.isOutOfWindow(elem) ) {
			// Except whatever vertical shift you want
			elem.style.top = nudging;
		}

		return elem;
	};  // End utils_dom.fixAboveWindow()

	// --- TRANSFORMS --- \\
	utils_dom.rotateByDegrees = function ( elem, degrees ) {
	/* ( DOM, num ) -> same DOM */

		elem.style.webkitTransform = 'rotate(' + degrees + 'deg)'; 
		elem.style.mozTransform    = 'rotate(' + degrees + 'deg)'; 
		elem.style.msTransform     = 'rotate(' + degrees + 'deg)'; 
		elem.style.oTransform      = 'rotate(' + degrees + 'deg)'; 
		elem.style.transform       = 'rotate(' + degrees + 'deg)';

		return elem;
	};  // End utils_dom.rotateByDegrees()


	utils_dom.resetRotation = function ( elem ) {
	/* ( DOM ) -> same */

		elem.style.webkitTransform = 'rotate( 0deg )'; 
		elem.style.mozTransform    = 'rotate( 0deg )';
		elem.style.msTransform     = 'rotate( 0deg )';
		elem.style.oTransform      = 'rotate( 0deg )';
		elem.style.transform       = 'rotate( 0deg )';

		return elem;
	};  // End utils_dom.resetRotation()



	// ===============================================
	// ==================
	// IMPORTING
	// ==================
	// From selector gadget bookmarklet

	utils_dom.wait_for_script_load = function ( look_for, callback ) {
		var interval = setInterval( function() {

			if (eval("typeof " + look_for) != 'undefined') {
				clearInterval( interval );
				callback();
			}

		}, 50);
	};  // End utils_dom.wait_for_script_load()

	utils_dom.importCSS = function (href, look_for, onload) {
		var script = document.createElement('link');
		script.setAttribute('rel', 'stylesheet');
		script.setAttribute('type', 'text/css');
		script.setAttribute('media', 'screen');
		script.setAttribute('href', href);
		if ( onload ) wait_for_script_load( look_for, onload );
			var head = document.getElementsByTagName('head')[0];
		if ( head ) {
			head.appendChild( script );
		} else {
			document.body.appendChild( script );
		}
	};  // End utils_dom.importCSS()

	utils_dom.importJS = function (src, look_for, onload) {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', src);
		if (onload) wait_for_script_load( look_for, onload );
			var head = document.getElementsByTagName('head')[0];
		if (head) {
			head.appendChild( script );
		} else {
			document.body.appendChild( script );
		}
	};  // End utils_dom.importJS()

	return utils_dom;
};  // End HandHeldBookmarkletManagerTM.utils.dom.build()


// Instantiate self right away
HandHeldBookmarkletManagerTM.utils.dom = HandHeldBookmarkletManagerTM.utils.build_utils_dom();
