'use strict'
exports.find = function(req, res, next){
    console.log("find");
    req.query.lookupValue = req.query.lookupValue ? req.query.lookupValue : '';
    req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
    req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
    //req.query.sort = req.query.sort ? req.query.sort : '_id';

    var filters = {};
    if (req.query.lookupValue) {
        filters.lookupValue = new RegExp('^.*?'+ req.query.lookupValue +'.*$', 'i');
    }

    req.app.db.models.BusinessRules.pagedFind({
        filters: filters,
        keys: 'lookupValue  tagCattegory  tagScore  typeBusinessRule',
        limit: req.query.limit,
        page: req.query.page,
        sort: req.query.sort
    }, function(err, results) {
        if (err) {
            return next(err);
        }

        if (req.xhr) {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            results.filters = req.query;
            console.log("Results XHR ");
            res.send(results);
            res.json(results);
        }
        else {
            results.filters = req.query;
            //res.json(results);
            console.log("Results No XHR ");
            //console.log(results);
            res.render('BusinessRules/index', { data: results.data });


        }

    });
};

exports.findApiData =function (req, res, next) {
    console.log("findAPIData");
    var Subjects = db.models.testData;

       Subjects.find({}, {'_id': 0, 'lookupValue': 1, 'tagCattegory': 1, 'tagScore': 1, 'typeBusinessRule': 1}, function(err, subjectDetails) {
            // if there is an error retrieving, send the error.
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(subjectDetails); // return all nerds in JSON format
        });
    };






exports.read = function(req, res, next){
    req.app.db.models.BusinessRules.findById(req.params.id).exec(function(err, BusinessRules) {
        if (err) {
            return next(err);
        }

        if (req.xhr) {
            res.send(BusinessRules);
        }
        else {
            res.render('BusinessRules/details', { BusinessRules: BusinessRules });
        }
    });
};





exports.add = function(req, res){
    res.render('BusinessRules/add');
};

exports.create = function(req, res, next) {
    console.log('START POST: ');
    var workflow = req.app.utility.workflow(req, res);

    workflow.on('validate', function() {
        console.log('START POST(1) IF FORM CHECK: ');
        if (!req.body.lstTypeBusinessRule) {
            workflow.outcome.errors.push('Please enter a TypeBusinessRule.');
            console.log('TypeBusinessRule niet gevuld');
            return workflow.emit('response');
        }
        workflow.emit('createBusinessRule');
    });

    workflow.on('createBusinessRule', function () {
        console.log('STAR POST (3):Worflow On:');
        var fieldsToSet = {
            typeBusinessRule: req.body.lstTypeBusinessRule,
            lookupValue: req.body.txtLookupValue,
            tagCattegory: req.body.txtTagCattegory,
            tagScore: req.body.txtTagScore,
            creationDate: Date()
        };
        console.log(fieldsToSet);

        req.app.db.models.BusinessRules.create(fieldsToSet, function(err, BusinessRule) {
            if (err) {
                return workflow.emit('exception', err);
            }

            workflow.outcome.record = BusinessRule;
           // req.flash('success','BusinessRule Added');
            res.location('/BusinessRules');
            res.redirect('/BusinessRules');
        });
    });
    workflow.emit('validate');
};