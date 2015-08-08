# slackoverflow

A simple app written in node.js to search Stack Overflow with a Slack slash command

![](http://jffileshares.s3.amazonaws.com/Screen-Recording-2015-08-08-00-53-24-pmlqUOpmK3.gif)

Example slash command for search:

```sh
/stack angular directive scope
```

### Tech

* [Express.js]
* [Slack API]

### Installation

```sh
$ npm install
```

```sh
$ export SLACK_URL=your_Slack_incoming_webhook_url
$ export STACK_EXCHANGE_API_KEY=your_stack_exchange_api_key
$ node server.js
```

