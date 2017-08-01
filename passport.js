'use strict';

exports = module.exports = function(app, passport) {

    var LocalStrategy = require('passport-local').Strategy,
        GitHubStrategy = require('passport-github').Strategy,
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        request = require("request"),
        async = require('async'),
        mongo = require('mongodb'),
        db = require('monk')('localhost/commevents'),
        userWaas = db.get('user_waas'),
        passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        express = require('express');



    passport.use(new LocalStrategy({passReqToCallback : true},
        function(req, username, password, done) {
            console.info('start Pasport')

            userWaas.findOne({username: username}, function(err, user) {
                console.log(user);

                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (user.password != password) {
                    return done(null, false, req.flash('loginMessage', 'Wrong password'));
                }
                return done(null, user);

            })
        }))

            passport.serializeUser(function(user, done) {
                done(null, user._id);
            });

            passport.deserializeUser(function(id, done) {
                userWaas.findOne({_id: id}, function(err, user) {
                    done(err, user);
                });
            });




}
