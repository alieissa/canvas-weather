
var ICON_WIDTH = 75;
var ICON_HEIGHT = 50;
var FRAMELET_NUM = 6;
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 465;
var DATE_BANNER_HEIGHT = 20;
var MAIN_BANNER_HEIGHT = 80;
var FRAMELET_ICON_SIZE = 10;
var MAX_TEMP_COLOUR = '#878787';
var MIN_TEMP_COLOUR = '#BABABA';

var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
var DAYS_F = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var util = require('./util.js');

var ctx;
var canvas;

/*------------------------------------------------------------
| Displays an abbreviated week day on the bottom framelet
--------------------------------------------------------------*/

function displayFrameletDay(day, framelet) {

	ctx.save();
	ctx.beginPath();
	ctx.font = '13px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	ctx.fillStyle = MIN_TEMP_COLOUR;
	ctx.fillText(DAYS[day], framelet.x + framelet.width /2, framelet.y + 7);
	ctx.closePath();
	ctx.restore();
}


/*------------------------------------------------------------
| Displays the max and min temperatures for a given weekday
| on the the user supplied framelets
--------------------------------------------------------------*/

function displayFrameletTemps(temps, framelet) {

	var temp_x = framelet.x + 20;
	var temp_y = framelet.y + 0.7*framelet.height;
	
	ctx.save();
	ctx.beginPath();
	ctx.textBaseline = 'top';
	ctx.font = "13px Arial";
	ctx.textAlign = "center";

	//max temp
	ctx.fillStyle = MAX_TEMP_COLOUR;
	ctx.fillText(Math.round(temps.temp_max), temp_x, temp_y);

	//min temp
	ctx.fillStyle = MIN_TEMP_COLOUR;
	ctx.fillText(Math.round(temps.temp_min), temp_x + 23, temp_y);
	ctx.closePath();

	//Degrees
	ctx.beginPath();
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = MAX_TEMP_COLOUR;
	ctx.arc(temp_x +10 , temp_y + 2, 2, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle = MIN_TEMP_COLOUR;
	ctx.arc(temp_x + 33 , temp_y + 2, 2, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();

	ctx.restore();
}


/*-------------------------------------------------------------
| Displays a weather icons on a user supplied framelet. The
| icon settings ensure that all icons are placed properly 
| the framelet. See settings in icon_settings.js
---------------------------------------------------------------*/

function displayFrameletIcon(icon, icon_settings, framelet) { 

	var stroke_size = 3;
	var icon_size= icon_settings.icon_size;
	var icon_x = framelet.x + icon_settings.offset_x;
	var icon_y = framelet.y + icon_settings.offset_y;

	icon.draw(icon_x, icon_y, icon_size, stroke_size, ctx);
}


/*--------------------------------------------------------------
| Takes a frame and creates 6 framlets that are same height
|  and 1/6 width .It is used to create bottom frame framelets
--------------------------------------------------------------*/

function createFramelets(canvas, frame) {

	var framelet_height = frame.height;
	var framelet_width = frame.width / FRAMELET_NUM;

	var day_num = new Date().getDay();

	
	var framelets = [];
	for (var index = 0; index <= FRAMELET_NUM; index++) {		
		var framelet = {};
		framelet.y = frame.y;
		framelet.x = framelet_width * index + frame.x;

		framelet.width = framelet_width;
		framelet.height = framelet_height;
		
		framelet.icon_size = FRAMELET_ICON_SIZE;
		framelet.day_num = (day_num + index) % 7;

		framelets.push(framelet);
	}
	
	return framelets;
	
}


var bottom = {};
bottom.y = 375;
bottom.x = 0.15*CANVAS_WIDTH;

bottom.height = 100;
bottom.width = 0.7*CANVAS_WIDTH;
bottom.framelets = createFramelets(canvas, bottom);
bottom.displayFrameletDay = displayFrameletDay.bind(bottom);
bottom.displayFrameletTemps = displayFrameletTemps.bind(bottom);
bottom.displayFrameletIcon = displayFrameletIcon.bind(bottom);


/*------------------------------------------------------------
| Displays the city on the main frame. Function is only ever
| called one; at the beginning controller init
--------------------------------------------------------------*/

function displayMainCity(city) {

	var city_y = 20;
	var city_x = this.x;

	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = MAX_TEMP_COLOUR;
	ctx.textBaseline = 'top';
	ctx.font = "24px Arial";
	ctx.fillText(city, city_x, city_y);
	ctx.closePath();
	ctx.restore();
}


/*------------------------------------------------------------
| Dipslays the weather condition, e.g. cloudy on the main
| frame.
--------------------------------------------------------------*/

function displayMainCondition(condition) {

	var cond_y = 70;
	var cond_x = this.x;
	
	// Capitalize. Get rid of this
	var cond = condition.charAt(0).toUpperCase() + condition.slice(1);

	// TODO: Get rid of this
	if(cond === 'Partly_cloudy') {
		cond = 'Partly Cloudy';
	}

	util.clean(cond_x, cond_y - 3, CANVAS_WIDTH /2, 20, ctx);

	ctx.save();
	ctx.beginPath();
	ctx.textAlign = "left";
	ctx.textBaseline = 'top';
	ctx.font = "16px Arial";
	ctx.fillStyle = MAX_TEMP_COLOUR;
	ctx.fillText(cond, cond_x, cond_y);
	ctx.closePath();
	ctx.restore();
}


/*------------------------------------------------------------
| Displays non-abreviated weekday on the main frame
--------------------------------------------------------------*/

function displayMainDay(day_num) {

	var day_y = 50;
	var day_x = this.x;

	var hour = new Date().getHours();
	
	util.clean(day_x, day_y - 3, CANVAS_WIDTH /2, DATE_BANNER_HEIGHT, ctx);

	ctx.save();
	ctx.beginPath();
	ctx.textBaseline = 'top';
	ctx.textAlign = "left";
	ctx.font = "16px Arial";
	ctx.fillStyle = MAX_TEMP_COLOUR;
	ctx.fillText(DAYS_F[day_num], day_x, day_y);
	ctx.closePath();
	ctx.restore();
}


/*------------------------------------------------------------
| Displays humidity, pressure and wind strength on main frame
--------------------------------------------------------------*/

function displayMainInfo(humidity, pressure, wind) {

	util.clean(this.x + this.width /2, this.y, this.width /2, this.height, ctx);

	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = MAX_TEMP_COLOUR;
	ctx.textBaseline = "top";
	ctx.font = "16px Arial";
	ctx.textAlign = "left";
	ctx.fillText("Humidity: " + humidity + "%", this.x + this.width /1.5, this.y + 5);
	ctx.closePath();
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = MAX_TEMP_COLOUR;
	ctx.textBaseline = "top";
	ctx.font = "16px Arial";
	ctx.textAlign = "left";
	ctx.fillText("Pressure: " + pressure, this.x + this.width /1.5, this.y + 22);
	ctx.closePath();
	ctx.restore();
}


/*------------------------------------------------------------
| Displays temperature on the main frame. In addition to 
| magnitude it displays the unit (degreee celsius) 
--------------------------------------------------------------*/

function displayMainTemp(temp) {
	var offset_x;
	
	if(temp < 0) {
		offset_x = 170;
	}
	else if (temp >= 10) {
		offset_x = 150;
	}
	else {
		offset_x = 120; 
	}

	util.clean(this.x + 74, this.y, this.width, this.height, ctx);


	// Temp
	ctx.save();
	ctx.beginPath();
	ctx.font = "64px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillStyle = "black";
	ctx.fillText(Math.round(temp), this.x + 74, this.y);
	ctx.closePath();
	
	// Degrees
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.arc(this.x + offset_x, this.y + 6, 2, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();

	// Celsius
	ctx.beginPath();
	ctx.font = "16px Arial";
	ctx.fillStyle = "black";
	ctx.fillText('C', this.x + offset_x + 6, this.y + 3);
	ctx.stroke();
	ctx.closePath();
	
	//Return state;
	ctx.restore();
}


/*------------------------------------------------------------
| Displays the time in 12hr format on the main frame
--------------------------------------------------------------*/

function displayMainTime(time, day_num, display_settings) {

	var time_y = 50;
	var time_x = this.x + display_settings[DAYS_F[day_num]].offset_x;

	var hour = util.getHour(time);

	util.clean(time_x, time_y, CANVAS_WIDTH /2, DATE_BANNER_HEIGHT, ctx);
	
	ctx.save();
	ctx.beginPath();
	ctx.textBaseline = 'top';
	ctx.textAlign = "left";
	ctx.font = "16px Arial";
	ctx.fillStyle = MAX_TEMP_COLOUR;
	ctx.fillText(hour, time_x, time_y);
	ctx.closePath();
	ctx.restore();
}


/*------------------------------------------------------------
| Displays weather icons on main frame. The icon settings
| ensure that all icons are placed properly 
--------------------------------------------------------------*/

function displayMainWeatherIcon(icon, icon_settings) {

	var icon_size = icon_settings.icon_size; 
	var icon_x = this.x + icon_settings.offset_x;
	var icon_y = this.y + icon_settings.offset_y;
	var strokeSize = 5;

	util.clean(this.x, this.y, ICON_WIDTH, this.height, ctx);
	icon.draw(icon_x, icon_y, icon_size, strokeSize, ctx);
}

var main = {};
main.y = 110; 
main.x = 0.15*CANVAS_WIDTH; 

main.icon_size = 13;
main.width = 0.7*CANVAS_WIDTH;
main.height = MAIN_BANNER_HEIGHT;

main.displayDay = displayMainDay.bind(main);
main.displayCity = displayMainCity.bind(main);
main.displayInfo = displayMainInfo.bind(main);
main.displayTime = displayMainTime.bind(main);
main.displayTemp = displayMainTemp.bind(main);
main.displayCondition = displayMainCondition.bind(main);
main.displayWeatherIcon = displayMainWeatherIcon.bind(main);


module.exports = function(canvas) {
	
	canvas = canvas;
	ctx = canvas.getContext('2d');
	return {main: main, bottom: bottom};
};
