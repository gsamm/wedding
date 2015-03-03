var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var pg = require('pg');
var sass = require('node-sass-middleware');

var app = express();

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
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/find-invitation', function (req, res) {
	res.render('find-invitation');
})

app.get('/rsvp', function (req, res) {
	res.render('rsvp');
});

app.get('/api/invitations:id', function (req, res) {
});

app.get('/api/invitations', function (req, res) {
	pg.connect(process.env.DATABASE_URL, function (err, client, done) {
		done();

		if (err) {
			console.error(err);
			res.send('Error ' + err);
		}

		client.query('SELECT * FROM invitations WHERE email = $1', [req.query.email], function (err, result) {
			if (err) {
				console.error(err);
				res.send('Error ' + err);
			} else {
				res.send(result.rows);
			}
		});
	});
});

app.post('/api/invitations', function (req, res) {
});

// // 500
// app.use(function (err, req, res, next) {
// 	res.status(500).render('5xx');
// });

// 404
app.use(function (req, res, next) {
	res.status(404).render('404', { url: req.originalUrl });
});

if (app.get('env') == 'development') {
	app.use(errorHandler());

	// Load environment variables from .env file if running locally.
	require('dotenv').load();
}

// Setup server.
app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
})