var restify = require('restify');
var builder = require('botbuilder');
var rings = require('./ringsDB/rings');


var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
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

intents.matches(/^carousel/i, [
    function(session) {
        session.beginDialog('/carousel');
    },
]);

bot.dialog('/search', [
    function(session) {
        builder.Prompts.text(session, "Speak Card and Enter...");
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

bot.dialog('/carousel', function (session) {
    var cards = rings.getCardsAttachments();

    // create reply with Carousel AttachmentLayout
    var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

    session.send(reply);
    session.endDialog();
});

