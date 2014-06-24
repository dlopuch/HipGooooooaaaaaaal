var requestify = require("requestify"),
    Match = require("./Match");

var activeMatches = {};

// Load configuration.
var DEFAULT_ICON_URL = 'http://worldcupzones.com/wp-content/uploads/2014/05/the-2014-fifa-world-cup-in46.jpg';
var botName = process.env.BOTNAME || 'WorldCupBot';
var iconUrl = (process.env.ICON_URL || DEFAULT_ICON_URL);
var channelName = '#' + (process.env.CHANNEL || 'random');
var language = process.env.LANGUAGE || 'en';
var startExpression;
var stopExpression;
if (language == 'es') {
  startExpression = 'Comienza';
  startExpression = 'Finaliza';
} else if (language == 'pt') {
  startExpression = 'Começa';
  stopExpression = 'Termina';
} else {
  startExpression = 'Starts';
  stopExpression = 'Ends';
}

/**
 * Wraps text in a slack-formatted link.
 */
var slackLink = function (text, url) {
  return '<' + url + '|' + text + '>';
};

/**
 * Sends a message to slack.
 */
var announce = function (text) {
  console.log(text);
};

/**
 * Sends a "Match Starting" message to slack.
 */
var announceMatchStart = function (match) {
  var vs = match.homeTeam + ' vs ' + match.awayTeam;
  var stadium = match.data.c_Stadium + ', ' + match.data.c_City;
  var text = startExpression + ' ' + slackLink(vs, match.url) + ' (' + stadium + ')';
  announce(text);
};

/**
 * Sends a "Match Complete" message to slack, and stops tracking the match.
 */
var announceMatchComplete = function (match) {
  var vs = match.homeTeam + ' vs ' + match.awayTeam;
  var stadium = match.data.c_Stadium + ', ' + match.data.c_City;
  var text = stopExpression + ' ' + slackLink(vs, match.url) + ' (' + stadium + ')';
  announce(text);
  delete(activeMatches[match.data.n_MatchID]);
};

/**
 * Sends a score summary message to slack.
 */
var announceScore = function (match) {
  announce(match.homeTeam + ' (' + match.score + ') ' + match.awayTeam);
};


function pollForMatchUpdates(){

  // Get Match list
  requestify.get('http://live.mobileapp.fifa.com/api/wc/matches')
  .then(function(response) {
    if (response.getCode() !== 200) {
      console.log('------- ' + (new Date()).toString() + ' ----------');
      console.log('WARNING! FIFA API sent response: ' + response.getCode());
      console.log('Body: ' + response.getBody());
      console.log('Trying again...');
      return setTimeout(pollForMatchUpdates, 5000);
    }

    var matches = response.getBody().data.group;

    matches = matches.filter(function(item) {
      return item.b_Live === true || activeMatches[item.n_MatchID];
    });

    for (var i = 0; i < matches.length; i += 1) {
      if (activeMatches[matches[i].n_MatchID]) {
        match = activeMatches[matches[i].n_MatchID];
      } else {
        match = new Match(language);
        match.on('startMatch', announceMatchStart);
        match.on('endMatch', announceMatchComplete);
        match.on('goal', announceScore);
        activeMatches[matches[i].n_MatchID] = match;
      }
    }

    match.update(results[i]);

    setTimeout(pollForMatchUpdates, 5000);

  });
};
pollForMatchUpdates();
