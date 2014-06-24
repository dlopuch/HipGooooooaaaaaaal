module.exports = function(responses, sentResponseCallback) {
  var respI = 0;

  return {
    get: function(url) {
      return {
        then: function(callback) {
          process.nextTick(function() {
            var myResp = respI;
            callback({
              getCode: function() {
                return respI < responses.length ? 200 : 503;
              },
              getBody: function() {
                return {data: {group: [ responses[myResp] ] }};
              }
            });

            sentResponseCallback && sentResponseCallback(myResp);
            respI++;
          });
        }
      };
    }
  };
};
