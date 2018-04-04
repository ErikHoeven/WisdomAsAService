'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    dbBlogs = db.get('blogs'),
    moment = require('moment'),
    d3 = require('d3'),
    uri = 'mongodb://localhost:27017/commevents',
    mongo = require('mongodb'),
    underscore = require('underscore')

exports.addBlogResults = function(req, res, next) {
    console.info('---------------------  addBlogResults --------------------------------')
    var titel = req.body.titel, chanel = req.body.chanel, auteur = req.body.auteur, user = req.user, user = {}, artikel = req.body.artikel
    user = req.user || {}

    var blogObject = {titel: titel, username: user.username, chanel : chanel, auteur: auteur, artikel: artikel, creationDate: Date() }
    console.info(blogObject)
    dbBlogs.insert(blogObject)

     res.status(200).json({message: 'Blog succesvol toegevoegd',route:'/admin/', menu:'blog'})
}


exports.saveBlogResults = function(req, res, next) {
    console.info('---------------------  saveBlogResults --------------------------------')
    var titel = req.body.titel, chanel = req.body.chanel, auteur = req.body.auteur, user = req.user, user = {}, artikel = req.body.artikel
    user = req.user || {}

    dbBlogs.update({titel: titel}, {$set: {artikel : artikel, chanel:chanel, auteur:auteur}}, false, true)

    res.status(200).json({message: 'blog succesvol opgeslagen',route:'/admin/', menu:'blog'})

}