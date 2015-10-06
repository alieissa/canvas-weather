//TODO: Use returned timestamp to find day of the week. Remember that the timestamp is in seconds
// and javascript takes the timestamps in milliseconds so *1000.
// new Date(timestamp*1000).getDay(). This way one is not limited to local weather

//TODO: Remove isLastDay from Forecast_Model prototype. It should be added to utils
//TODO: Maybe it's time to turn to underscore.js or lodash.js
//TODO: Move Data retrieval and processing to server
//TODO: Change how user exceptions are thrown

'use strict'

var util = require('./util.js');
var API_KEY = require('./config.js').API_KEY;


function Forecast_Model() {
	this.week_forecast;	
	this.current_forecast;

	this.forecast_max;
	this.forecast_min;

	this.forecast_ready = new Event("forecast_ready");
	this.weather_ready = new Event("weather_ready");

}

/*------------------------------------------------------------------
| Executes the AJAX calls to the Open Weather API and reformats
| data into desired format.
---------------------------------------------------------------------*/

Forecast_Model.prototype.init = function(city) {
	var self = this;

	var weather_url =  'http://api.openweathermap.org/data/2.5/weather?units=metric&q=' + city + '&APPID=' + API_KEY;
	var forecast_url = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&q=' + city + '&APPID=' + API_KEY;
	
	var handleForecast = function() {
		try {
			var raw_forecast = JSON.parse(this.responseText).list;
		}
		catch(exception) {
			// this.controller.reportError()
			console.log(exception);
		}
		
		self.week_forecast = util.processWeekForecast(raw_forecast);
		document.dispatchEvent(self.forecast_ready);
	}


	/*---------------------------------------------------------------------------
	| The forecast AJAX call is made within this handlers, so the sequence is
	| get current weather, then get week forecast data. If sequence is broken
	| Then controller will try to access data that is not yet available
	------------------------------------------------------------------------------*/
	
	var handleWeather = function() {

		try {

			var current_forecast = JSON.parse(this.responseText);
		}
		catch(exception) {
			//controller.reportError("Can't Parse Open Weather Response");
			console.log('can not parse current weather response');
		}

		var forecast_req = new XMLHttpRequest();
		forecast_req.open('GET', forecast_url, true);
		forecast_req.addEventListener('load', handleForecast);
		forecast_req.send();

		self.current_forecast = util.processCurrentForecast(current_forecast);

	}

	var weather_req = new XMLHttpRequest();
	weather_req.open("GET", weather_url, true);
	weather_req.addEventListener('load', handleWeather);
	weather_req.send();
}


Forecast_Model.prototype.getDayForecast = function(day_num) {

	var forecast = util.cloneArray(this.getWeekForecast());

	var day_forecast = forecast.filter(function(day_forecast, index, array) {
		return day_forecast[0].day_num === day_num;
	});
	

	if(day_forecast.length !== 1) {
		// Must throw exception here
		console.log('Day Forecast For ' + day_num + ' is ' + day_forecast.length);
	}

	return util.cloneArray(day_forecast[0]);
}



Forecast_Model.prototype.getForecastMin = function() {
	var min = 100;
	var forecast = this.getWeekForecast();
	
	// Maybe it's time to use underscore.js
	forecast.forEach(function(day_forecast, index, array) {
		day_forecast.forEach(function(hour_forecast, index, array) {
			if(hour_forecast.temp_min < min) {
				min = hour_forecast.temp_min;
			}
		});
	});

	return min;
}



Forecast_Model.prototype.getForecastMax = function() {
	var max = -100;
	var forecast = this.getWeekForecast();
	
	// Maybe it's time to use underscore.js
	forecast.forEach(function(day_forecast, index, array) {
		day_forecast.forEach(function(hour_forecast, index, array) {
			if(hour_forecast.temp_max > max) {
				max = hour_forecast.temp_max;
			}
		});
	});

	return max;
}



Forecast_Model.prototype.getWeekForecast = function() {

	var forecast = util.cloneArray(this.week_forecast);

	if(forecast.length < 5) {
		throw 'ERROR: Week Forecast Incomplete';
	}

	/*----------------------------------------------------
	| Check if earliest data is for today. If it is fore
	| today, then add the current forecast to today's
	| data, if it is not for today then add it as
	| current forecast as its own day data.
	------------------------------------------------------*/

	var earliest_forecast = forecast[0][0];
	if(earliest_forecast.day_num !== this.current_forecast.day_num) {
		var container = [];
		container.push(this.current_forecast);
		forecast.unshift(container);
	}
	else {
		forecast[0].unshift(this.current_forecast);
	}

	return forecast;
}


Forecast_Model.prototype.isLastDay = function(day_num) {
	var processed_week_forecast = this.week_forecast.slice(0);
	var last_day_forecast = processed_week_forecast[processed_week_forecast.length - 1];

	return last_day_forecast[0].day_num === day_num;
}


module.exports = Forecast_Model;
