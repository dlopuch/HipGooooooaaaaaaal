/**
 * @file
 * Match objects.
 *
 * Match attributes:
 *   homeTeam: {string}
 *   awayTeam: {string}
 *   homeGoals: {Number}
 *   awayGoals: {Number}
 *   live: {boolean}
 *   url: {string} sharing URL, eg http://www.fifa.com/worldcup/matches/round=255931/match=300186456/index.html#nosticky
 *   data: {Object} raw fifa API match data
 *
 * Events Emitted:
 *   'goal' ({Match}, {'home' | 'away'} scorer, {'away' | 'home'} opponent)
 *   'startMatch' ({Match})
 *   'endMatch' ({Match})
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Match constructor.
 *
 * Represents a match in progress.
 *
 * @param String language
 *   The prefered language for team names.
 */
var Match = function (language) {
  EventEmitter.call(this);
  this.language = language || 'en';
  this.initialized = false;
};

util.inherits(Match, EventEmitter);

/**
 * Extracts important data from the match data and updates the match.
 *
 * @param Object matchData
 *   Match object parsed from the FIFA api.
 */
Match.prototype.update = function (matchData) {
  var live = matchData.b_Live;
  this.data = matchData;

  if (!this.initialized) {
    this.homeTeam = this.data['c_HomeTeam_' + this.language];
    this.awayTeam = this.data['c_AwayTeam_' + this.language];
    this.homeGoals = matchData.n_HomeGoals;
    this.awayGoals = matchData.n_AwayGoals;
    this.url = this.data['c_ShareURL_' + this.language];
    this.live = false;
    this.initialized = true;
  }

  if (live != this.live) {
    this[(live ? 'start' : 'end') + 'Match']();
  };

  if (this.homeGoals !== matchData.n_HomeGoals) {
    this.homeGoals = matchData.n_HomeGoals;
    this.emit('goal', this, 'home', 'away');
  }

  if (this.awayGoals !== matchData.n_AwayGoals) {
    this.awayGoals = matchData.n_AwayGoals;
    this.emit('goal', this, 'away', 'home');
  }
};

/**
 * Handles the match starting.
 *
 * Sets live to true and emits the startMatch event.
 */
Match.prototype.startMatch = function () {
  this.live = true;
  this.emit('startMatch', this);
};

/**
 * Handles the match ending.
 *
 * Sets live to false and emits the endMatch event.
 */
Match.prototype.endMatch = function () {
  this.live = false;
  this.emit('endMatch', this);
};

module.exports = Match;
