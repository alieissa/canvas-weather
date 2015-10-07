
var View = require('./view/View.js');
var Model = require('./model/Model.js');
var Controller = require('./controller/Controller.js');

var weather_canvas;
function Weather_Widget(canvas, city) {
	this.city = city;
	
	this.view = new View(canvas);
	this.model = new Model(city);
	this.controller = new Controller();

	this.controller.setView(this.view);
	this.controller.setModel(this.model);
	
	weather_canvas = canvas;
}


Weather_Widget.prototype.run = function() {
	this.view.init(this.city);
	this.model.init(this.city);
	this.controller.init();

};

/*----------------------------------------------------------------------
| This function can be moved to a script tag outside of app.js.
-------------------------------------------------------------------------*/
function run_app() {
	try {
		var weather_canvas = document.getElementById('canvas');
	}
	catch(exc) {
		throw 'No Canvas Found';
	}

	var weather_widget = new Weather_Widget(weather_canvas, 'Ottawa');
	weather_widget.run();

}

window.onload = run_app;