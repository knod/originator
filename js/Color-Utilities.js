// originator-utilities.js

'use strict'

var ColorUtils = {};

colorUtils.rgbStrToNums = function ( rgb ) {
/* ( str ) -> {}

// http://stackoverflow.com/questions/13070054/convert-rgb-strings-to-hex-in-javascript
*/
	var colorNumStr = rgb.split("(")[1].split(")")[0],
		colorNums 	= colorNumStr.split(","),
		red 		= parseFloat( colorNums[0] ),
		green 		= parseFloat( colorNums[1] ),
		blue 		= parseFloat( colorNums[2] );

	return {r: red, g: green, b: blue};
};  // End colorUtils.rgbStrToNums


colorUtils.hslNumsToStr = function ( hsls ) {
/* ( {} ) -> Str

Converts strings to "hsl(num, num%, num%)"
*/
	return 'hsl(' + hsls.h + ', ' + hsls.s + '%, ' + hsls.l + '%)';
};  //  End colorUtils.hslNumsToStr()


colorUtils.rgbNumsToHslNums = function ( rgbs ) {
/* ( {} ) -> {}
http://stackoverflow.com/questions/4793729/rgb-to-hsl-and-back-calculation-problems
*/
    var red = rgbs.r / 255, green = rgbs.g / 255, blue = rgbs.b / 255;

    var _Min 	= Math.min(Math.min(red, green), blue),
    	_Max 	= Math.max(Math.max(red, green), blue),
    	_Delta 	= _Max - _Min;

    var light 	= ( (_Max + _Min) / 2 ),
    	light 	= 100 * light;

    var satur 	= 0,
    	hue 	= 0;

	if (_Delta != 0) {
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
};  // end colorUtils.rgbNumsToHslNums()
