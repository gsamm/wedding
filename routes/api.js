var express = require('express');
var Promise = require('bluebird');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL, { dialectOptions: { ssl: 'ssl' }, logging: false });
var _ = require('underscore');

// Define models.
var Invitation = sequelize.define('invitation', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	guid: { type: Sequelize.TEXT },
	email: { type: Sequelize.TEXT },
	address1: { type: Sequelize.TEXT },
	address2: { type: Sequelize.TEXT },
	city: { type: Sequelize.TEXT },
	province: { type: Sequelize.TEXT },
	postalCode: { type: Sequelize.TEXT, field: 'postal_code' },
	arePartyAnimals: { type: Sequelize.BOOLEAN, field: 'are_party_animals' }
}, {
	tableName: 'invitations',
	underscored: true
});

var Guest = sequelize.define('guest', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: Sequelize.TEXT, field: 'name' },
	isAttending: { type: Sequelize.BOOLEAN, field: 'is_attending' },
	dietaryConsiderations: { type: Sequelize.TEXT }
}, {
	tableName: 'guests',
	underscored: true
});

// Define relationships.
Invitation.hasMany(Guest);

var router = express.Router();

router.get('/invitations', function (req, res) {
	var email = req.query.email;

	if (!_.isUndefined(email) && !_.isEmpty(email)) {
		Invitation.find({
			where: { email: email }
		}).then(function (invitation) {
			if (_.isNull(invitation)) {
				res.send(404);
			} else {
				res.send(invitation.guid);
			}
		}).catch(function (err) {
			console.error(err);
			res.send(500);
		});
	} else {
		res.send(404);
	}
});

router.get('/invitations/:id', function (req, res) {
	var guid = req.params.id;

	if (!_.isUndefined(guid) && !_.isEmpty(guid)) {
		Invitation.find({
			include: [ Guest ],
			where: { guid: guid }
		}).then(function (invitation) {
			if (_.isNull(invitation)) {
				res.sendStatus(404);
			} else {
				res.send(invitation);
			}
		}).catch(function (err) {
			console.error(err);
			res.sendStatus(500);
		});
	} else {
		res.sendStatus(404);
	}
});

router.put('/invitations/:id', function (req, res) {
	var guid = req.params.id;

	if (!_.isUndefined(guid) && !_.isEmpty(guid)) {
		Invitation.find({
			include: [ Guest ],
			where: { guid: guid }
		}).then(function (invitation) {
			if (_.isNull(invitation)) {
				res.sendStatus(404);
			} else {
				invitation.address1 = req.body.address1;
				invitation.address2 = req.body.address2;
				invitation.city = req.body.city;
				invitation.province = req.body.province;
				invitation.postalCode = req.body.postalCode;
				invitation.arePartyAnimals = req.body.arePartyAnimals;

				_.each(req.body.guests, function (element, index, list) {
					invitation.guests[index].name = element.name;
					invitation.guests[index].isAttending = element.isAttending;
					invitation.guests[index].dietaryConsiderations = element.dietaryConsiderations;
				});

				sequelize.transaction(function (t) {
					return invitation.save({ transaction: t })
					.then(function () {
						return Promise.all(_.each(invitation.guests, function (element, index, list) {
							return element.save({ transaction: t});
						}));
					});
				}).then(function () {
					// Transaction has been committed.
					res.sendStatus(200);
				}).catch(function (err) {
					console.error(err);
					res.sendStatus(500);
				});
			}
		}).catch(function (err) {
			console.error(err);
			res.sendStatus(500);
		});
	} else {
		res.sendStatus(404);
	}
});

module.exports = router;