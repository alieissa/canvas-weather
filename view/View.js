//TODO: Fix Misty ICON
//TODO: Throw hour and temps length mismatch error

/*jshint node: true*/
'use strict';

var BACKGROUND_COLOUR = 'white';

var Chart = require('./Chart.js');
var frames = require('./Frames.js');

function Forecast_View(canvas) {

	this.canvas = canvas;
	
	var frame = frames(canvas);
	this.main_frame = frame.main;
	this.bottom_frame = frame.bottom;
	this.chart = new Chart(0.15*canvas.width, 225 + 5, 0.7*canvas.width, 120, canvas);
	
	this.forecast_max = undefined;
	this.forecast_min = undefined;
}

Forecast_View.prototype.init = function(city){

	var ctx = this.canvas.getContext('2d');

	ctx.save();
	ctx.fillStyle = BACKGROUND_COLOUR;
	ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	ctx.fill();
	ctx.restore();

	this.main_frame.displayCity(city);
};

Forecast_View.prototype.displayCondition = function(condition) {
	this.main_frame.displayCondition(condition);
};

Forecast_View.prototype.displayDay = function(day_num) {
	this.main_frame.displayDay(day_num);
};

Forecast_View.prototype.displayTime = function(time, day_num, display_settings) {
	this.main_frame.displayTime(time, day_num, display_settings);
};

Forecast_View.prototype.displayTemp = function(temp) {
	this.main_frame.displayTemp(temp);
};

Forecast_View.prototype.displayInfo = function(humidity, pressure, wind) {
	this.main_frame.displayInfo(humidity, pressure, wind);
};

Forecast_View.prototype.displayWeatherIcon = function(icon, settings) {
	this.main_frame.displayWeatherIcon(icon, settings);
};

Forecast_View.prototype.displayFrameletDay = function(day, framelet) {
	this.bottom_frame.displayFrameletDay(day, framelet);
};

Forecast_View.prototype.displayFrameletIcon = function(icon, icon_settings, framelet) {
	this.bottom_frame.displayFrameletIcon(icon, icon_settings, framelet);
};

Forecast_View.prototype.displayFrameletTemps = function(temps, framelet) {
	this.bottom_frame.displayFrameletTemps(temps, framelet);
};

Forecast_View.prototype.getCanvas = function() {
	return this.canvas;
};

Forecast_View.prototype.getChart = function() {
	return this.chart;
};

Forecast_View.prototype.getMainFrame = function() {
	return this.main_frame;
};

Forecast_View.prototype.getBottomFrame = function() {
	return this.bottom_frame;
};

Forecast_View.prototype.plotDayForecast = function(day_forecast) {

	var hours = [];
	var temps = [];
	var plot_data = {};

	day_forecast.map(function(hour_forecast, index, array) {
		hours.push(hour_forecast.hour);
		temps.push(hour_forecast.temp_max);
	});

	if(hours.length !== temps.length) {
		// Should throw an error here
		console.log(" Error: hours and temperature length must match");
		return;
	}

	this.chart.plot(hours, temps, this.forecast_max, this.forecast_min);
};

Forecast_View.prototype.setForecastMaxMin = function(max_temp, min_temp) {

	this.forecast_max = max_temp;
	this.forecast_min = min_temp;
};

module.exports = Forecast_View;
