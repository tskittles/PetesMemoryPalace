require('dotenv').config()
const express = require('express');
const colors = require('colors');
const path = require('path');
const pg = require('pg');

const postController = require('./database/controllers/postController');
const getController = require('./database/controllers/getController');
const deleteController = require('./database/controllers/deleteController');

const passport = require('passport');
const configAuth = require('../config/auth.js');
const FacebookStrategy = require('passport-facebook');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


const SERVER_PORT = process.env.SERVER_PORT || 3000;
const env = process.env.NODE_ENV || 'development';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  // console.log('this: ', id);
  getController.searchForUser({emails: id.email}, ((bob, user) => {
    done(null, user);
  }));
});

passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL, 
  profileFields: ['id', 'name', 'displayName', 'photos', 'emails', 'friends'],
  },
  function(accessToken, refreshToken, profile, cb) {
    getController.searchForUser({ emails: profile.emails[0].value }, function (err, user) {
      // console.log('our:', user);
      if (user) {
        cb(null, user)
      } else {
        // console.log('new user being made');
        postController.newUser(profile.emails[0].value, profile.displayName, user => {
          cb(null, user);
        });
      }
    });
  }
))

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: configAuth.cookieKey,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile','user_friends', 'email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  }
);

// app.get('/addPalace', (req, res) => {
//   console.log(req.user);
//   res.send(req.user);
// })

app.get('/auth', (req, res) => {
  // console.log(req);
  if (req.user) {
    res.json(req.user);
  } else {
    res.json({});
  }
});

app.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.redirect('/');
  }
});

if (env === 'development'){
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config');
  const config = Object.create(webpackConfig);

  config.devtool = 'eval-source-map';
  config.entry = [
    `webpack-hot-middleware/client?path=http://localhost:${SERVER_PORT}/__webpack_hmr`,
    './client/index.js'
  ];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: config.output.filename,
    publicPath: '/',
    stats: { colors: true }
  }));

app.use(webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr'
  }));
} else {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// console.log(controller.getController.getPalaces);
// controller.postController.newUser();

// app.post('/newUser', controller.postController.newUser);

// app.get('/user', controller.getController.searchForUser);`


app.get('/addPalace', getController.newPalace)

app.get('/deletePalace', deleteController.deletePalace)

app.get('/getPalaces', getController.getPalaces)

app.get('/getPalace', getController.getPalace)

app.post('/storeNode', postController.storeNode)

app.get('/deleteNode', deleteController.deleteNode)

app.get('/getNodes', getController.getNodes)


app.listen(SERVER_PORT, () => console.log(`App listening on port ${SERVER_PORT}...`.yellow));