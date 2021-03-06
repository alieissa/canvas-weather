/*jshint node: true*/

'use strict';
var FRAMELETS_NUM = 6;

var c_util = require('./util.js');
var icons = require('./icons.js');
var main_icon_settings = require('./icons_settings.js').main_icon_settings;
var small_icon_settings = require('./icons_settings.js').small_icon_settings;
var time_display_settings = require('./icons_settings.js').time_display_settings;

/*------------------------------------------------------------------
| Finds which framelet is clicked and the corresponding day.
--------------------------------------------------------------------*/

function getChartData(day_num) {
	/*jshint validthis: true*/

	var self = this;
	
	var day_forecast = self.forecast_model.getDayForecast(day_num);

	var processLastDay = function() {

		// When Sunday get Saturday
		var prev_day_num = day_num === 0 ? 6 : day_num - 1;
		var prev_day_forecast = self.forecast_model.getDayForecast(prev_day_num);
		
		//Adding previous day latest data as current days earliest data
		for (var i = 0; i < missing_hours; i++) {
			day_forecast.unshift(prev_day_forecast.pop());
		}
	};

	var processFirstDay = function() {
		var next_day_num = (day_num + 1) % 7;
		var next_day_forecast = self.forecast_model.getDayForecast(next_day_num);

		//Adding next day earlient data as current days latest
		for (var i = 0; i < missing_hours ; i++) {
			day_forecast.push(next_day_forecast.shift());
		}
	};
	
	if (day_forecast.length < 8) {

		var missing_hours = 8 - day_forecast.length;
		if (self.forecast_model.isLastDay(day_num)) {
			processLastDay();
		}
		else {
			processFirstDay();
		}
	}

	self.day_forecast = day_forecast;

	return day_forecast;
}

/*------------------------------------------------------------------
| Finds and displays the hourly forecast that corresponds to the
| location of the click
--------------------------------------------------------------------*/

function handleChartClick(mouse_pos_x, mouse_pos_y) {
	/*jshint validthis: true*/

	var self = this;

	var temp_points = self.forecast_view.getChart().getTempCoords();

	if (!Array.isArray(temp_points)) {
		console.log("Error: TempCoords returned an expected data");
		return;
	}

	// find clicked point	
	var clicked_hour = temp_points.filter(function(temp_point, index, array) {
		return temp_point.x - temp_point.width /2 < mouse_pos_x && temp_point.x + temp_point.width /2 > mouse_pos_x; 
	});


	if (clicked_hour.length !== 1) {
		console.log("ERROR: Not returning unique point in the chart");
		return;
	}

	//Get the hour forecast information from day forecast
	var hour_index = clicked_hour[0].index;
	var hour_forecast = self.day_forecast[hour_index];
	
	renderMainFrame.call(self, hour_forecast);
}


/*------------------------------------------------------------------
| Finds the clicked day using the location of the click and displays
| the max hourly forecast for that day on the main frame
-------------------------------------------------------------------*/

function handleFrameletClick(mouse_pos_x, mouse_pos_y) {
	/*jshint validthis: true*/

	var self = this;

	var framelets = self.forecast_view.getBottomFrame().framelets;
	var day_num = c_util.findSelectedDay(mouse_pos_x, mouse_pos_y, framelets);
	
	var day_high = self.forecast.filter(function(high, index, array) {
		return high.day_num === day_num; 
	});
	
	renderMainFrame.call(self, day_high[0]);

	var chart_data = getChartData.call(self, day_num);
	self.forecast_view.plotDayForecast(chart_data);
}


/*------------------------------------------------------------------
| Displays the forecast for each day on a framelet
--------------------------------------------------------------------*/

function renderBottomFrame (day_forecast_highs) {
	/*jshint validthis: true*/

	var self = this;
	console.log(day_forecast_highs);
	var framelets = self.forecast_view.getBottomFrame().framelets;
	
	day_forecast_highs.forEach(function(day_high, index, array) {
		
		var framelet = framelets[index];
		var icon = icons[day_high.condition];
		var icon_settings = small_icon_settings[day_high.condition];

		// Fore the rare occastion when forecast extends to a 7th day
		if (FRAMELETS_NUM > index) {
			self.forecast_view.displayFrameletIcon(icon, icon_settings, framelet);
			self.forecast_view.displayFrameletDay(day_high.day_num, framelet);
			self.forecast_view.displayFrameletTemps({temp_min: day_high.temp_min, temp_max: day_high.temp_max}, framelet);
		}
		
	});

}


