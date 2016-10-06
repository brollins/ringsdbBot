var rp = require('request-promise');
var decode = require('unidecode');


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

function getMatches (input, callback) {
    getCards(function (collection) {
        var results = [];
        for (var card of collection) {
            if (decode(card.name.toLowerCase()) == input.toLowerCase()) {
                results.push(`http://www.ringsdb.com/bundles/cards/${card.code}.png`);
            }
        }
        return callback(results);
    });
}



module.exports = {
    getMatches: getMatches,
};
