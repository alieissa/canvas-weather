//TODO: More than one framelet_found or no framelet found should throw an erro


/*-------------------------------------------------------
| Returns the hourly highest temp forecast for each day
| with the min_temp replaced by min temp of day.
--------------------------------------------------------*/

function processWeekForecast (raw_forecast) {	
	var minima = [];
	var maxima = [];

	var findMinMax = function(day_forecast, index, array) {
		var day_max = day_forecast.reduce(function(prev, curr, index, array) {
			return prev.temp_max > curr.temp_max && curr.day_num === prev.day_num? prev : curr;
		});

		var day_min = day_forecast.reduce(function(prev, curr, index, array){
			return prev.temp_min < curr.temp_min ? prev : curr;
		});

		maxima.push(day_max);
		minima.push(day_min);
	};
	
	raw_forecast.forEach(findMinMax);

	maxima.forEach(function(hour_forecast, index, array) {
		hour_forecast.temp_min = minima[index].temp_min;
	});

	return maxima;
}


/*-------------------------------------------------------
| Given x and y position of a mouse click finds which
| framelet was clicked and returns its day
--------------------------------------------------------*/

function findSelectedDay(x, y, framelets) {

	var found_framelet = framelets.filter(function(framelet){
		return framelet.x < x && framelet.x + framelet.width > x ;
	});

	if(found_framelet.length !== 1) {
		console.log("More than one framelet found for coords x and y");
		//Should throw error later
	}
	return found_framelet[0].day_num;
}


/*-------------------------------------------------------
| Checks if point is within the rectangle (area)
--------------------------------------------------------*/

function isWithin(point, area) {
	return area.x < point.x && area.x + area.width > point.x && area.y < point.y && area.y + area.height > point.y;
}	


var util = {};
util.isWithin = isWithin;
util.findSelectedDay = findSelectedDay;
util.processWeekForecast = processWeekForecast;

module.exports = util;