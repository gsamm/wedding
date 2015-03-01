var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var sass = require('node-sass-middleware');

var app = express();

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', { layout: 'layout.jade' });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sass({
	src: path.join(__dirname, 'public/css/source'),
	dest: path.join(__dirname, 'public/css'),
	debug: true,
	prefix: '/css'
}));

// Setup routes.
app.get('/', function (req, res) {
	res.render('index');
});

app.route('/find-invitation')
	.get(function (req, res) {
		res.render('find-invitation');
	})
	.post(function (req, res) {
	});

app.route('/rsvp')
	.get(function (req, res) {
		res.render('rsvp');
	})
	.post(function (req, res) {
	});

// // 500
// app.use(function (err, req, res, next) {
// 	res.status(500).render('5xx');
// });

// // 404
// app.use(function (req, res, next) {
// 	res.status(404).render('400', { url: req.originalUrl });
// });

if ('development' == app.get('env')) {
	app.use(errorHandler());
}

// Setup server.
app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
})