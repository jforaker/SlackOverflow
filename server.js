require('dotenv').load();
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var inspect = require('eyes').inspector({maxLength: 12048});
var Slack = require('./Slack');
var port = process.env.PORT || 8080;
var stackexchange = require('stackexchange');

app.use(express.static(__dirname));
app.use(bodyParser.json({limit: '50mb'}));

app.get('/overflow', function (request, response) {

    var options = {version: 2.2};
    var context = new stackexchange(options);

    var filter = {
        key: process.env.STACK_EXCHANGE_API_KEY,
        pagesize: 10,
        sort: 'activity',
        order: 'asc',
        q: request.query.text
    };

    var slacker = new Slack(request.query.channel_id);

    context.search.advanced(filter, function (err, results) {
        if (err) throw err;

        slacker.postMessage(request.query.text, results);
    });

});

server.listen(port);
inspect(port, 'Server started on ');