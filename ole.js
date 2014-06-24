var requestify = require('requestify'),
    HipChat = require('node-hipchat'),
    bot = require('./bot');

var chatroom = new HipChat(process.env.HC_KEY),
    user = process.env.HC_FROM || 'The Vuvuzela',
    room = parseInt(process.env.HC_ROOM, 10),

    /**
     * ESPN broadcast has been delayed by 30-60 sec compared to the FIFA feed.
     * Kinda sucks to get a notification of a goal before you see it happen on the screen.
     * Use the DELAY_MS environment variable to delay notifications by a certain time.
     */
    delayMs = process.env.DELAY_MS ? parseInt(process.env.DELAY_MS, 10) : 0;

var announce = function(text) {
  console.log('Sent to hipchat (' + delayMs + 'ms delay): ' + text);

  setTimeout(function() {
    chatroom.postMessage({
      room: room,
      from: user,
      message: text,
      notify: 1,
      color: process.env.HC_COLOR || 'yellow',
      message_format: 'text'
    }, function(data) {
      if (data) {
        console.log('  HIPCHAT API Response: ' + JSON.stringify(data));
      }
    });
  },
  delayMs
  );
};

if (delayMs) {
  announce("Greetings!  I'm delaying my announcements by " + Math.round(delayMs / 1000) +
           " seconds to try to get more in sync with the broadcast");
}

bot(requestify, announce, 5000, 60000);

console.log('Starting up HipChat client for room ' + room + ' as ' + user);
