/**
 * Helper functions
 */

/**
 * converts degree to Rad
 * @param {Number} deg 
 * @returns 
 */
function degToRad(deg){ 
	return deg / (180/Math.PI); 
}

/**
 *  converts rad to degree
 * @param {Number} rad 
 * @returns 
 */
function radToDeg(rad){ 
	return rad * (180/Math.PI); 
}

/**
 * 
 * @param {Number} number 
 * @param {Number} min 
 * @param {Number} max 
 * @returns 
 */
function clamp(number, min, max){
	// https://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
	return Math.min(Math.max(number, min), max); // this is the fastest way according to above
}