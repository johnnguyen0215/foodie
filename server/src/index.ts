import express = require('express');
import path = require('path');
import passport = require('passport');
import bodyParser = require('body-parser');
import session = require('express-session');
import cors = require('cors');
import mongoose = require('mongoose');
import errorHandler = require('errorhandler');
import https = require('https');
import fs = require('fs');
import { environment } from 'src/environments/environment';

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// Initiate our app
const app: express.Application = express();

// Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
  {
    secret: 'passport-tutorial',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  }));

if (!isProduction) {
  app.use(errorHandler());
}

// Configure Mongoose
mongoose.connect('mongodb+srv://john-nguyen:august18@foodie-cluster-sex1j' +
'.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);

import './models/User';
import './config/passport.ts';
import routes from './routes';

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

// Error handlers & middlewares
if (!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
}, app)
.listen(8000, () => console.log('Server running on https://localhost:8000/'));

// if (isProduction) {
//   https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert'),
//   }, app)
//   .listen(8000, () => console.log('Server running on https://localhost:8000/'));
// } else {
//   app.use(passport.session());
//   app.listen(8000, () => {
//     console.log('Server running on http://localhost:8000/');
//   });
// }
