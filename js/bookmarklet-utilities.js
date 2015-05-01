/* tool-manager-utilities.js

These don't need any info outside of this script
*/

'use strict';

HandHeldBookmarkletManagerTM.Utils.DOM = function () {
	var DOMUtils = {};

	// ===============================================
	// ==================
	// ELEMENT DATA (except related functions, which are below)
	// ==================
	// --- GETTING ELEMENTS --- \\
	DOMUtils.getElemsFromUntil = function ( childElem, ancestorElem ) {
	/* ( HTML, HTML ) -> [ DOM ]

	Return all ancestor of childElem up to and including ancestorElem
	TODO: Stop at body (or html?)
	*/
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
				currentElem = currentElem.parentNode;
			}
		}  // end while ancestorNotFound

		if ( currentElem !== ancestorElem ) { elemList = "There was no such ancestor!"; }

		return elemList;

	};  // End DOMUtils.getElemsFromUntil()


	DOMUtils.oneHasClass = function ( elems, testClass ) {
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
	};  // End DOMUtils.oneHasClass()


	DOMUtils.oneHasId = function ( elems, testId ) {
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
	};  // End DOMUtils.oneHasId()


	// --- POSITIONS --- \\
	DOMUtils.getOffsetRect = function ( elem ) {
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
	}  // End DOMUtils.getOffsetRect()


	DOMUtils.positionRelativeToParent = function ( elem ) {
	/* ( DOM ) -> {}

	Gets position relative to parent instead of offset parent
	USES OTHER UTILITY FUNCTION
	*/
		var elemPos 	= DOMUtils.getOffsetRect( elem );
		var elemLeft 	= elemPos.left,
			elemTop 	= elemPos.top;

		var parentPos 	= DOMUtils.getOffsetRect( elem.parentNode );
		var parentLeft 	= parentPos.left,
			parentTop 	= parentPos.top;

		var xDiff 		= elemLeft - parentLeft;
		var xDiffSign 	= Math.sqrt( xDiff * xDiff );

		var yDiff 		= elemTop - parentTop;
		var yDiffSign 	= Math.sqrt( yDiff * yDiff );

		return {x: xDiffSign, y: yDiffSign}
	};  // End DOMUtils.positionRelativeToParent


	DOMUtils.isOutOfWindow = function ( elem ) {
	/* ( DOM ) -> bool

	Tests whether an element is partially above the DOM
	UESES OTHER UTILITY FUNCTION
	*/
		var elemTop = DOMUtils.getOffsetRect( elem ).top;
		return elemTop < 0
	};  // End DOMUtils.isOutOfWindow()


	// --- OTHER ATTRIBUTES OR PROPERTIES --- \\
	DOMUtils.getPositionStyle = function ( elem ) {

		var elemStyle = window.getComputedStyle( elem )
		return elemStyle.getPropertyValue( 'position' );

	}  // End DOMUtils.getPositionStyle()


	// ===============================================
	// ===================
	// CHANGING ELEMENTS (except related functions, which are below)
	// ===================
	// --- GENERAL --- \\
	DOMUtils.setAttributes = function ( elem, attrs ) {
	/*

	Sets a bunch of attributes all at once because that's annoying
	and messy
	Usecase: setAttributes(elem, {"width": "50%, "height": "100%", ...});
	*/
		for( var key in attrs ) {
			elem.setAttribute( key, attrs[key] );
		}

		return elem;
	};  // End DOMUtils.setAttributes()


	DOMUtils.removeElements = function ( elemNodeList ) {
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

		}

		return elemNodeList;
	};  // End DOMUtils.removeElements()


	// --- TRANSFORMS --- \\
	DOMUtils.rotateByDegrees = function ( elem, degrees ) {
	/* ( DOM, num ) -> same DOM */

		elem.style.webkitTransform = 'rotate(' + degrees + 'deg)'; 
		elem.style.mozTransform    = 'rotate(' + degrees + 'deg)'; 
		elem.style.msTransform     = 'rotate(' + degrees + 'deg)'; 
		elem.style.oTransform      = 'rotate(' + degrees + 'deg)'; 
		elem.style.transform       = 'rotate(' + degrees + 'deg)';

		return elem;
	};  // End DOMUtils.rotateByDegrees()


	DOMUtils.resetRotation = function ( elem ) {
	/* ( DOM ) -> same */

		elem.style.webkitTransform = 'rotate( 0deg )'; 
		elem.style.mozTransform    = 'rotate( 0deg )';
		elem.style.msTransform     = 'rotate( 0deg )';
		elem.style.oTransform      = 'rotate( 0deg )';
		elem.style.transform       = 'rotate( 0deg )';

		return elem;
	};  // End DOMUtils.resetRotation()



	// ===============================================
	// ==================
	// IMPORTING
	// ==================
	// From selector gadget bookmarklet

	DOMUtils.wait_for_script_load = function ( look_for, callback ) {
		var interval = setInterval( function() {

			if (eval("typeof " + look_for) != 'undefined') {
				clearInterval( interval );
				callback();
			}

		}, 50);
	};  // End DOMUtils.wait_for_script_load()

	DOMUtils.importCSS = function (href, look_for, onload) {
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
	};  // End DOMUtils.importCSS()

	DOMUtils.importJS = function (src, look_for, onload) {
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
	};  // End DOMUtils.importJS()

	return DOMUtils;
};  // End HandHeldBookmarkletManagerTM.Utils.DOM {}


