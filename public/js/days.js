'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [{
        hotels:      [],
        restaurants: [],
        activities:  []
      }],
      currentDay = days[0];

  function addDay () {
    days.push({
      hotels: [],
      restaurants: [],
      activities: []
    });
    renderDayButtons();
    switchDay(days.length - 1);


    $.ajax({
      method: "POST",
      url: "/api/days/"+(days.length),
      data: {

      },
      success: function(data) {
        console.log(data);
        console.log('day '+currentDay+' successfully added');
      },
      error: function() {
        console.log('error adding day '+currentDay);
      }
    })
  }

  function getDays() {
    var numDays;
    $.ajax({
      method: "GET",
      url: "/api/days",
      data: {},
      success: function(data) {
        console.log('new data');
        numDays = data.length;
      },
      error: function() {}
    }).done(function() {
      for (var i=1; i<=numDays; i++) {
        $.ajax({
          method: "GET",
          url: "/api/days/"+i,
          data: {},
          success: function(data) {
            console.log('this data index '+i);
            if (i==1) {
              days = [{
                hotels: data.hotels,
                restaurants: data.restaurants,
                activities: data.activities
              }];
              console.log('days!1!'+days);
            }
            else days.push({
              hotels: data.hotels,
              restaurants: data.restaurants,
              activities: data.activities
            });
          },
          error: function() {
            console.log('error index '+i);
          }
        })
      }
      renderDayButtons();
      switchDay(days.length - 1);
      console.log(days);
    })

  }


  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);

    $.ajax({
      method: "DELETE",
      url: "/api/days/"+(index+1),
      data: {

      },
      success: function(data) {
        console.log(data);
        console.log('day '+currentDay+' successfully removed');
      },
      error: function() {
        console.log('error removing day '+currentDay);
      }
    })

    days.splice(index, 1);
    switchDay(index);


  }



  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  // function getCurrentDayModel(days) {
  //   var dayNum = days.indexOf(currentDay)+1;
  //   var day;
  //   $.ajax({
  //     method: "GET",
  //     url: "/api/days/"+dayNum,
  //     data: {},
  //     success: function(data) {
  //       day = data;
  //     },
  //     error: function() {}
  //   }).done(function() {
  //     return day;
  //   })
  // }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    currentDay[attraction.type].push(attraction);

    var dayNum = days.indexOf(currentDay) + 1;
    $.ajax({
      method: "GET",
      url: "/api/days/"+dayNum,
      data: {},
      success: function(data) {
        return data;
      },
      error: function() {
        console.log('could not add attraction');
      }
    }).done(function(day) {
      console.log(attraction);
      console.log(attraction.type);
      if (attraction.type == 'hotels') {
        $.post('/api/days/' + day._id + '/hotel', {hotelId: attraction._id})
        //.done(function(){renderDay(day)});
      }
      else if (attraction.type == 'restaurants') {
        $.post('/api/days/' + day._id + '/restaurant', {restaurantId: attraction._id})
        //.done(function(){renderDay(day)});
      }
      else if (attraction.type == 'activities') {
        $.post('/api/days/' + day._id + '/activity', {activityId: attraction._id})
        //.done(function(){renderDay(day)});
      }
      renderDay(day);
    });




  };

  exports.removeAttraction = function (attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };


  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;

    console.log('day: ');
    console.log(day);
    // Object.keys(day).forEach(function(type){
    //   var $list = $('#itinerary ul[data-type="' + type + '"]');
    //   $list.empty();
    //   var attractions = ['hotels', 'activities', 'restaurants'];
    //   attractions.forEach(function(t) {
    //     if (day[t]) {
    //       day[t].forEach(function(attraction){
    //         $list.append(itineraryHTML(attraction));
    //         mapModule.drawAttraction(attraction);
    //       });
    //     }
    //   })

    // });
    var types = ['hotels', 'activities', 'restaurants'];
    types.forEach(function(type) {
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      if (day[type] && day[type].length) {
        console.log('day has '+type);
        day[type].forEach(function(attraction) {
          $list.append(itineraryHTML(attraction));
          mapModule.drawAttraction(attraction);
        })
      }
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  function loadPage() {
    // for first time loading only
    console.log(days);

    var daysExist = false;

    $.ajax({
      method: "GET",
      url: "/api/days",
      data: {},
      success: function(data) {
        console.log(data);
        if (data.length) daysExist = true;
        return data;
      },
      error: function() {
        console.log('failed initial get');
      }
    }).done(function(day) {
      if (!daysExist) {
        $.ajax({
          method: "POST",
          url: "/api/days/1",
          data: {},
          success: function(data) {},
          error: function() {}
        });
      }
      else {
        $.post('/api/days', function(data) {
          getDays();
          return day;
        }).done(function(day) {
          console.log('rendering');
          renderDay(day);
        });  
      }
    })


    // if there are no existing days, add the first day
    // else loop through existing days and add all of them




  }


  $(document).ready(function(){
    switchDay(0);
    loadPage();
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
