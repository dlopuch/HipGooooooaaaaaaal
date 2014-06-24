var requestify = require('requestify'),
    HipChat = require('node-hipchat'),
    bot = require('./bot');

var chatroom = new HipChat(process.env.HC_KEY),
    user = process.env.HC_FROM || 'The Vuvuzela',
    room = parseInt(process.env.HC_ROOM, 10);

var announce = function(text) {
  console.log('Sent to hipchat: ' + text);

  chatroom.postMessage({
    room: room,
    from: user,
    message: text,
    notify: 1,
    color: 'yellow',
    message_format: 'text'
  }, function(data) {
    if (error) {
      console.log('  HIPCHAT API Response: ' + JSON.stringify(data));
    }
  });
};

bot(requestify, announce, 5000, 60000);

console.log('Starting up HipChat client for room ' + room + ' as ' + user);