/*------------------------------------------------------------------
| Displays the forecast on the main frame
--------------------------------------------------------------------*/

function renderMainFrame(now_forecast) {
	/*jshint validthis: true*/

	var self = this;

	var icon = icons[now_forecast.condition];
	var icon_settings = main_icon_settings[now_forecast.condition];

	self.forecast_view.displayDay(now_forecast.day_num);
	self.forecast_view.displayTemp(now_forecast.temp_max);
	self.forecast_view.displayWeatherIcon(icon, icon_settings); 
	self.forecast_view.displayCondition(now_forecast.condition);
	self.forecast_view.displayTime(now_forecast.hour, now_forecast.day_num, time_display_settings);
	self.forecast_view.displayInfo(now_forecast.humidity, now_forecast.pressure);
}



function Forecast_Controller() {

	this.forecast = undefined;
	this.day_forecast = undefined;
	this.forecast_view = undefined;
	this.forecast_model = undefined;

	this.icons = icons;
}


Forecast_Controller.prototype.init = function() {	
	this.setEventListeners();
};


Forecast_Controller.prototype.setView = function(view) {
	this.forecast_view = view;
};


Forecast_Controller.prototype.setModel = function(model) {
	this.forecast_model = model;
};


Forecast_Controller.prototype.setEventListeners = function() {

	var self = this;

	var handleMousedown = function(event) {
		var parent_element = self.forecast_view.getCanvas().getBoundingClientRect();
		
		var mouse_pos = {};
		mouse_pos.x = event.clientX - parent_element.left;	
		mouse_pos.y = event.clientY - parent_element.top; 

		var bottom_frame = self.forecast_view.getBottomFrame();
		if (c_util.isWithin(mouse_pos, bottom_frame)) {

			handleFrameletClick.call(self, mouse_pos.x, mouse_pos.y);
		}

		var chart_frame = self.forecast_view.getChart().getFrame();
		if (c_util.isWithin(mouse_pos, chart_frame)) {
			handleChartClick.call(self, mouse_pos.x, mouse_pos.y);
		}
	};

	var handleMousemove = function(event) {

		var parent_element = event.target.getBoundingClientRect();
		
		var mouse_pos = {};
		mouse_pos.x = event.clientX - parent_element.left;	
		mouse_pos.y = event.clientY - parent_element.top; 
		
		var bottom_frame = self.forecast_view.getBottomFrame();

		var chart_frame = self.forecast_view.getChart().getFrame();
		chart_frame.y -= 20; // Cursor right on the hour

		if (c_util.isWithin(mouse_pos, bottom_frame) || c_util.isWithin(mouse_pos, chart_frame)){
			canvas.style.cursor = 'pointer';
		}
		else {
			canvas.style.cursor = 'default';
		}

	};

	var handleForecast = function(event) {

		var max_temp = self.forecast_model.getForecastMax();
		var min_temp = self.forecast_model.getForecastMin();

		self.forecast_view.setForecastMaxMin(max_temp, min_temp);

		var now_forecast = self.forecast_model.getWeekForecast()[0][0];

		self.forecast_view.getBottomFrame().framelets.forEach(function(framelet, index, array){
			framelet.day_num = (now_forecast.day_num + index) % 7;
		}); 

		var day_forecast_highs = c_util.processWeekForecast(self.forecast_model.getWeekForecast());
		self.forecast = day_forecast_highs;


		renderMainFrame.call(self, now_forecast);
		renderBottomFrame.call(self, day_forecast_highs);

		var day_forecast = getChartData.call(self, now_forecast.day_num);
		self.forecast_view.plotDayForecast(day_forecast);
	};
	
	var canvas = this.forecast_view.getCanvas();
	canvas.addEventListener('mousemove', handleMousemove);
	canvas.addEventListener('mousedown', handleMousedown);
	document.addEventListener('forecast_ready', handleForecast); 

};

module.exports = Forecast_Controller;