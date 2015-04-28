/* main2.js

TODO:
- Pulse color of line and circles when they first appear?
 or just make them a color other than black?
- Maybe put abs pos element's left and top values
 in label?
- Move stuff when page resizes or styles are changed

Resources no longer used:
	- http://tzi.fr/js/snippet/convert-em-in-px (1 rem to pixels)
		getRootElementFontSize()
*/

'use strict'


var Originator = function () {
/*

*/
	var origr = {};

	origr.node 				= null;
	origr.oldTarget 		= null;
	origr.currentTarget 	= null;
	origr.cssFirstPart 		= null;
	origr.circleLT 			= null;
	origr.circleRB 			= null;

	origr.deactivated 		= false;
	origr.loopPaused 		= false;

	var baseColor 			= 'rgb(55, 55, 55)',
		outlineColor		= 'white',
		wrongColor 			= 'tomato',
		rightColor 			= 'lightgreen';


	// ===============================================================
	// =================
	// GENERAL
	// =================
	var utils = {};

	// --- INITIALIZATION ---
	utils.setAttributes = function ( elem, attrs ) {
	/*

	Sets a bunch of attributes all at once because that's annoying
	and messy
	Usecase: setAttributes(elem, {"width": "50%, "height": "100%", ...});
	*/
		for( var key in attrs ) {
			elem.setAttribute( key, attrs[key] );
		}

		return elem;
	};  // End utils.setAttributes()


	// --- MOSTLY FOR ORIGINALTOR ---
	utils.oneHasClass = function ( elems, testClass ) {
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
	};  // End oneHasClass()

	utils.distanceBetween = function ( point1, point2 ) {
	/* ( {}, {} ) -> num
	
	Returns the pixel distance between point1 and point2
	*/
		var xDistance = 0;
		var yDistance = 0;

		xDistance = point2.x - point1.x;
		xDistance = xDistance * xDistance;

		yDistance = point2.y - point1.y;
		yDistance = yDistance * yDistance;

		return Math.sqrt( xDistance + yDistance );

	};  // End distanceBetween()


	utils.degreesFromHorizontal = function ( point1, point2 ) {
	/* ( {}, {} ) -> num

	Returns number of degrees between a horizontal line to the right
	and the line made by the two given points.
	*/
		var deltaY = point2.y - point1.y,
			deltaX = point2.x - point1.x;

		var angleInDegrees = Math.atan2( deltaY, deltaX ) * 180 / Math.PI;

		return angleInDegrees;
	};  // End degreesFromHorizontal()


	utils.rotateByDegrees = function ( elem, degrees ) {
	/* ( DOM, num ) -> same DOM */

		elem.style.webkitTransform = 'rotate(' + degrees + 'deg)'; 
		elem.style.mozTransform    = 'rotate(' + degrees + 'deg)'; 
		elem.style.msTransform     = 'rotate(' + degrees + 'deg)'; 
		elem.style.oTransform      = 'rotate(' + degrees + 'deg)'; 
		elem.style.transform       = 'rotate(' + degrees + 'deg)';

		return elem;
	};  // End rotateByDegrees()


	utils.resetRotation = function ( elem ) {
	/* ( DOM ) -> same */

		elem.style.webkitTransform = 'rotate( 0deg )'; 
		elem.style.mozTransform    = 'rotate( 0deg )';
		elem.style.msTransform     = 'rotate( 0deg )';
		elem.style.oTransform      = 'rotate( 0deg )';
		elem.style.transform       = 'rotate( 0deg )';

		return elem;
	};  // End resetRotation()


	// --- MOSTLY FOR LABELS ---
	utils.getElemsFromUntil = function ( childElem, ancestorElem ) {
	/* ( HTML, HTML ) -> [ DOM ]

	Return all ancestor of childElem up to and including ancestorElem
	*/
		var elemList 			= [];
		var currentElem			= childElem;
		var ancestorNotFound 	= true;

		// Cycle through the ancestors, until the right ancestor is reached
		// ??: Can document.body have a sibling?
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

	};  // End utils.getElemsFromUntil()


	utils.removeElements = function ( elemNodeList ) {
	/* ( Node list ) -> same

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
	};  // End utils.removeElements()


	utils.isOutOfWindow = function ( elem ) {
	/* ( DOM ) -> bool

	Tests whether an element peeks above viewport.
	Not sure how to do just out of window...
	*/
		var elemTop = utils.getOffsetRect( elem ).top;
		return elemTop < 0
	};  // End utils.isOutOfWindow()


	utils.fixOutOfWindow = function ( elem ) {
	/*

	Tests if an element is out of the window. If it is,
	it moves it into the window
	*/
		// Doesn't include the shadow, just the colored bit of the label
		if ( utils.isOutOfWindow(elem) ) { elem.style.top = -1 * shadowContainerPadding; }
		return elem;
	};  // End fixOutOfWindow


	// --- FOR BOTH ---
	utils.getOffsetRect = function ( elem ) {
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
	}  // End utils.getOffsetRect()


	utils.getPositionStyle = function ( elem ) {

		var elemStyle 	= window.getComputedStyle( elem )
		return elemStyle.getPropertyValue( 'position' );

	}  // End utils.getPositionStyle()


	utils.positionRelativeToParent = function ( elem ) {
	/* ( DOM ) -> {}

	Gets position relative to parent instead of offset parent
	*/
		var elemPos 	= utils.getOffsetRect( elem );
		var elemLeft 	= elemPos.left,
			elemTop 	= elemPos.top;

		var parentPos 	= utils.getOffsetRect( elem.parentNode );
		var parentLeft 	= parentPos.left,
			parentTop 	= parentPos.top;

		var xDiff 		= elemLeft - parentLeft;
		var xDiffSign 	= Math.sqrt( xDiff * xDiff );

		var yDiff 		= elemTop - parentTop;
		var yDiffSign 	= Math.sqrt( yDiff * yDiff );

		return {x: xDiffSign, y: yDiffSign}
	};  // End utils.positionRelativeToParent



	// ===============================================================
	// =================
	// APP LOGIC
	// =================
	origr.shouldExclude = function ( currentElem ) {
	/* ( DOM ) -> Bool

	Makes sure the current element doesn't belong to the list of
	excluded elements
	*/
		var exclude = false;

		// --- Is or belongs to originator ---
		var allElems 	= utils.getElemsFromUntil( currentElem, document.body.parentNode );
		var isOrigin 	= utils.oneHasClass( allElems, 'originator' );

		var isLabel 	= utils.oneHasClass( allElems, 'label-shadow-cutoff' );

		// --- result ---
		if ( isOrigin || isLabel ) { exclude = true; }
		return exclude;
	};  // End origr.shouldExclude()


	origr.getNewVisibility = function ( currentTarget, oldTarget ) {
	/* ( DOM, DOM ) -> str

	This is a bit messy. Not sure if there's anything to do about it.
	Gets a style.visibility value depending on what is clicked on
	*/

		// --- DETERMINE VISIBILITY --- \\
		var isVisible = false;
		if ( origr.node.style.visibility === 'visible' ) { isVisible = true; }

		// If same target, toggle visibility
		if ( currentTarget === oldTarget ) {
			isVisible = !isVisible;
		// Make originator visible if a new element is clicked on
		} else { isVisible = true; }

		// Always disappear if HTML is clicked
		if ( currentTarget.tagName === "HTML" ) { isVisible = false; }

		// --- TRANSLATE TO PROPERTY TYPE --- \\
		var visibility = "hidden";
		if ( isVisible ) { visibility = "visible" }

		return visibility;
	};  // End getNewVisibility()



	// ====================
	// LABELS
	// ====================
	var shadowContainerPadding 	= 2;

	var createShadowCutoff = function () {
	/* ( None ) -> DOM

	Creates labele element that will surround the shadowed
	element and cut off the bottom shadow.
	http://stackoverflow.com/questions/1429605/creating-a-css3-box-shadow-on-all-sides-but-one
		second answer "cut it off with overflow"
	*/

		var cutoff 	= document.createElement('div');
		cutoff.className = 'label-shadow-cutoff';

		var pd 		= shadowContainerPadding + 'px ';
		var style 	= 'position: absolute; z-index: 100; '
			+ 'padding: ' + pd + pd + '0 ' + pd + '; overflow: hidden;'

		cutoff.setAttribute( 'style', style );

		return cutoff;
	};  // End createShadowCutoff()


	var createShadowed 	= function ( labelColor, labelString ) {
	/* ( None ) -> DOM

	Create label element that will contain the text, the color,
	and have a shadow.
	*/
		var inner 		= document.createElement('div');
		inner.className = 'label-shadowed-elem';

		var style 		= 'border: solid ' + baseColor + ' 1px; padding: 0 0.2rem; '
			+ 'border-radius: 4px 4px 0px 0px; '
			+ 'box-shadow: 0 0 3px .1px rgba(0, 0, 0, .5); '
			+ 'background-color: ' + labelColor;
		
		inner.setAttribute('style', style);

		var labelText 	= document.createTextNode( labelString );
		inner.appendChild( labelText );

		return inner;
	};  // End createShadow()


	var createLabel 	= function ( elem, labelColor, labelString ) {
	/*

	Create one label for an element
	*/
		var cutoff 		= createShadowCutoff();
		var shadowed 	= createShadowed( labelColor, labelString );
		cutoff.appendChild( shadowed );

		return cutoff
	};  // End createLabel()


	var positionLabel = function ( label, elem ) {
	/* ( DOM, DOM ) -> label DOM

	Lines up the visible part of the label with the element that
	it labels (the outer container makes things tricky)
	*/
		var elemRect 	= utils.getOffsetRect( elem );
		var elemLeft 	= elemRect.left,
			elemTop 	= elemRect.top;

		// Account for container's padding (which there for the shadow)
		label.style.left 	= elemLeft - shadowContainerPadding;
		// Get the bottom completely lined up
		var labelHeight 	= label.offsetHeight;
		// For some reason it seems to always end up a little higher. Math.
		label.style.top 	= (elemTop - labelHeight) + 1;
		var elemStyle 	= elem.getBoundingClientRect();

		// If it's now sticking out of the top of the DOM, bring it back in
		utils.fixOutOfWindow( label );

		return label;
	};  // End positionLabel


	var placeLabel = function ( elem, placeInChain, childPosition ) {
	/* ( DOM, str ) -> str

	Places a label at the top of an element. All show position style. Parents
	show ancestry and child shows computed left and top values.

	placeInChain can either be "child" or "ancestor #"
	// http://stackoverflow.com/questions/6338217/get-a-css-value-with-javascript
	*/

		// Get this element's position
		var positionStyle 	= utils.getPositionStyle( elem );

		// --- COLOR --- \\
		var labelColor 	= rightColor;
		// If it's the original element, its label should be green. If not...
		if ( placeInChain !== 'child' ) {
			// A static ancestor is out of sync and should be red
			if ( (childPosition === 'absolute') && (positionStyle === 'static') ) {
				labelColor = wrongColor;
			}
		}

		// --- TEXT --- \\
		var labelString = 'position: ' + positionStyle + ' (' + placeInChain + ')';

		// Child shows its computed left and top values
		if ( placeInChain === 'child' ) {
			var elemStyle 	= window.getComputedStyle( elem );
			var leftPx 		= elemStyle.getPropertyValue( 'left' ),
				leftStr 	= 'left: ' + leftPx;
			var topPx 		= elemStyle.getPropertyValue( 'top' ),
				topStr		= ', top: ' + topPx;

			labelString 	= 'position: ' + positionStyle + ' (' + leftStr + topStr + ')';
		}

		// --- NODE --- \\
		var label 		= createLabel( elem, labelColor, labelString );
		document.body.appendChild( label );

		// --- FINAL POSITION --- \\
		positionLabel( label, elem );

		return elem;
	};  // End placeLabel()


	var labelElems = function ( elemList, childPosition ) {
	/* ( [ DOM ] ) -> same

	Places positionStyle labels on all the elements in the list
	*/

		// Backwards through the list so ancestors don't cover children
		for ( var elemi = (elemList.length - 1); elemi >= 0; elemi-- )	{
			var placeInChain = 'ancestor ' + (elemi - 1) ;

			if ( elemi === 0 ) {
				placeInChain = 'child';
			}

			placeLabel( elemList[ elemi ], placeInChain, childPosition );
		}  // end for elemList

		return elemList;
	};  // end labelElems()



	// ====================
	// ORIGINATOR
	// ====================
	// --- COLORS ---
	var rgbStrToNums = function ( rgb ) {
	/* ( str ) -> {}

	// http://stackoverflow.com/questions/13070054/convert-rgb-strings-to-hex-in-javascript
	*/
		var colorNumStr = rgb.split("(")[1].split(")")[0],
			colorNums 	= colorNumStr.split(","),
			red 		= parseFloat( colorNums[0] ),
			green 		= parseFloat( colorNums[1] ),
			blue 		= parseFloat( colorNums[2] );

		return {r: red, g: green, b: blue};
	};  // End rgbStrToNums


	var hslNumsToStr = function ( hsls ) {
	/* { num } -> Str

	Converts strings to "hsl(num, num%, num%)"
	*/
		return 'hsl(' + hsls.h + ', ' + hsls.s + '%, ' + hsls.l + '%)';
	};  //  End hslNumsToStr()

	var rgbNumsToHslNums = function ( rgbs ) {
	/* ( num, num, num ) -> Str

	*/
		// http://stackoverflow.com/questions/4793729/rgb-to-hsl-and-back-calculation-problems
        var red = rgbs.r / 255, green = rgbs.g / 255, blue = rgbs.b / 255;

        var _Min 	= Math.min(Math.min(red, green), blue),
        	_Max 	= Math.max(Math.max(red, green), blue),
        	_Delta 	= _Max - _Min;

        var light 	= ( (_Max + _Min) / 2 ),
        	light 	= 100 * light;

        var satur 	= 0,
        	hue 	= 0;

		if (_Delta != 0)
		{
			// Saturation
			if (light < 0.5) 	{  satur = ( _Delta / (_Max + _Min) );  }
			else 				{  satur = ( _Delta / (2 - _Max - _Min) );  }

			// Hue?
			if (red === _Max) 			{ hue = (green - blue) / _Delta; }
			else if (green === _Max) 	{ hue = 2 + (blue - red) / _Delta; }
			else if (blue == _Max) 		{ hue = 4 + (red - green) / _Delta; }
		}

		satur 				= 100 * satur;
		hue 				= hue * 60;
        if (hue < 0) hue 	+= 360;

        var hsls = { h: hue, s: satur, l: light };

        return  hsls;
	};  // end rgbNumsToHslNums()


	// SEEMS TO WORK!!! :D :D :D
	var determineColor = function ( elem ) {
	/* ( DOM ) -> Str

	Returns an rgb string
	*/
		var styles = getComputedStyle( elem )

		var color 	= styles.getPropertyValue( 'background-color' );

		var borderWidth = styles.getPropertyValue( 'border-width' );
		borderWidth = parseFloat( borderWidth );

		// If the border will completely contain the circle, get its color instead
		if ( borderWidth > 3 ) {
			color = styles.getPropertyValue( 'border-color' );
		}

		return color;
	};  // End determineColor()


	var toChildColor = function ( rgbs ) {
	/* ( {nums} ) -> Str
	
	Returns an hsl str ready to be used in a style value
	*/
		var min = 80, modifier = 30;

		// lightness to 80%
		var rgbNums 	= rgbStrToNums( rgbs ),
			hsls 		= rgbNumsToHslNums( rgbNums );

		// Prepare to send the new value to be converted
		hsls.l 			= min;
		hsls.l 	= Math.min( ( hsls.l + modifier ), min );

		// console.log('Child:', hsls);

		return hslNumsToStr( hsls );
	};  // End toChildColor()

	var toParentColor = function ( rgbs ) {
	/* ( {nums} ) -> Str
	
	Returns an hsl str ready to be used in a style value
	*/
		var max = 35, modifier = 30;

		// lightness to 30%
		var rgbNums 	= rgbStrToNums( rgbs ),
			hsls 		= rgbNumsToHslNums( rgbNums );

		// Prepare to send the new value to be converted
		hsls.l 			= max;
		hsls.l 	= Math.max( ( hsls.l - modifier ), max );

		// console.log('Parent:', hsls);

		return hslNumsToStr( hsls );
	};  // End toParentColor()


	var changeCirclesColor = function ( childElem, parentElem ) {
	/*

	Changes circle's colors to match the 
	*/
		var childColor 			= determineColor( childElem ),
			childCircleColor 	= toChildColor( childColor );
		origr.circleChild.setAttribute( 'fill', childCircleColor );
		console.log();

		var parentColor 		= determineColor( parentElem ),
			parentCircleColor 	= toParentColor( parentColor );
		origr.circleParent.setAttribute( 'fill', parentCircleColor );

		return [ origr.circleChild.getAttribute('fill'), origr.circleParent.getAttribute('fill') ]
	};  // End changeCirclesColor()

	// --- EVERYTHING ELSE ---
	origr.placeOriginator = function ( currentTarget, positionStyle, targetParent ) {
	/* ( DOM, DOM ) -> DOM

	Places the originator at the correct starting and ending points.
	Returns the element that was passed in as the currentTarget
	*/
		var origrNode_ = origr.node;
		// Rotation is accumulative. Always reset first.
		utils.resetRotation( origrNode_ );

		// Positions left and top to x and y
		var parentPos 	= utils.getOffsetRect( targetParent ),
			pCoords		= { 'x': parentPos.left, 'y': parentPos.top };
		var targetPos 	= utils.getOffsetRect( currentTarget ),
			tCoords		= { 'x': targetPos.left, 'y': targetPos.top };

		// Line Length
		var distance 	= utils.distanceBetween( pCoords, tCoords );
		origrNode_.style.width = distance + "px";

		// Line rotation (from top left because of css)
		var degrees 	= utils.degreesFromHorizontal( pCoords, tCoords );
		utils.rotateByDegrees( origrNode_, degrees );

		// Position
		var parentLeft 	= parentPos.left;
		origrNode_.style.left 	= parentLeft;

		var parentTop 	= parentPos.top;
		origrNode_.style.top 	= parentTop;

		// Color
		changeCirclesColor( currentTarget, targetParent );

		return currentTarget;

	};  // End placeOriginator()


	origr.hide = function () {
	/* ( None ) -> None

	Makes everything except the disable/enable button disappear
	*/
		var labels = document.getElementsByClassName( 'label-shadow-cutoff' );
		utils.removeElements( labels );

		origr.node.style.visibility = 'hidden';

		return 'hidden';
	};  // End origr.hide()


	origr.makeMagic = function ( currentTarget, deactivated ) {
	/*

	In its own function so we can call it again on resize
	*/

		// Just always get rid of them. They'll be replaced further down if needed
		var labels 		= document.getElementsByClassName( 'label-shadow-cutoff' );
			utils.removeElements( labels );

		// If the target is removed, it still exists in our js as origr.currentTarget
		// Check if it's actually in the DOM. Using 'body' for IE:
		// https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect
		// and http://stackoverflow.com/questions/5629684/how-to-check-if-element-exists-in-the-visible-dom csuwldcat
		var elemInDOM 	= document.body.contains( currentTarget );
		// If stuff is visible, make it look good
		var visibility 	= origr.node.style.visibility;

		// If the DOM has mutated getting rid of the element, we don't
		// want to do this.
		if ( elemInDOM && visibility !== "hidden" && !deactivated ) {
			var positionStyle = utils.getPositionStyle( currentTarget );

			// --- CORRECT PARENT ---
			// Absolutely positioned elements have this final ancestor
			var targetParent = currentTarget.offsetParent;
			if ( positionStyle !== 'absolute' ) {
				// Other position styles have their direct parent as their final ancestor
				targetParent = currentTarget.parentNode;
			}

			// --- LABELS --- \\
			// Get the current element and all ancestors up to and including the determined parent
			var elems = utils.getElemsFromUntil( currentTarget, targetParent );
			labelElems( elems, positionStyle );

			// --- ORIGINATOR --- \\
			origr.placeOriginator( currentTarget, positionStyle, targetParent );
		} else {

			// Get rid of everything other than the disable button
			origr.hide();

		}  // end if should show and/or place elements

	};  // End origr.makeMagic()




	// ===============================================================
	// =================
	// INITIALIZATION
	// =================

	// =================
	// ORIGINATOR
	// =================
	var buildContainerDiv = function () {
	/*

	Container is always 0.5px high, will be rotated for placement
	*/

		var container 		= document.createElement('div');
		container.className = 'originator';

		var attributesStr 	= 'position: absolute; left: 0; top: 0; ' +
			'visibility: hidden; z-index: 200; ' +
			'height: 1.5px; min-width: 0.5px; ' +
			// Always rotate from top left corner
			'-webkit-transform-origin: top left; -moz-transform-origin: top left;' +
            '-o-transform-origin: top left; transform-origin: top left;';

		container.setAttribute( 'style', attributesStr );

		return container;
	};  // End buildContainerDiv()


	var buildSVG 	= function ( NS ) {
	/* ( str ) -> DOM */

		var svg 		= document.createElementNS( NS,'svg' );
		var attributes 	= {
			'version': '1.1', 'width': '100%', 'height': '100%',
			'style': 'overflow: visible;'
		};

		utils.setAttributes( svg, attributes );

		return svg;
	};  // End buildSVG()


	var buildLine 	= function ( NS, strokeColor, strokeWidth ) {
	/* ( str, str, num ) -> DOM

	Build one originator line. Goes straigh across horizontally.
	Will be rotated
	*/
		var line 		= document.createElementNS( NS,'line' );
		var attributes 	= {
			// 'x1': '0', 'y1': '0', 'x2': '100%', 'y2': '100%',
			'x1': '0', 'y1': '0', 'x2': '100%', 'y2': '0',
			'stroke': strokeColor, 'stroke-width': strokeWidth
		};

		// To pulse a color first
		line.style.transition = 'stroke .4s ease;';

		utils.setAttributes( line, attributes);
		// line.setAttribute( 'stroke-linecap', 'butt' );

		return line;
	}  // End buildLine()


	var buildCircle = function ( NS, position, outline ) {
	/* ( str, str ) -> DOM

	Build originator circles
	*/
		// Sizes
		var radius = 4, strokeWidth = 1.5;

		var circle 			= document.createElementNS( NS, 'circle' );

		var attributes 		= {
			// They should be at the same height? Everything starts out horizontal
			'cx': position, 'cy': 0, 'r': radius,
			'fill': baseColor, 'stroke': outline, 'stroke-width': strokeWidth
		};

		utils.setAttributes( circle, attributes );

		return circle;
	};  // End buildCircle()


	var createNew 	= function () {
	/*

	Creates the originator DOM element, its node
	http://www.i-programmer.info/programming/graphics-and-imaging/3254-svg-javascript-and-the-dom.html
	TODO: Make this look better by having the lines "go into" the circles
		That would involve animation, I think
	*/

		// --- CONTAINERS --- \\
		var container 	= buildContainerDiv();
		document.body.appendChild( container );

		// Needed for all svg stuff for some reason
		var NS 			= 'http://www.w3.org/2000/svg';

		var svg 		= buildSVG( NS );
		container.appendChild( svg );

		// --- LINES --- \\
		// Line widths
		var inner = 2, outer = 4;

		var outline 		= buildLine( NS, outlineColor, outer );
		var innerLine 		= buildLine( NS, baseColor, inner );
		innerLine.className = 'inner-line';

		svg.appendChild( outline );
		svg.appendChild( innerLine );

		// --- CIRCLES --- \\
		// Circle thicknesses
		var radius = 4, strokeWidth = 1.5;

		var parentCircle 	= buildCircle( NS, '0', outlineColor );
		var childCircle 	= buildCircle( NS, '100%', baseColor );

		svg.appendChild( parentCircle );
		svg.appendChild( childCircle );
		
		//  --- SET OBJECT PROPERTIES --- \\
		origr.node 			= container;
		origr.circleChild 	= childCircle;
		origr.circleParent 	= parentCircle;

		return container;
	};  // End createNew()

	createNew();


	// ============================================
	// =================
	// EVENTS
	// =================
	document.addEventListener( 'click', function (event) {
		// Basically just gets and sets targets and sets visibility
		// Everything else is called in update()

		origr.currentTarget = event.target;

		// Don't try to track originator parts or labels, but do allow
		// clicking so elements can be inspected
		var exclude = origr.shouldExclude( origr.currentTarget );

		// At least change the oldTarget (down at the bottom)
		if ( !exclude ) {

			// "hidden" will prevent movement as well
			// Note: This MUST not happen in update()
			var visibility = origr.getNewVisibility( origr.currentTarget, origr.oldTarget );
			origr.node.style.visibility = visibility;

			// Prepare for next click on non-originator element
			origr.oldTarget = origr.currentTarget;
		}  // end if !excluded

	});  // end document on click


	// ========================================================
	// ===================
	// TRIGGER ORIGINATOR ACTIONS
	// ===================
	// --- IN CASE OF CHANGES TO DOM OR VIEW --- \\
	origr.update = function () {
		// Loop forever and ever?
		if ( !origr.loopPaused ) {
		// Deactivated state is taken care of in makeMagic
			origr.makeMagic( origr.currentTarget, origr.deactivated );
			window.requestAnimationFrame( origr.update );
		}
	};  // End update()

	origr.update();


	// --- MOVE WHEN CHANGE DETECTED? ---
	// // This would be instead of update()
	// var observer = new MutationObserver(function () {
	// 	console.log('mutation');
	// 	origr.makeMagic( origr.oldTarget );
	// });  // end observer
	// observer.observe(document, { childList: true, attributes: true });


	return origr;
};  // End Originator {}


// ============
// START
// ============
var originator3000 = new Originator();

