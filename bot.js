var Match = require("./Match");

var activeMatches = {};

// Load configuration.
var language = process.env.LANGUAGE || 'en';

var startExpression;
var stopExpression;
if (language == 'es') {
  startExpression = 'Comienza';
  startExpression = 'Finaliza %1';
} else if (language == 'pt') {
  startExpression = 'Começa';
  stopExpression = 'Termina %1';
} else {
  startExpression = 'Starting Match: ';
  stopExpression = 'Match %1 is done! ';
}

/**
 * Module DI Wrapper (can inject test harnesses)
 * @param {requestify} Requestify or mock
 * @param {function(string)} announce function that broadcasts text to HipChat (or wherever)
 * @param {Number} POLLING_MS How long in ms to wait before polling fifa api again
 * @param {Number} SLEEP_MS How long in ms to wait before polling fifa api when no active matches
 * @param {Object} controls has attribute 'deactivate' which is true when polling should stop
 * @returns {Object} activeMatches index of active Matches
 */
module.exports = function(requestify, announce, POLLING_MS, SLEEP_MS, controls) {

  /**
   * Sends a "Match Starting" message to HipChat.
   */
  var announceMatchStart = function(match) {
    var vs = match.homeTeam + ' vs ' + match.awayTeam,
        stadium = match.data.c_Stadium + ', ' + match.data.c_City,
        text = startExpression + ' ' + vs + ' (' + stadium + ')';

    announce(text);
  };

  /**
   * Sends a "Match Complete" message to HipChat, and stops tracking the match.
   */
  var announceMatchComplete = function (m) {
    var vs = m.homeTeam + ' vs ' + m.awayTeam,
        stadium = m.data.c_Stadium + ', ' + m.data.c_City;

    var winner, winnerGoals, loserGoals;
    if (m.homeGoals > m.awayGoals) {
      winner = m.homeTeam;
      winnerGoals = m.homeGoals;
      loserGoals = m.awayGoals;
    } else if (m.awayGoals > m.homeGoals) {
      winner = m.awayTeam;
      winnerGoals = m.awayGoals;
      loserGoals = m.homeGoals;
    }

    announce(stopExpression.replace('%1', vs) + ' ' +
             (winner ? winner.toUpperCase() + ' WINS ' + winnerGoals + ' to ' + loserGoals : "It's a TIE!"));

    delete(activeMatches[match.data.n_MatchID]);
  };

  /**
   * Sends a gooooooooaaaaaaaaal notification
   */
  var announceGoal = function(match, which, other) {
    announce('@here GOOOOOOOOAAAAAAAAAL! ' + match[which + 'Team'] + ' scores!!!! ' +
             match[which + 'Goals'] + ' to ' + match[other + 'Goals']);
  };


  function pollForMatchUpdates(){

    // Get Match list
    requestify.get('http://live.mobileapp.fifa.com/api/wc/matches')
    .then(function(response) {
      if (response.getCode() !== 200) {
        console.log('------- ' + (new Date()).toString() + ' -------');
        console.log('WARNING! FIFA API sent response: ' + response.getCode());
        console.log('Body: ' + response.getBody());
        console.log('Trying again...');
        return setTimeout(pollForMatchUpdates, POLLING_MS);
      }

      // .group is how the API sends the first tournament phase group matches
      //var matches = response.getBody().data.group;

      // .second is how the API sends the second tournament phase knockout matches
      var matches = response.getBody().data.second;

      matches = matches.filter(function(item) {
        return item.b_Live === true || activeMatches[item.n_MatchID];
      });

      if (!matches.length) {
        console.log((new Date()).toString() + ': No active matches, sleeping');
        return setTimeout(pollForMatchUpdates, SLEEP_MS);
      }

      for (var i = 0; i < matches.length; i += 1) {
        if (activeMatches[matches[i].n_MatchID]) {
          match = activeMatches[matches[i].n_MatchID];
        } else {
          match = new Match(language);
          match.on('startMatch', announceMatchStart);
          match.on('endMatch', announceMatchComplete);
          match.on('goal', announceGoal);
          activeMatches[matches[i].n_MatchID] = match;
        }

        match.update(matches[i]);
      }

      if (!controls || !controls.deactivate) {
        setTimeout(pollForMatchUpdates, POLLING_MS);
      }
    });
  };
  pollForMatchUpdates();

  return activeMatches;

}; // end DI wrapper