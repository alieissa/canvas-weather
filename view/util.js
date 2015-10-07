
/*----------------------------------------------------------
| Starting from point (x,y) paints an area of width 'width' 
| and height 'height' white. Note white is the color 
| of the canvas.
-------------------------------------------------------------*/

function clean(x, y, width, height, ctx) {

	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.fillRect(x , y , width, height);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}


/*------------------------------------------------
| Returns an array of temperatures scaled by the
| difference between forecast max and min
---------------------------------------------------*/

function scaleTemps (temps, max, min) {
	
	if(!Array.isArray(temps)) {
		return;
	}
		
	var scaled_temps = temps.map(function(temp, index, array) {
		if(max === min) {
			return 1;
		}
		else {
			return (temp - min) / (max - min);
		}
	});

	return scaled_temps;
}


/*------------------------------------------------
| Given a time in 24 hour format returns the time
| in a 12 hour format
---------------------------------------------------*/

function getHour (hour) {

	switch(hour) {
		case 0:
			return '12 AM';
		case 12:
			return '12 PM';
		default:
			var evening_hour = (hour % 12); 
			return hour > 12 ? evening_hour + ' PM' : hour + ' AM';
	}

}

var util = {};
util.clean = clean;
util.getHour = getHour;
util.scaleTemps = scaleTemps;

module.exports = util;
