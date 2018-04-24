'use strict';

exports = module.exports = function(app, passport) {
    //front end
    app.get('/', require('./views/index').init);
    app.get('/', require('./views/index').init);
    app.get('/about/', require('./views/about/index').init);
    app.get('/contact/', require('./views/contact/index').init);
    app.get('/Consultancy/', require('./views/Consultancy/index').init);
    app.post('/home/getContentResults/', require('./views/admin/getContentResults').getSectionsContent);

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
    app.post('/BusinessRules/addDevelopers', require('./views/BusinessRules/backlogAssignment').addDeveloperToBusinessRules);

    //Peronal dashboard
    app.get('/Dashboard/', require('./views/Dashboard/index').init);
    app.get('/Dashboard/getTweets', require('./views/Dashboard/index').getTweets);
    app.post('/Dashboard/getTickets', require('./views/Dashboard/getTickets').getTickets);
    app.get('/Dashboard/update', require('./views/Dashboard/getTickets').updateGeneric);
    app.post('/Dashboard/removeWordfromSpider', require('./views/Dashboard/addException').addSpiderException);
    app.post('/Dashboard/promoteToBackLog', require('./views/Dashboard/promoteToBackLog').promoteToBackLog);
    app.get('/Dashboard/getBackLog',require('./views/Dashboard/promoteToBackLog').getBackLogList);
    app.post('/Dashboard/updateBackLog',require('./views/Dashboard/promoteToBackLog').updateBacklog);
    app.get('/Dashboard/clearBacklog',require('./views/Dashboard/promoteToBackLog').clearBacklog);
    app.get('/Dashboard/addBacklogPPT',require('./views/Dashboard/promoteToBackLog').exportBacklogToPowerpoint);
    app.get('/Dashboard/getRFC',require('./views/Dashboard/getRFC').getRFC);
    app.get('/Dashboard/getSnapshots',require('./views/Dashboard/getSnapshots').getSnapshot);
    app.post('/Dashboard/getSpider',require('./views/Dashboard/ticketSpider').getSpiderWords);

    //Admin
    app.get('/admin/', require('./views/admin/index').init);
    app.get('/admin/start', require('./views/admin/index').start);
    //Admin Search
    app.post('/admin/getSearchResults', require('./views/admin/getSearchResults').getSearchResults);
    app.post('/admin/addSearchResults',require('./views/admin/addSearchCriteria').addSearchResults);
    app.post('/admin/editSearchResults',require('./views/admin/editSearchCriteria').editSearchResults);
    app.post('/admin/removeSearchResults',require('./views/admin/editSearchCriteria').removeSearchResults);

    //Admin Cattegory
    app.post('/admin/getCattegoryResults', require('./views/admin/getCattegoryResults').getCattegoryResults);
    app.post('/admin/addCategoryResults',require('./views/admin/addCategoryResults').addCategoryResults);
    app.post('/admin/editCategoryResults',require('./views/admin/editCategoryResults').editCategoryResults);
    app.post('/admin/removeCategoryResults',require('./views/admin/editCategoryResults').removeCategoryResults);
    app.post('/admin/getCategoryResultsForm', require('./views/admin/getCattegoryResults').getCategoryResultsForm);
    app.post('/admin/saveCatValue', require('./views/admin/editCategoryResults').saveCatValue);
    app.post('/admin/addCatValue', require('./views/admin/getCattegoryResults').addCatValue);
    app.post('/admin/removeCatValue', require('./views/admin/editCategoryResults').removeCatValue);

    //Admin Dictionary
    app.post('/admin/getDictionaryResults', require('./views/admin/getDictionaryResults').getDictionaryResults);
    app.post('/admin/addDictionaryResults',require('./views/admin/addDictionaryResults').addDictionaryResults);
    app.post('/admin/editDictionaryResults',require('./views/admin/editDictionaryResults').editDictionaryResults);
    app.post('/admin/removeDictionaryResults',require('./views/admin/editDictionaryResults').removeDictionaryResults);

    //Admin SentimentScore
    app.post('/admin/getSentimentResults', require('./views/admin/getSentimentResults').getSentimentResults);
    app.post('/admin/addSentimentResults',require('./views/admin/addSentimentResults').addSentimentResults);
    app.post('/admin/editSentimentResults',require('./views/admin/editSentimentResults').editSentimentResults);
    app.post('/admin/removeSentimentResults',require('./views/admin/editSentimentResults').removeSentimentResults);

    //Admin EmployeeAssignment
    app.post('/admin/getEmployeeResults', require('./views/admin/getEmployeeResults').getEmployeeResults);
    app.post('/admin/addEmployeeResults',require('./views/admin/addEmployeeResults').addEmployeeResults);
    app.post('/admin/editEmployeeResults',require('./views/admin/editEmployeeResults').editEmployeeResults);
    app.post('/admin/removeEmployeeResults',require('./views/admin/editEmployeeResults').removeEmployeeResults);

    //Admin Content
    app.post('/admin/getContentResults', require('./views/admin/getContentResults').getContentResults);
    app.post('/admin/getContentResultsForm', require('./views/admin/getContentResults').getContentResultsForm);
    app.post('/admin/saveContentResults', require('./views/admin/addContentResults').saveContentResults);
    app.post('/admin/getContentText', require('./views/admin/getContentResults').getContentText);

    //Admin Blog
    app.post('/admin/getBlogResults', require('./views/admin/getBlogResults').getBlogResults);
    app.get('/admin/getBlogEmployees', require('./views/admin/getBlogResults').getBlogEmployees);
    app.post('/admin/addBlogResults',require('./views/admin/addBlogResults').addBlogResults);
    app.post('/admin/getBlogResultsForm', require('./views/admin/getBlogResults').getBlogResultsForm);
    app.post('/admin/saveBlogResults', require('./views/admin/addBlogResults').saveBlogResults);
    //app.get('/admin/getBlogText', require('./views/admin/getBlogResults').getBlogText);

    //Admin CV
    app.post('/admin/getCVS', require('./views/admin/getCVS').getCVS);
    app.post('/admin/removeCV', require('./views/admin/getCVS').removeCV);


    //Admin CV-Personalia
    app.post('/admin/saveCVPeronalia', require('./views/admin/CV/saveCVPeronalia').saveCVPeronalia);
    app.post('/admin/getCV', require('./views/admin/CV/saveCVPeronalia').getCV);
    app.post('/admin/getPeronalia', require('./views/admin/CV/saveCVPeronalia').getPeronalia);
    app.post('/admin/updateCVPeronalia', require('./views/admin/CV/saveCVPeronalia').updateCVPeronalia);
    app.post('/admin/updateCVProfile', require('./views/admin/CV/saveCVPeronalia').updateCVProfile);
    //Admin CV-Werkervaring
    app.post('/admin/getWerkervaring', require('./views/admin/CV/Werkervaring').getWerkervaring);
    app.post('/admin/saveWerkervaring', require('./views/admin/CV/Werkervaring').saveWerkervaring);
    //Admin CV-Opleiding
    app.post('/admin/getOpleiding', require('./views/admin/CV/Opleiding').getOpleiding);
    app.post('/admin/saveOpleiding', require('./views/admin/CV/Opleiding').saveOpleiding);
    //Admin CV-Vaardigheden
    app.post('/admin/getVaardigheden', require('./views/admin/CV/Vaardigheden').getVaardigheden);
    app.post('/admin/saveVaardigheden', require('./views/admin/CV/Vaardigheden').saveVaardigheden);

    //Admin CV-Vaardigheden-Categorie
    app.post('/admin/getCVCattegoryVaardighedenResults', require('./views/admin/CV/CategorieVaardigheden').getCattegoryVaardighedenResults);
    app.post('/admin/addCategoryVaardighedenResults', require('./views/admin/CV/addCategoryVaardighedenResults').addCategoryVaardighedenResults);
    app.post('/admin/getCategoryVaardighedenResultsForm', require('./views/admin/CV/CategorieVaardigheden').getCategoryVaardighedenResultsForm);
    app.post('/admin/removeCatVaardighedenValue', require('./views/admin/CV/editCategoryVaardighedenResults').removeCatVaardighedenValue);
    app.post('/admin/removeCatVaardighedenResults', require('./views/admin/CV/editCategoryVaardighedenResults').removeCategoryVaardighedenResults);
    app.post('/admin/getCatVaardigheden', require('./views/admin/CV/CategorieVaardigheden').getCatVaardigheden);




    //getContentText
    //app.post('/admin/addEmployeeResults',require('./views/admin/addEmployeeResults').addEmployeeResults);
    //app.post('/admin/editEmployeeResults',require('./views/admin/editEmployeeResults').editEmployeeResults);
    //app.post('/admin/removeEmployeeResults',require('./views/admin/editEmployeeResults').removeEmployeeResults);


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
            successRedirect:'/Dashboard/'
          , failureRedirect:'/login/'
          , failureFlash: true

    }),
        function(req, res) {
            res.redirect('/')})


    //route not found
    app.all('*', require('./views/http/index').http404);
};
