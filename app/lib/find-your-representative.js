const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');
const xml2js = require('xml2js');
const removeDiacritics = require('diacritics').remove;


// var format = {
// 	street: '545 prospect place'
// 	city:'brooklyn'
// 	state:'NYNew York'
// 	Submit:'FIND YOUR REP BY ADDRESS'
// 	ZIP:'11238'
// };

var url = 'http://ziplook.house.gov/htbin/findrep?ADDRLK33576111033576111';

/*
"{
    "member-info": {
        "namelist": "Rogers, Mike",
        "bioguideID": "R000575",
        "lastname": "Rogers",
        "firstname": "Mike",
        "middlename": "",
        "sort-name": "ROGERS,MIKE",
        "suffix": "",
        "courtesy": "Mr.",
        "prior-congress": "113",
        "official-name": "Mike Rogers",
        "formal-name": "Mr. Rogers of Alabama",
        "party": "R",
        "caucus": "R",
        "state": {
            "$": {
                "postal-code": "AL"
            },
            "state-fullname": [
                "Alabama"
            ]
        },
        "district": "3rd",
        "townname": "Anniston",
        "office-building": "CHOB",
        "office-room": "324",
        "office-zip": "20515",
        "office-zip-suffix": "0103",
        "phone": "(202) 225-3261",
        "elected-date": {
            "_": "November  4, 2014",
            "$": {
                "date": "20141104"
            }
        },
        "sworn-date": {
            "_": "January  6, 2015",
            "$": {
                "date": "20150106"
            }
        }
    },
    "statedistrict": "AL03"
}"
*/
let membersKeyedByOfficialName = {};

fs.readFile('./data/MemberData.xml', 'utf8', function(err, data) {
    xml2js.parseString(data, 
    	{
  			tagNameProcessors: [function(name){
  				if (name === '$'){
  					return 'raw';
  				} else {
  					return name;
  				}
  			}]
		},
    	function (err, result) {
	    	result.MemberData.members[0].member.forEach(function(member){
	    	var info = member['member-info'][0];
	    	var officialName = removeDiacritics(info['official-name'][0]);

	    	var normalizedMember = {
	    		'member-info' : {},
	    		statedistrict : member['statedistrict'][0],
	    		committeeAssignments : member['committeeAssignments']
	    	};

	    	for (var key in info){
	    		normalizedMember['member-info'][key] = info[key][0];
	    	}

	    	for (var key in normalizedMember['member-info']){
	    		for (var nestedKey in normalizedMember['member-info'][key]){
	    			if (nestedKey === '$'){
	    				normalizedMember['member-info'][key]['raw'] = normalizedMember['member-info'][key]['$']
	    				delete normalizedMember['member-info'][key]['$'];
	    			}
	    		}
	    	}
	    	if (normalizedMember.committeeAssignments){
	    		normalizedMember.committeeAssignments.forEach(function(assignment){
		    		for (var nestedKey in assignment){
		    			if (nestedKey === '$'){
		    				assignment['raw'] = assignment['$']
		    				delete assignment['$'];
		    			}
		    		}
		    	})
	    	}

	    	membersKeyedByOfficialName[officialName] = normalizedMember;
	    });
	    
	    console.log('membersKeyedByOfficialName loaded');
	    Object.keys(membersKeyedByOfficialName).forEach(function(key){
	    	console.log(key);
	    })
	});
})

function get(address, done){
	request({
	    url: url,
	    method: 'POST',
	    form: {
	        street : address.street,
			city : address.city,
			state : address.state,
			ZIP : address.zip
	    }
	},
	function(err, response, body){
		console.log('response from congress', body);
		if (err) { return done(err);}
		console.log(body);
		$ = cheerio.load(body);
		var officialName = removeDiacritics(_.trim($('#PossibleReps>div>p>a').text()));

		console.log('looking for', officialName);

		var representative = membersKeyedByOfficialName[officialName];

		console.log(representative);

		return done(null, representative);
	});
}

module.exports = get;