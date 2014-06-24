HipGooooooaaaaaaal
====================================

It's a NodeJS worker that request every 5 seconds data from the FIFA World Cup API and sends gooooooaaaaaaal notifications to a HipChat room

Forked from [sbehrends/Live-WorldCup-Notification-for-Slack](sbehrends/Live-WorldCup-Notification-for-Slack).  Most of the hard work comes from there. Just changing it to do hipchat notifications :)

====================================

+ It notifies when a match starts
+ It notifies when the score changes (this means Goal or the match finished)

## Configurations

### Language

The default language is English (en) but you can configure others, like Portuguese(pt) or Spanish(es). To configure simply set an environment variable in heroku named LANGUAGE.

Example:
```
LANGUAGE=pt
```

### Channel

The default channel is #random but you can change that setting a CHANNEL environnment variable.

Example:
```
CHANNEL=general
```
### Icon Image

You can change the default bot icon/avatar by setting a ICON_URL environment variable.

Example:
```
ICON_URL=http://worldcupzones.com/wp-content/uploads/2014/05/the-2014-fifa-world-cup-in46.jpg
```

### Bot Name

You can change the default bot name by setting a BOTNAME environment variable.

Example:
```
BOTNAME=SportsBot5000
```
