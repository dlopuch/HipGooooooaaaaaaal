var requestify = require('requestify'),
    bot = require('./bot');

var announce = function(text) {
  console.log(text);
};

bot(requestify, announce, 5000, 60000);
