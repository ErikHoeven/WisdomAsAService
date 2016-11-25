/**
 * Created by erik on 11/19/16.
 */



'use strict';

exports = module.exports = function(app, mongoose) {
    var scrapeResults = new mongoose.Schema({
        scrapeName: { type: String},
        resultName: { type: String},
        resultDescriptions: { type: []},
        creationDate: { type: Date},
        search: [String]
    });
    scrapeResults.plugin(require('./plugins/pagedFind'));
    scrapeResults.index({ scrapeName: 1 });
    scrapeResults.index({ resultName: 1 });
    scrapeResults.index({ resultDescriptions: 1 });
    scrapeResults.index({ creationDate: 1 });
    scrapeResults.index({ search: 1 });
    scrapeResults.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('scrapeResults', scrapeResults)};