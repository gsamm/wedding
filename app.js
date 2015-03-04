var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var pg = require('pg');
var sass = require('node-sass-middleware');
var _ = require('underscore');

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

app.get('/api/invitations/:id', function (req, res) {
	var guid = req.params.id;

	if (!_.isUndefined(guid) && !_.isEmpty(guid)) {
		pg.connect(process.env.DATABASE_URL, function (err, client, done) {
			done();

			// Error connecting to server.
			if (err) {
				console.error(err);
				res.send(500);
			}

			client.query('SELECT * FROM invitations WHERE guid = $1', [guid], function (err, result) {
				// Error executing query.
				if (err) {
					console.error(err);
					res.send(500);
				} else {
					if (result.rows.length === 0) {
						res.send(404);
					} else {
						res.send(result.rows[0]);
					}
				}
			});
		});
	} else {
		res.send(404);
	}
});

app.post('/api/invitations/:id', function (req, res) {
});

app.get('/api/invitations', function (req, res) {
	var email = req.query.email;

	if (!_.isUndefined(email) && !_.isEmpty(email)) {
		pg.connect(process.env.DATABASE_URL, function (err, client, done) {
			done();

			if (err) {
				console.error(err);
				res.send(500);
			}

			client.query('SELECT guid FROM invitations WHERE email = $1', [email], function (err, result) {
				if (err) {
					console.error(err);
					res.send(500);
				} else {
					if (result.rows.length === 0) {
						res.send(404);
					} else {
						res.send(result.rows[0].guid);
					}
				}
			});
		});
	} else {
		res.send(404);
	}
});

// 500
app.use(function (err, req, res, next) {
	res.status(500).render('5xx');
});

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