var requestify = require('requestify'),
    HipChat = require('node-hipchat'),
    bot = require('./bot');

var chatroom = new HipChat(process.env.HC_KEY);

var announce = function(text) {
  console.log(text);

  chatroom.postMessage({
    room: process.env.HC_ROOM,
    from: process.env.HC_FROM || 'Vuvuzela',
    message: text,
    notify: 1,
    color: 'yellow',
    message_format: 'text'
  });
};

bot(requestify, announce, 5000, 60000);
