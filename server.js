require('dotenv').load();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const inspect = require('eyes').inspector({ maxLength: 12048 });
const Slack = require('./Slack');
const port = process.env.PORT || 8080;
const stackexchange = require('stackexchange');

app.use(express.static(__dirname));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/overflow', function(request, response) {
  const options = { version: 2.2 };
  const context = new stackexchange(options);
  const filter = {
    key: process.env.STACK_EXCHANGE_API_KEY,
    pagesize: 10,
    sort: 'activity',
    order: 'asc',
    q: request.query.text
  };
  const slacker = new Slack(request.query.channel_id);

  context.search.advanced(filter, function(err, results) {
    if (err) throw err;
    slacker.postMessage(request.query.text, results);
  });
});

server.listen(port, () => inspect(port, 'Server started on '));
