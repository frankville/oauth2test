var express = require("express"),
bodyParser = require("body-parser"),
oauth2server = require("node-oauth2-server");

var app = express();


app.oauth = oauth2server({
    model:require("./model"),
    grants: ["auth_code","password"],
    debug:true
});

app.use(bodyParser());

app.all("/oauth/token", app.oauth.grant());

app.get('/oauth/authorise', function (req, res, next) {
    if (!req.session.user) {
   
	return res.redirect('/login?redirect=' + req.path + '&client_id=' +
			    req.query.client_id + '&redirect_uri=' + req.query.redirect_uri);
    }

    res.render('authorise', {
	client_id: req.query.client_id,
	redirect_uri: req.query.redirect_uri
    });
});

app.post('/oauth/authorise', function (req, res, next) {
    if (!req.session.user) {
	return res.redirect('/login?client_id=' + req.query.client_id +
			    '&redirect_uri=' + req.query.redirect_uri);
    }

    next();
}, app.oauth.authCodeGrant(function (req, next) {
 
    next(null, req.body.allow === 'yes', req.session.user.id, req.session.user);
}));

app.get('/login', function (req, res, next) {
    res.render('login', {
	redirect: req.query.redirect,
	client_id: req.query.client_id,
	redirect_uri: req.query.redirect_uri
    });
});

app.post('/login', function (req, res, next) {

    if (req.body.email !== 'thom@nightworld.com') {
	res.render('login', {
	    redirect: req.body.redirect,
	    client_id: req.body.client_id,
	    redirect_uri: req.body.redirect_uri
	});
    } else {
   
	return res.redirect((req.body.redirect || '/home') + '?client_id=' +
			    req.body.client_id + '&redirect_uri=' + req.body.redirect_uri);
    }
});


app.get('/secret', app.oauth.authorise(), function (req, res) {

    res.send('Secret area');
});

app.get('/public', function (req, res) {

    res.send('Public area');
});

app.use(app.oauth.errorHandler());

app.listen(3000);

