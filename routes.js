'use strict';

exports = module.exports = function(app, passport) {
    //front end
    app.get('/', require('./views/index').init);
    app.get('/about/', require('./views/about/index').init);
    app.get('/contact/', require('./views/contact/index').init);
    app.post('/contact/', require('./views/contact/index').sendMessage);

    //event routes
    app.get('/events/', require('./views/events/index').find);
    app.get('/events/show/:id/', require('./views/events/index').read);
    app.get('/events/add', require('./views/events/index').add);
    app.post('/events/', require('./views/events/index').create);

    //upload
    app.get('/upload/', require('./views/upload/index').init);
    app.post('/upload/', require('./views/upload/index').fileupload);
    app.post('/upload/readFile', require('./views/upload/index').readFile);
    app.post('/upload/tranlateWords', require('./views/upload/index').tranlateWords);
    app.post('/upload/saveTranlateWords', require('./views/upload/index').saveTranlateWords);

    //Sentiment
    app.post('/BusinessRules/sentiment', require('./views/BusinessRules/sentiment').saveBijvoegelijkeNaamwoorden);
    app.post('/BusinessRules/updSentiment', require('./views/BusinessRules/sentiment').updSentiment);
    app.post('/BusinessRules/BuildSentimentModel', require('./views/BusinessRules/buildSentimentModel').BuildSentimentModel);
    app.post('/BusinessRules/updateTrainingSet', require('./views/BusinessRules/buildSentimentModel').updateTrainingSet);
    app.post('/BusinessRules/deleteRowTrainingsSet', require('./views/BusinessRules/buildSentimentModel').deleteRowTrainingsSet);
    app.post('/BusinessRules/model', require('./views/BusinessRules/buildSentimentModel').model);


    //BusinessRules routes
    app.get('/BusinessRules/', require('./views/BusinessRules/index').find);
    app.post('/BusinessRules/findApiData', require('./views/BusinessRules/index').findApiData);
    app.get('/BusinessRules/add', require('./views/BusinessRules/index').add);
    app.get('/BusinessRules/show/:id/', require('./views/BusinessRules/index').read);
    app.post('/BusinessRules/', require('./views/BusinessRules/index').create);
    app.get('/BusinessRules/updateCattValues',require('./views/BusinessRules/index').updateCattValues);
    app.post('/BusinessRules/upload', require('./views/BusinessRules/uploadFile').uploadFile);
    app.post('/BusinessRules/updateGeneric', require('./views/BusinessRules/buildSentimentModel').updateGeneric);
    app.post('/BusinessRules/showBusinessRules', require('./views/BusinessRules/buildSentimentModel').showBusinessRules);
    app.post('/BusinessRules/buildGenericTable', require('./views/BusinessRules/buildGenericTable').createGenericTable);
    app.post('/BusinessRules/getBusinessRuleListFilterList', require('./views/BusinessRules/buildGenericTable').getBusinessRuleListFilterList);
    app.post('/BusinessRules/getBusinessRuleFilter', require('./views/BusinessRules/buildGenericTable').getBusinessRuleFilter);

    //Dashboard routes
    app.get('/Dashboard/', require('./views/Dashboard/index').find);
    app.post('/Dashboard/findTweetPerNode',require('./views/Dashboard/graphActions').findTweetPerNode);
    app.post('/Dashboard/filterNodesOnAantalTweets',require('./views/Dashboard/graphActions').filterNodesOnAantalTweets);
    //app.get('/Dashboard/setTweetsperCattegory', require('./views/Dashboard/index').setTweetsperCattegory);


    //sign up
    app.get('/signup/', require('./views/signup/index').init);
    app.post('/signup/upload', require('./views/signup/index').fileupload);

   //login
    app.get('/login/', require('./views/login/index').init);
    app.post('/login/post', passport.authenticate('local'
        , {
            successRedirect:'/'
          , failureRedirect:'/login/'
          , failureFlash: true

    }),
        function(req, res) {
            res.redirect('/')})


    //route not found
    app.all('*', require('./views/http/index').http404);
};
