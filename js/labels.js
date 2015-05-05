/* labels.js */

'use strict';

HandHeldBookmarkletManagerTM.Labels = function ( baseColor, utilsDict ) {

	var labels = {};

	labels.nodeList 		= [];

	labels.baseColor 			= baseColor
	labels.wrongColor		= 'tomato';
	labels.rightColor 		= 'lightgreen';
	labels.shadowPadding 	= 2;


	// =================
	// Utilities
	// =================
	var Utils_DOM 		= utilsDict.dom;//,
		// Utils_Labels 	= utilsDict.labels;


	// =================
	// APP LOGIC
	// =================
	labels.createShadowCutoff = function () {
	/* ( None ) -> DOM

	Creates labele element that will surround the shadowed
	element and cut off the bottom shadow.
	http://stackoverflow.com/questions/1429605/creating-a-css3-box-shadow-on-all-sides-but-one
		second answer "cut it off with overflow"
	*/

		var cutoff 	= document.createElement('div');
		cutoff.className = 'label-shadow-cutoff originator-exclude';

		var pd 		= labels.shadowPadding + 'px ';
		// cutoff.style.padding = 'padding: ' + pd + pd + '0 ' + pd;  // For future
		var style 	= 'position: absolute; z-index: 100; '
			+ 'padding: ' + pd + pd + '0 ' + pd + '; overflow: hidden;'

		cutoff.setAttribute( 'style', style );

		return cutoff;
	};  // End labels.createShadowCutoff()


	labels.createShadowed 	= function ( labelColor, labelString ) {
	/* ( str,  str ) -> DOM

	Create label element that will contain the text, the color,
	and have a shadow.
	*/
		var inner 		= document.createElement('div');
		inner.className = 'label-shadowed-elem';

		// For future
		// inner.style.border 				= 'border: solid ' + labels.baseColor;
		// inner.style['background-color'] = labelColor;

		var style 		= 'border: solid ' + labels.baseColor + ' 1px; padding: 0 0.2rem; '
			+ 'border-radius: 4px 4px 0px 0px; '
			+ 'box-shadow: 0 0 3px .1px rgba(0, 0, 0, .5); '
			+ 'background-color: ' + labelColor;
		
		inner.setAttribute('style', style);

		var labelText 	= document.createTextNode( labelString );
		inner.appendChild( labelText );

		return inner;
	};  // End labels.createShadow()


	labels.createLabel 	= function ( elem, labelColor, labelString ) {
	/*

	Create one label for an element
	*/
		var cutoff 			= labels.createShadowCutoff();
		cutoff.className 	+= ' bookmarklets-labels';
		var shadowed 		= labels.createShadowed( labelColor, labelString );
		cutoff.appendChild( shadowed );

		return cutoff
	};  // End labels.createLabel()


	labels.positionLabel = function ( label, elem ) {
	/* ( DOM, DOM ) -> label DOM

	Lines up the visible part of the label with the element that
	it labels (the outer container makes things tricky)
	*/
		var elemRect 	= Utils_DOM.getOffsetRect( elem );
		var elemLeft 	= elemRect.left,
			elemTop 	= elemRect.top;

		// Account for container's padding (which there for the shadow)
		label.style.left 	= elemLeft - labels.shadowPadding;
		// Get the bottom completely lined up
		var labelHeight 	= label.offsetHeight;
		// For some reason it seems to always end up a little higher. Math.
		label.style.top 	= (elemTop - labelHeight) + 1;

		// If it's now sticking out of the top of the DOM, bring it back in
		// But leave the shadow out. Looks better that way.
		Utils_DOM.fixAboveWindow( label, (-1 * labels.shadowPadding) );

		return label;
	};  // End labels.positionLabel()


	labels.placeLabel = function ( elem, placeInChain, childPosition ) {
	/* ( DOM, str, str ) -> other DOM

	Places a label at the top of an element. All show position style. Parents
	show ancestry and child shows computed left and top values.

	placeInChain can either be "child" or "ancestor #"
	// http://stackoverflow.com/questions/6338217/get-a-css-value-with-javascript
	*/

		// Get this element's position
		var positionStyle 	= Utils_DOM.getPositionStyle( elem );

		// --- COLOR --- \\
		var labelColor 	= labels.rightColor;
		// If it's the original element, its label should be green. If not...
		if ( placeInChain !== 'child' ) {
			// A static ancestor is out of sync and should be red
			if ( (childPosition === 'absolute') && (positionStyle === 'static') ) {
				labelColor = labels.wrongColor;
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
		var label 			= labels.createLabel( elem, labelColor, labelString );
		document.body.appendChild( label );

		// --- FINAL POSITION --- \\
		labels.positionLabel( label, elem );

		return label;
	};  // End labels.placeLabel()


	labels.labelTheseElems = function ( elemList, childPosition ) {
	/* ( [ DOM ] ) -> same

	Places positionStyle labels on all the elements in the list
	*/

		// Backwards through the list so ancestors don't cover children
		for ( var elemi = (elemList.length - 1); elemi >= 0; elemi-- )	{
			var placeInChain = 'ancestor ' + (elemi - 1) ;

			if ( elemi === 0 ) {
				placeInChain = 'child';
			}

			var node = labels.placeLabel(
				elemList[ elemi ], placeInChain, childPosition );

			labels.nodeList.push( node );
		}  // end for elemList

		return elemList;
	};  // end labels.labelTheseElems()


	labels.removeLabels = function () {
		Utils_DOM.removeElements( labels.nodeList );
		// Have to reset list, so we don't try to get rid
		// of elements that are no longer in the DOM
		labels.nodeList = [];
	};  // End labels.removeLabels()


	return labels;
};  // End HandHeldBookmarkletManagerTM.Labels {}

