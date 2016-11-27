const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');
const xml2js = require('xml2js');


fs.readFile('./data/MemberData.xml', 'utf8', function(err, data) {
    // $ = cheerio.load(data);

    // var rep = $('official-name:contains(Nydia)').;

    var membersKeyedByOfficialName = {};

    xml2js.parseString(data, function (err, result) {
	    // console.dir(JSON.stringify(result.MemberData.members[0].member[0]));

	    // .member-info[0].phone[0] // "(202) 225-5765"
	    // .member-info[0].official-name[0]

	    // .statedistrict[0]
	    result.MemberData.members[0].member.forEach(function(member){
	    	var info = member['member-info'][0];
	    	var officialName = info['official-name'][0];

	    	var normalizedMember = {
	    		'member-info' : {},
	    		statedistrict : member['statedistrict'][0],
	    		committeeAssignments : member['committeeAssignments']
	    	};

	    	for (var key in info){
	    		normalizedMember['member-info'][key] = info[key][0];
	    	}

	    	membersKeyedByOfficialName[officialName] = normalizedMember;
	    });
	    
	    console.log('membersKeyedByOfficialName', JSON.stringify(membersKeyedByOfficialName['Nydia M. Velázquez']));
	});
})