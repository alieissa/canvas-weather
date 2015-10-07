// TODO: Use returned timestamp to find day of the week. Remember that the timestamp is in seconds
// and javascript takes the timestamps in milliseconds so *1000.
// new Date(timestamp*1000).getDay(). This way one is not limited to local weather

// Proving more difficult than expected

//TODO: Remove isLastDay from Forecast_Model prototype. It should be added to utils
//TODO: Maybe it's time to turn to underscore.js or lodash.js
//TODO: Move Data retrieval and processing to server
// //TODO: Change how user exceptions are thrown

'use strict'

var util = require('./util.js');
var API_KEY = require('./config.js').API_KEY;


function Forecast_Model() {
	this.week_forecast;	
	this.current_forecast;

	this.forecast_max;
	this.forecast_min;

	this.tz_offset;

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
	
	
	var handleTzResponse = function(evt) {
		console.log('time zone response');

		try{
			var tz_res = JSON.parse(this.responseText);	
			self.tz_offset = tz_res.gmtOffset*1000;
			var local_day_time = util.getLocalDayTime(self.tz_offset);

			
		}
		catch(exc) {
			console.log('Something is wrong');
		}
		
		self.current_forecast = util.processCurrentForecast(self.current_forecast, local_day_time);
		console.log(self.current_forecast);

		var forecast_req = new XMLHttpRequest();
		forecast_req.open('GET', forecast_url, true);
		forecast_req.addEventListener('load', handleForecast);
		forecast_req.send();

		//self.current_forecast = util.processCurrentForecast(current_forecast);
	}

	var handleForecast = function() {
		try {
			var raw_forecast = JSON.parse(this.responseText).list;
		}
		catch(exception) {
			// this.controller.reportError()
			console.log(exception);
		}
		
		console.log(raw_forecast);
		
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

			self.current_forecast = JSON.parse(this.responseText);
			console.log(self.current_forecast);
			var lat = self.current_forecast.coord.lat;
			var lng = self.current_forecast.coord.lon;

			var tz_url = 'http://api.timezonedb.com/?lat=' + lat + '&lng=' + lng +'&format=json&key=3K51HXQHY2WC';

			//var current_forecast = JSON.parse(this.responseText);
		}
		catch(exception) {
			//controller.reportError("Can't Parse Open Weather Response");
			console.log('can not parse current weather response');
		}

		var tz_req = new XMLHttpRequest();
		tz_req.open('GET', tz_url, true);
		tz_req.addEventListener('load', handleTzResponse);
		tz_req.addEventListener('error', function(evt){
			console.log('No response from tz database');
		});
		tz_req.send();

		// var forecast_req = new XMLHttpRequest();
		// forecast_req.open('GET', forecast_url, true);
		// forecast_req.addEventListener('load', handleForecast);
		// forecast_req.send();

		// self.current_forecast = util.processCurrentForecast(current_forecast);

	}

	var weather_req = new XMLHttpRequest();
	weather_req.open("GET", weather_url, true);
	weather_req.addEventListener('load', handleWeather);
	weather_req.addEventListener('error', function(evt){
		console.log('Weather call error');
	});
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


// Forecast_Model.prototype.setWeekForecast = function(forecast) {
// 	this.week_forecast = forecast;
// }


Forecast_Model.prototype.isLastDay = function(day_num) {
	var processed_week_forecast = this.week_forecast.slice(0);
	var last_day_forecast = processed_week_forecast[processed_week_forecast.length - 1];

	return last_day_forecast[0].day_num === day_num;
}


module.exports = Forecast_Model;
