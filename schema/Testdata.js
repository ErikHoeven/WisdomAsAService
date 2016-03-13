/**
 * Created by root on 14-2-16.
 */

'use strict';

exports = module.exports = function(app, mongoose) {
    var testData = new mongoose.Schema({
        lookupValue: { type: String, required:true},
        typeBusinessRule: { type: String},
        tagCattegory: { type: String},
        tagScore:     { type: Number},
        creationDate: { type: Date},
        search: [String]
    });
    testData.plugin(require('./plugins/pagedFind'));
    testData.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('testData', testData);
};