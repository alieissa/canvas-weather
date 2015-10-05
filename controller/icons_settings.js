var main_icon_settings = {
	cloudy: {
		offset_x: 2,
		offset_y: 14,
		icon_size: 14
	},
	sunny: {
		offset_x: 22.5 + 9.5,
		offset_y: 22.5 + 9.5,
		icon_size: 22.5,
	},
	partly_cloudy: {
		offset_x: 2,
		offset_y: 7.5,
		icon_size: 15
	},
	rainy: {
		offset_x: 7,
		offset_y: 5,
		icon_size: 15,
		droplet_size: 15/ 1.3
	},
	misty: {
		offset_x: 7,
		offset_y: 5,
		icon_size: 15,
		droplet_size: 15/ 1.3
	}
};

var small_icon_settings = {
	cloudy: {
		offset_x: 12.5,
		offset_y: 35,
		icon_size: 10
	},
	partly_cloudy: {
		offset_x: 15,
		offset_y: 35,
		icon_size: 10
	},
	rainy: {
		offset_x: 18.5,
		offset_y: 30,
		icon_size: 10,
		droplet_size: 15/ 1.3
	},
	sunny: {
		offset_x: 35,
		offset_y: 45,
		icon_size: 15
	},
	misty: {
		offset_x: 20,
		offset_y: 15,
		icon_size: 10
	}
};

var time_display_settings  = {
	'Monday' : {
		offset_x: 65
	},
	'Tuesday': {
		offset_x: 70
	},
	'Wednesday': {
		offset_x: 90
	},
	'Thursday' : {
		offset_x: 75
	},
	'Friday' : {
		offset_x: 57
	},
	'Saturday' : {
		offset_x: 75
	},
	'Sunday' : {
		offset_x: 65
	}
};

module.exports = {
	main_icon_settings: main_icon_settings,
	small_icon_settings : small_icon_settings,
	time_display_settings: time_display_settings
};