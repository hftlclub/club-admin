var moment = require('moment');
var config = require('../config');
var utils = require('../modules/utils');
var protocolsservice = require('../services/protocolsservice');


//add user function for superusers
exports.add = function(req, res, next){
	
	req.body.start.mm = parseInt(req.body.start.mm);
	req.body.start.hh = parseInt(req.body.start.hh);
	req.body.end.mm = parseInt(req.body.end.mm);
	req.body.end.hh = parseInt(req.body.end.hh);
	
	req.checkBody('title', 'Titel ungültig').notEmpty();
	req.checkBody('recorder', 'Protokollführer ungültig').notEmpty();
	req.checkBody('text', 'Protokolltext ungültig').notEmpty();
	req.checkBody('date', 'Datum ungültig').notEmpty();
	req.checkBody('start.hh', 'Startzeit ungültig').notEmpty().isInt();
	req.checkBody('start.mm', 'Startzeit ungültig').notEmpty().isInt();
	req.checkBody('end.hh', 'Endzeit ungültig').notEmpty().isInt();
	req.checkBody('end.mm', 'Endzeit ungültig').notEmpty().isInt();

	if(req.validationErrors()){
		return next();
	}



	//build new object
	var prot = {
		"title": req.body.title,
		"recorder": req.body.recorder,
		"text": req.body.text,
		"comment": req.body.comment
	}
	
	//attendants as JSON string
	prot.attendants = JSON.stringify(req.body.attendants);
	
	//merge date and start/end time
	var start = moment(req.body.date).hour(req.body.start.hh).minute(req.body.start.mm);
	prot.start = utils.moment2mysql(start);
	
	var end = moment(req.body.date).hour(req.body.end.hh).minute(req.body.end.mm);
	prot.end = utils.moment2mysql(end);
	

	//add new protocol
	protocolsservice.add(prot, function(err, id){
		if(err){
			return next(err);
		}

		//return new id
		res.json({
			'id': id
		}).end();
	});
}