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
    app.post('/upload/Excel', require('./views/upload/readExceltoJSON').readExceltoJSON);

    //Sentiment
    app.post('/BusinessRules/sentiment', require('./views/BusinessRules/sentiment').saveBijvoegelijkeNaamwoorden);
    app.post('/BusinessRules/updSentiment', require('./views/BusinessRules/sentiment').updSentiment);
    app.post('/BusinessRules/BuildSentimentModel', require('./views/BusinessRules/buildSentimentModel').BuildSentimentModel);
    app.post('/BusinessRules/updateTrainingSet', require('./views/BusinessRules/buildSentimentModel').updateTrainingSet);
    app.post('/BusinessRules/deleteRowTrainingsSet', require('./views/BusinessRules/buildSentimentModel').deleteRowTrainingsSet);
    app.post('/BusinessRules/model', require('./views/BusinessRules/buildSentimentModel').model);


    //BusinessRules
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
    app.post('/BusinessRules/getSearchResultArray', require('./views/BusinessRules/getSearchResultArray').getSearchResultArray);

    //Peronal dashboard
    app.get('/Dashboard/', require('./views/Dashboard/index').init);
    app.get('/Dashboard/getTweets', require('./views/Dashboard/index').getTweets);


    //Dashboard socialGraph routes
    //app.get('/Dashboard/socialGraph', require('./views/Dashboard/socialGraph/index').find);
    //app.post('/Dashboard/socialGraph/findTweetPerNode',require('./views/DashboardsocialGraph/graphActions').findTweetPerNode);
    //app.post('/Dashboard/socialGraph/filterNodesOnAantalTweets',require('./views/Dashboard/socialGraph/graphActions').filterNodesOnAantalTweets);
    //app.get('/Dashboard/setTweetsperCattegory', require('./views/Dashboard/index').setTweetsperCattegory);


    //sign up
    app.get('/signup/', require('./views/signup/index').init);
    app.post('/signup/upload', require('./views/signup/index').fileupload);

   //login
    app.get('/login/',
        function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('./login/index', { message: req.flash('loginMessage') })
        }
    )

    //logout
    app.get('/logout/',
        function(req, res) {
            // destroy user
            req.logout();
            req.flash('success_msg', 'You are logged out');
            //redirect to homepage
            res.redirect('/');
        }
    )

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
