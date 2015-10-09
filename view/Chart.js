var PLOT_HEIGHT = 80;

var v_util = require('./util.js');


/*------------------------------------------------------------------
| Scales the temperatures by ( chart_width / (maxtemp - mintemp) )
| and plotted on the chart. 
---------------------------------------------------------------------*/

function plotTemperatures(temps, forecast_max, forecast_min) {
	
	var self = this;

	var ctx = self.ctx;
	var offset = self.width /7;
	var label_offset = (self.width - 10) /7;
	

	var point;
	var label_x;
	var label_y; 
	
	var scaled_temps = v_util.scaleTemps(temps, forecast_max, forecast_min);
	
	var plotScaledTemp = function(scaled_temp, index, array) {

		point = {};
		point.index = index;
		point.width = self.width /7;
		point.height = self.height /2;
		
		// map temperature to location on plot area
		point.x = self.x + index*offset;
		point.y = (self.y + 10) + self.plot_area.height *(1 - scaled_temp) ;
		
		//self tucks the temperatures lables a bit inside.
		label_y = point.y - 20;
		label_x = self.x + index*label_offset;

		point.bounds_y = self.y - 10;
		point.bounds_x = point.x - point.width /2;
	
		//Draw Circle 
		ctx.lineTo(point.x, point.y);
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.arc(point.x, point.y, 5, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.restore();

		// Write Temp
		ctx.save();
		ctx.beginPath();
		ctx.fillText(temps[index], label_x, label_y);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		self.temp_points.push(point);
	};
	
	scaled_temps.forEach(plotScaledTemp);
}


/*------------------------------------------------------------------
| Set the plot hours as the x-axis data points.
---------------------------------------------------------------------*/

function plotHours(hours) {

	var self = this;

	var ctx = self.ctx;
	var offset = (self.width - 25) /7;

	var new_hours = hours.map(function(hour, index, array) {
		return v_util.getHour(hour);
	});
	
	
	ctx.save();
	ctx.font = "12px Arial";
	ctx.fillStyle = "#BABABA";
	ctx.textBaseline = 'top';
	new_hours.forEach(function(hour, index, array) {
		ctx.beginPath();
		ctx.fillText(hour, self.x_axis.x + index*offset, self.x_axis.y);
		ctx.closePath();
	});
	ctx.restore();
}


function Chart(x, y, width, height, canvas) {	

	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.temp_points = [];

	this.plot_area = {};
	this.plot_area.x = x;
	this.plot_area.y = y;
	this.plot_area.width = width;
	this.plot_area.height = PLOT_HEIGHT;

	this.x_axis = {};
	this.x_axis.x = x;
	this.x_axis.y = this.plot_area.y + this.plot_area.height + 25;
	this.x_axis.width = width;
	this.x_axis.height = 15;

}


/*------------------------------------------------------------------
| Get the chart frame. Used to see if chart clicked
---------------------------------------------------------------------*/

Chart.prototype.getFrame = function() {

	var frame = {};
	frame.x = this.x;
	frame.y = this.y;

	frame.width = this.width;
	frame.height = this.height;
	
	return frame;
};

/*------------------------------------------------------------------
| Get the (x, y) coordinates of the plotted temp points. Used
| to see if a temp point clicked
---------------------------------------------------------------------*/

Chart.prototype.getTempCoords = function() {
	return this.temp_points;
};


/*------------------------------------------------------------------
| Plot the (hours, temperatures) on the chart
---------------------------------------------------------------------*/

Chart.prototype.plot = function(hours, temperatures, forecast_max, forecast_min) {

	//var offset = this.width /7;

	//Clear the old points
	this.temp_points = [];

	v_util.clean(this.x - 10, this.y - 40, this.width + 20, 160, this.ctx);
	
	plotHours.call(this, hours);
	plotTemperatures.call(this, temperatures, forecast_max, forecast_min);
};

module.exports = Chart;