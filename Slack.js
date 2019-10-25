const request = require('request');
const $ = require('jquery-deferred');
const _ = require('lodash');
const emojis = require('./utils');

function Slack(channel) {
  this.channel = channel;
}

Slack.prototype.postMessage = function(query, soResults) {
  const def = $.Deferred();
  const _that = this;
  const base_options = {
    body: {},
    json: true,
    url: process.env.SLACK_URL
  };
  const arrResults = _.map(soResults.items, function(resu) {
    return {
      value: resu.link,
      title: resu.title,
      short: true
    };
  });
  const options = _.extend(base_options, {
    body: {
      channel: _that.channel,
      icon_emoji: _.sample(emojis),
      attachments: [
        {
          fallback:
            'Required text summary of the attachment that is shown by clients that understand attachments but choose not to show them.',
          color: '#e74c3c',
          fields: arrResults
        }
      ]
    }
  });

  request.post(options, function(error, response, body) {
    if (error) {
      def.reject({ status: 500, data: { error: error.message } });
    } else if (response.statusCode == 200) {
      def.resolve(body);
    } else {
      def.reject(body);
    }
  });
  return def.promise();
};

module.exports = Slack;
