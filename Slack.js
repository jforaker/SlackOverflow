var inspect = require('eyespect').inspector(),
    request = require('request'),
    $ = require('jquery-deferred'),
    _ = require('lodash'),
    emojis = require('./utils')
    ;

function Slack(channel) {
    this.channel = channel;
}

Slack.prototype.postMessage = function (query, soResults) {

    var def = $.Deferred(),
        _that = this,

        base_options = {
            body: {
                attachments: [
                    {
                        fallback: 'Required text summary of the attachment that is shown by clients that understand attachments but choose not to show them.',
                        color: '#e74c3c'
                    }
                ]
            },
            json: true,
            url: process.env.SLACK_URL
        },

        arrResults = _.map(soResults.items, function (resu) {
            return {
                value: resu.link,
                title: resu.title,
                short: true
            };
        }),


        options = _.extend(base_options, {
            body: {
                channel: _that.channel,
                icon_emoji: _.sample(emojis),
                attachments: [
                    {
                        fields: arrResults
                    }
                ]
            }
        }),

        callBack = function (error, response, body) {
            if (error) {
                def.reject({status: 500, data: {error: error.message}});
            } else if (response.statusCode == 200) {
                def.resolve(body);
            } else {
                def.reject(body);
            }
        };

    request.post(options, callBack);
    return def.promise();
};

module.exports = Slack;
