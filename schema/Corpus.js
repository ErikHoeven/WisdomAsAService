/**
 * Created by erik on 11/19/16.
 */



'use strict';

exports = module.exports = function(app, mongoose) {
    var corpus = new mongoose.Schema({
        volledigWerkwoord: { type: String},
        werkwoordInVerledentijd: { type: String},
        voltooiddeelwoord: { type: String},
        typeWerkwoord: { type: String},
        zelfstandignaamwoord: { type: String},
        search: [String]
    });
    corpus.plugin(require('./plugins/pagedFind'));
    corpus.index({ volledigWerkwoord: 1 });
    corpus.index({ werkwoordInVerledentijd: 1 });
    corpus.index({ voltooiddeelwoord: 1 });
    corpus.index({ typeWerkwoord: 1 });
    corpus.index({ zelfstandignaamwoord: 1 });
    corpus.index({ search: 1 });
    corpus.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('corpus', corpus)};



