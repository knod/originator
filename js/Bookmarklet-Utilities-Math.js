// Math-Utilities.js

'use strict';

window.BookmarkletsUtilsMath = {}

BookmarkletsUtilsMath.distanceBetween = function ( point1, point2 ) {
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

};  // End BookmarkletsUtilsMath.distanceBetween()


BookmarkletsUtilsMath.degreesFromHorizontal = function ( point1, point2 ) {
/* ( {}, {} ) -> num

Returns number of degrees between a horizontal line to the right
and the line made by the two given points.
*/
	var deltaY = point2.y - point1.y,
		deltaX = point2.x - point1.x;

	var angleInDegrees = Math.atan2( deltaY, deltaX ) * 180 / Math.PI;

	return angleInDegrees;
};  // End BookmarkletsUtilsMath.degreesFromHorizontal()
