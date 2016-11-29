/**
 * Created by erik on 11/19/16.
 */



'use strict';

exports = module.exports = function(app, mongoose) {
    var companyResults = new mongoose.Schema({
        companyNumber: { type: Number},
        naam: { type: String},
        adres: { type: String},
        postcode: { type: String},
        plaats: { type: String},
        pageNumber:   { type: Number},
        categorie:   { type: String},
        creationDate: { type: Date},
        search: [String]
    });
    companyResults.plugin(require('./plugins/pagedFind'));
    companyResults.index({ companyNumber: 1 });
    companyResults.index({ adres: 1 });
    companyResults.index({ postcode: 1 });
    companyResults.index({ plaats: 1 });
    companyResults.index({ pageNumber: 1 });
    companyResults.index({ categorie: 1 });
    companyResults.index({ plaats: 1 });
    companyResults.index({ search: 1 });
    companyResults.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('companyResults', companyResults)};
