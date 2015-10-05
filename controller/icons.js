//TODO: Fix Mist Icon

var SUN_COLOUR = '#FFE168';
var RAIN_COLOUR = '#8FD6E7';
var CLOUD_COLOUR = '#D9D9D9';
var MIST_COLOUR = 'black';

// Can bring the cloud function outside.
function drawCloud(x, y, radius, stroke_size, ctx) {
	var b_radius = 2*radius /3;
	
	//Foreground cloud with 3 bulbs
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = CLOUD_COLOUR;
	ctx.strokeStyle = 'white';
	ctx.lineWidth = stroke_size;
	ctx.arc((x + b_radius), y + (radius + b_radius), b_radius, Math.PI /2, 3*Math.PI /2);
	ctx.arc(x + (b_radius + radius), y + (radius + b_radius - radius /2), radius, Math.PI, 2*Math.PI);
	ctx.arc(x + (b_radius + radius + radius), y + (radius + b_radius), b_radius, 3*Math.PI /2, Math.PI /2);
	ctx.lineTo(x + b_radius, y + radius + 2*b_radius);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

var icons = {};

icons.cloudy = {
	draw: function(x, y, radius, stroke_size, ctx) {
		var offsetY = (radius)*Math.sin(Math.PI/6);
		var offsetX = (radius)*Math.cos(Math.PI/6);
		
		var b_radius = 2*radius /3;
		
		//Background cloud
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "#D9D9D9";
		ctx.strokeStyle = "white";
		ctx.lineWidth = stroke_size;
		ctx.arc((x + b_radius + radius) + offsetX, y + (radius + b_radius - radius/2) - offsetY, radius, 1.0*Math.PI, 2*Math.PI);
		ctx.arc((x + b_radius + radius) + offsetX + radius , y + (radius + b_radius - radius/2) - offsetY - 2  + 2*radius /3, 2*radius /3, 3*Math.PI /2, Math.PI /2);
		ctx.stroke(); 
		ctx.fill();
		ctx.closePath();
		ctx.restore();

		//Foreground Cloud
		drawCloud(x, y, radius, stroke_size, ctx);
	}
};

icons.misty = {
	draw: function(x, y, radius, stroke_size, ctx) {
		var mist_x = x ;
		var mist_len = 3.35*radius;
		var offset_y = 2.75*radius;
		
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = MIST_COLOUR;
		ctx.lineWidth = stroke_size;
		ctx.moveTo(mist_x , y + offset_y);
		ctx.lineTo(mist_x + mist_len, y + offset_y);
		ctx.stroke();
		ctx.moveTo(mist_x, y + offset_y + stroke_size );
		ctx.lineTo(mist_x + mist_len, y + offset_y + stroke_size );
		ctx.stroke();
		ctx.moveTo(mist_x, y + offset_y + 2*stroke_size );
		ctx.lineTo(mist_x + mist_len, y + offset_y + 2*stroke_size );
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
};

icons.partly_cloudy = {
	draw: function(x, y, radius, stroke_size, ctx) {
		var sun_y = y + radius;
		var sun_x = x + 2 /3*radius + 2*radius;
		
		//Background Sun
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = SUN_COLOUR;
		ctx.arc(sun_x, sun_y, radius + 3, 5*Math.PI /4, Math.PI /4);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
		
		//Foreground Cloud
		drawCloud(x, y, radius, stroke_size, ctx);
	}
	
};


icons.rainy = {
	draw: function(x, y, radius, stroke_size, ctx) {

		//bulb radius
		var b_radius = (2/3)*radius;
		
		//droplet_gap: gap between rain drops.
		var droplet_size = 2*radius /3;	
		var droplet_gap = (4*radius /3 + 2*radius) /3;  
		
		// PI/4 is angle to which rain drops are slanted
		var dx = Math.cos(Math.PI/4); 
		var dy = Math.sin(Math.PI/4);
		
		// rain_y is exactly at the bottom of the cloud
		var rain_x = x;
		var rain_y = y + (radius + b_radius + radius /2 + radius /2); 
		
		// Rain drops
		ctx.save();
		ctx.strokeStyle = RAIN_COLOUR;
		for(var i = 0; i <= 2; i++) {
			ctx.beginPath();
			ctx.lineWidth = stroke_size;

			ctx.moveTo(rain_x + (i*droplet_gap + droplet_size*dx), rain_y);
			ctx.lineTo(rain_x + (i*droplet_gap), rain_y + droplet_size*dy);

			ctx.stroke();
			ctx.closePath();
		}
		ctx.restore();

		// Cloud
		drawCloud(x, y, radius, stroke_size, ctx);

	}
};

icons.sunny = {
	draw: function(x, y, radius, stroke_size, ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = SUN_COLOUR;
		ctx.arc(x, y, radius, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
};


module.exports = icons;