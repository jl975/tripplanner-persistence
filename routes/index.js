var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');



router.get('/api/days/:id/:things', function(req, res) {
  res.send('certain things on certain day');
});

router.get('/api/days/:id', function(req, res) {
  //res.send('all things on certain day');
  var dayNumber = Number(req.params.id);
  // day.save(function(err) {
  //   if (err) return next(err);
  // });

  Day.findOne({number: dayNumber}).populate('hotel restaurants activities')
  .exec()
  .then(function(result, err) {
    if (err) return next(err);
    res.json(result);
  })
});

router.get('/api/days', function(req, res) {
  Day.find().exec().then(function(result, err) {
    if (err) return next(err);
    res.json(result);
  })
});

router.post('/api/days/:id/:thing', function(req, res) {
  var thing = req.params.thing;
  var dayId = req.params.id;
  console.log('dayId found: '+dayId);
  Day.findOne({_id: dayId}).exec().then(function(result, err) {
    if (!result) {
      res.status(404);
      res.send('day '+dayId+' not found');
    }
    else {
      if (thing == 'hotel') {
        result.hotels = req.body.hotelId;
        result.save();
        result.populate('hotels');
      }
      else if (thing == 'restaurant') {
        result.restaurants.push(req.body.restaurantId);
        result.save();
        result.populate('restaurants').exec();
      }
      else if (thing == 'activity') {
        result.activities.push(req.body.activityId);
        result.save();
        result.populate('activities');
      }

    }


  })

})

router.post('/api/days/:id', function(req, res) {
  var dayNumber = Number(req.params.id);
  var day = new Day({number: dayNumber});
  Day.find({number: dayNumber}).exec().then(function(result, err) {
    if (result.length) {
      res.status(404);
      res.send('day '+dayNumber+' already exists');
      //next(new Error('day already exists'));
    }
    else {
      console.log('day '+dayNumber+' added');
      day.save();
      res.send('day '+dayNumber+' added');
    }
  });
})

// for on page load
router.post('/api/days', function(req, res) {
  Day.find().exec().then(function(result, err) {
    if (err) return next(err);
    res.json(result);
  })
})



router.delete('/api/days/:id', function(req, res) {
  var dayNumber = Number(req.params.id);
  Day.findOne({number: dayNumber}).exec().then(function(result, err) {
    if (!result) {
      res.status(404);
      res.send('day '+dayNumber+' not found');
      //next(new Error('day already exists'));
    }
    else {
      console.log('day '+dayNumber+' removed');
      result.remove();


      // shift numbers of all subsequent days
      Day.find().exec().then(function(days, err) {
        days.forEach(function(day) {
          if (day.number > dayNumber) day.number--;
          day.save();
        });
      })

      res.send('day '+dayNumber+' removed');
    }
  });
})


router.delete('/api/days/:id/:things', function(req, res) {
  var thing = req.params.things;
  if (thing == 'hotel') {

  }
  else if (thing == 'restaurants') {

  }
  else if (thing == 'activities') {

  }
})

router.get('/', function(req, res) {

  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find()
    ]).spread(function(hotels, restaurants, activities) {
      res.render('index', {
        all_hotels: hotels,
        all_restaurants: restaurants,
        all_activities: activities
      });
    })
})



module.exports = router;
