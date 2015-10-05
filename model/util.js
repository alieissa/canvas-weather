
/**/

function concatenateObjects(obj1, obj2) {
	var result = {};
	
	for (var key in obj1) {
	  result[key] = obj1[key];
	}

	for (var key in obj2) {
	  result[key] = obj2[key];
	}

	return result;
}

/*
*/

function cloneArray (array) {
	try {
		return JSON.parse(JSON.stringify(array));
	}
	catch(exception) {
		throw 'ERROR: Can not clone array';

	}
}
/*
*/

function getIDCondition(id) {
	if (id >= 200 && id < 300){
		return "thunderstorm";
	}

	else if ((id >= 300 && id < 400) || (id >= 500 && id < 600)){
		return "rainy";
	}

	else if (id > 801 && id < 900){
		return "cloudy";
	}

	else if (id === 800){
		return "sunny";
	}

	else if (id === 801){
		return "partly_cloudy";
	}

	else if (id >= 701 && id <= 781) {
		return "misty";
	}

	throw 'ID' + id + ' is Unknow';
}

/*
*/

function processWeekForecast(raw_forecast) {

	var week_forecast = [];

	var processHourForecast = function(hour_data, index, array) {
		var date_str = hour_data.dt_txt.replace(' ', 'T');
		var date = new Date(date_str);
		var day_num = date.getDay();
		var hour = date.getHours();

		var processed_hour_data = concatenateObjects(hour_data.main, hour_data.weather[0]);
		
		processed_hour_data.hour = hour;
		processed_hour_data.day_num = day_num;
		processed_hour_data.temp_max = Math.round(processed_hour_data.temp_max);
		processed_hour_data.temp_min = Math.round(processed_hour_data.temp_min);
		processed_hour_data.condition = getIDCondition(processed_hour_data.id);
		
		return processed_hour_data;
	}
	  
	// Extract all the dates in yyyy-mmm-ddThhh:mm:ss format;
	var clean_forecast = raw_forecast.map(processHourForecast);

	var days = clean_forecast.map(function(day_forecast, index, array) {
		return day_forecast.day_num;
	});

	// Find all the unique days
	var uniq_days = days.filter(function(day, index, array) {
		return array.indexOf(day) === index;
	});

	
	uniq_days.forEach(function(uniq_day, index, array) {

		// find all the forecast for uniq_day
		var day_forecast = clean_forecast.filter(function(day_forecast, index, array) {
			var day = day_forecast.day_num;
			return day === uniq_day;
		});

		/*--------------------------------
		| Save the day forecast
		----------------------------------*/
		week_forecast.push(day_forecast);
	});
	
	console.log(week_forecast);
	return week_forecast

}

function processCurrentForecast (raw_current_data) {
	var date = new Date();

	var processed_data = concatenateObjects(raw_current_data.main, raw_current_data.weather[0]);
	processed_data.hour = date.getHours();
	processed_data.day_num = date.getDay();
	processed_data.temp = Math.round(processed_data.temp);
	processed_data.temp_max = Math.round(processed_data.temp_max);
	processed_data.temp_min = Math.round(processed_data.temp_min);
	processed_data.condition = getIDCondition(processed_data.id);

	return processed_data;
}

var util = {};
util.cloneArray = cloneArray;
util.concatenateObjects = concatenateObjects;
util.processWeekForecast = processWeekForecast;
util.processCurrentForecast = processCurrentForecast;

module.exports = util;