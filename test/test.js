var assert = require('chai').assert,
    _ = require('lodash'),
    bot = require('./../bot'),
    MockRequestify = require('./MockRequestify');

var mockResponse = {
  c_HomeTeam_en: 'Homers',
  c_AwayTeam_en: 'Awayians',
  n_HomeGoals: 0,
  n_AwayGoals: 0,
  b_Live: false
};

describe('Events', function() {
  var testBot, announceStr;

  it('should broadcast start of game', function(done) {
    var controls = {};
    var onDoneServingRequest = function(count) {
      if (count === 5) {
        console.log('done!');
        controls.deactivate = true;
        done();
      } else {
        console.log('req ' + count);
      }
    };
    testBot = bot(
      MockRequestify([
        mockResponse,
        _.extend({}, mockResponse, {b_Live: true}),
        _.extend({}, mockResponse, {b_Live: true,  n_HomeGoals: 1}),
        _.extend({}, mockResponse, {b_Live: true,  n_HomeGoals: 1, n_AwayGoals: 1}),
        _.extend({}, mockResponse, {b_Live: true,  n_HomeGoals: 2, n_AwayGoals: 1}),
        _.extend({}, mockResponse, {b_Live: false, n_HomeGoals: 2, n_AwayGoals: 1}),
      ], onDoneServingRequest),
      function(text) { console.log(text); },
      30, 30,
      controls
    );
  });
});
