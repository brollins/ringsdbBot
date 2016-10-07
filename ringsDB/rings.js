var rp = require('request-promise');
var decode = require('unidecode');
var builder = require('botbuilder');


function getCards(callback) {
    var options = {
        uri: 'http://www.ringsdb.com/api/public/cards',
        json: true
    };

    rp(options)
        .then(function (collection) {
            callback(collection);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function getMatches (session, input, callback) {
    getCards(function (collection) {
        var results = [];
        for (var card of collection) {
            if (decode(card.name.toLowerCase()).includes(input.toLowerCase())) {
                results.push(new builder.ThumbnailCard(session)
                    .images([
                        builder.CardImage.create(session, `http://ringsdb.com/bundles/cards/${card.code}.png`)
                    ]));
            }
        }
        return callback(results);
    });
}

module.exports = {
    getMatches: getMatches
};
