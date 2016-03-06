/**
 * Created by root on 14-2-16.
 */

'use strict';

exports = module.exports = function(app, mongoose) {
    var rulesSchema = new mongoose.Schema({
        lookupValue: { type: String, required:true},
        typeBusinessRule: { type: String},
        tagCattegory: { type: String},
        tagScore:     { type: Number},
        creationDate: { type: Date},
        search: [String]
    });
    rulesSchema.plugin(require('./plugins/pagedFind'));
    rulesSchema.index({ lookupValue: 1 });
    rulesSchema.index({ tagCattegory: 1 });
    rulesSchema.index({ typeBusinessRule: 1 });
    rulesSchema.index({ tagScore: 1 });
    rulesSchema.index({ creationDate: 1 });
    rulesSchema.index({ search: 1 });
    rulesSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('BusinessRules', rulesSchema);
};