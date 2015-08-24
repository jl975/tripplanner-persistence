var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');


router.get('/:id/:things', function(req, res) {
	res.send('hi');

})

router.get('/:id', function(req, res) {
	res.send('sdgfsddsfds');

})

router.use('/api/days', function(req, res) {
	res.send('sdgds');
})

router.post('/:id/:things', function(req, res) {
	var thing = req.params.things;
	if (thing == 'hotel') {

	}
	else if (thing == 'restaurants') {

	}
	else if (thing == 'activities') {

	}
})

router.delete('/:id/:things', function(req, res) {
	var thing = req.params.things;
	if (thing == 'hotel') {

	}
	else if (thing == 'restaurants') {

	}
	else if (thing == 'activities') {

	}
})




module.exports = router;