var express = require('express');
var pg = require('pg');
var _ = require('underscore');
var router = express.Router();

router.get('/invitations', function (req, res) {
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

router.get('/invitations/:id', function (req, res) {
	var guid = req.params.id;

	if (!_.isUndefined(guid) && !_.isEmpty(guid)) {
		pg.connect(process.env.DATABASE_URL, function (err, client, done) {
			done();

			// Error connecting to server.
			if (err) {
				console.error(err);
				res.send(500);
			}

			client.query('SELECT * FROM invitations i INNER JOIN guests g ON g.invitation_id = i.id WHERE guid = $1', [guid], function (err, result) {
				// Error executing query.
				if (err) {
					console.error(err);
					res.send(500);
				} else {
					if (result.rows.length === 0) {
						res.send(404);
					} else {
						var invitation = {
							id: result.rows[0].id,
							guests: []
						};

						_.each(result.rows, function (element, index, list) {
							invitation.guests.push({
								id: element.id,
								firstName: element.first_name,
								lastName: element.last_name
							});
						});

						res.send(invitation);
					}
				}
			});
		});
	} else {
		res.send(404);
	}
});

router.put('/invitations/:id', function (req, res) {
	// TODO: Update invitation and guest information.
});

module.exports = router;