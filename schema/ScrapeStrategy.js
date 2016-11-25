/**
 * Created by erik on 11/19/16.
 */



'use strict';

exports = module.exports = function(app, mongoose) {
    var scrapeStategy = new mongoose.Schema({
        scrapeName: { type: String},
        scrapeSite: { type: String, required:true},
        scrapeSiteParameter: { type: []},
        creationDate: { type: Date},
        search: [String]
    });
    scrapeStategy.plugin(require('./plugins/pagedFind'));
    scrapeStategy.index({ scrapeStrategyName: 1 });
    scrapeStategy.index({ scrapeSite: 1 });
    scrapeStategy.index({ scrapeParameters: 1 });
    scrapeStategy.index({ creationDate: 1 });
    scrapeStategy.index({ cattegoryValue: 1 });
    scrapeStategy.index({ search: 1 });
    scrapeStategy.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('scrapeStategy', scrapeStategy)};