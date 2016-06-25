'use strict';

exports = module.exports = function(app, mongoose) {
    var googlesearch = new mongoose.Schema({
        searchValue:   { type: String},
        resultValue:   { type: []},
        relatedTweets: { type: []},
        creationDate: { type: Date},
        search: [String]
    });
    googlesearch.plugin(require('./plugins/pagedFind'));
    googlesearch.index({ searchValue: 1 });
    googlesearch.index({ resultValue: 1 });
    googlesearch.index({ relatedTweets: 1 });
    googlesearch.index({ creationDate: 1 });
    googlesearch.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('googlesearch', googlesearch);
};