var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var sass = require('node-sass-middleware');

var app = express();

if (app.get('env') == 'development') {
	app.use(errorHandler());

	// Load environment variables from .env file if running locally.
	require('dotenv').load();
}

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { layout: 'layout.jade' });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sass({
	src: path.join(__dirname, 'public/css/source'),
	dest: path.join(__dirname, 'public/css'),
	debug: true,
	prefix: '/css'
}));

// Setup routes.
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

// 500
app.use(function (err, req, res, next) {
	res.status(500).render('5xx');
});

// 404
app.use(function (req, res, next) {
	res.status(404).render('404', { url: req.originalUrl });
});

// Setup server.
app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});