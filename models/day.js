var mongoose = require('mongoose');

var HotelSchema = require('./hotel').schema;
var RestaurantSchema = require('./restaurant').schema;
var ActivitySchema = require('./activity').schema;

var DaySchema = new mongoose.Schema({
	number: {type: Number},
	hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
	restaurants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
	activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]
});

module.exports = mongoose.model('Day', DaySchema);