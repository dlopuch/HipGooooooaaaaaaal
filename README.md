HipGooooooaaaaaaal
====================================

It's a NodeJS worker that request every 5 seconds data from the FIFA World Cup API and sends gooooooaaaaaaal notifications to a HipChat room

Forked from [sbehrends/Live-WorldCup-Notification-for-Slack](sbehrends/Live-WorldCup-Notification-for-Slack).  Most of the hard work comes from there :)

====================================

+ It notifies when a match starts or ends
+ It notifies when there's a gooooooooaaaaaaaal!

![demo](https://github.com/dlopuch/HipGooooooaaaaaaal/raw/demo.png "Everybody hates the Vuvuzela")


## To run:
```
$ npm install
$ export HC_KEY=myhipchatapikey
$ export HC_ROOM=1234
$ export HC_FROM=BotName
$ export DELAY_MS=30000
$ npm run start
```

Notes:
- `HC_FROM` is optional.  Defaults to 'The Vuvuzela'.  HipChat API may puke if name is too long.
- ESPN broadcast has been delayed by 30-60 sec compared to the FIFA feed.  Kinda sucks to get a notification of a goal
  before you see it happen on the screen.  Use the `DELAY_MS` environment variable to delay notifications by a certain time.

