var restify = require('restify');
var builder = require('botbuilder');
var rings = require('./ringsDB/rings');


var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.bff3ad59-62b6-4e75-9ddb-e9a6525f0e9e,
    appPassword: process.env.VeAX0CDkbpQg9r2cadcdkC2
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^get card/i, [
    function(session) {
        session.beginDialog('/search');
    },
]);

bot.dialog('/search', [
    function(session) {
        builder.Prompts.text(session, "Speak card and enter");
    },
    function (session, results) {
        rings.getMatches(results.response, function (matches) {
            for (var match of matches) {
                session.send(match);
            }
            session.endDialog();
        })
    }
]);

