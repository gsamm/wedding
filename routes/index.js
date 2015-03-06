var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/rsvp/:id', function (req, res) {
	res.render('rsvp');
});

router.get('/find-invitation', function (req, res) {
	res.render('find-invitation');
});

module.exports = router;