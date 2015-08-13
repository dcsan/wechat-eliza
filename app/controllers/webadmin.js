/**
 * Module dependencies.
 */
var ElizaBot = require('eliza/elizabot.js')
var util = require("util");
var elizas = {};

//only receives a GET request
exports.index = function(req, res, next) {
	var echostr = req.query.echostr;
    //var echo_response= ('echostr', null);
    console.log("echo_response", echostr);
    res.send(echostr);
	
}

exports.message = function (from, to, message) {
  // figure out if this is for us
 

 
  // do we already have a bot for this user?
var say = "";  
var eliza = elizas[from]
  if (!eliza) {
    eliza = elizas[from] = new ElizaBot
    var init = elizas[from].getInitial()
    say = init;
    // just add it to the corpus so we rememeber it for later
    eliza.transform(message);
  } else {

  // otherwise, pick up
  say = eliza.transform(message);
  if (eliza.quit) delete elizas[from]
	}
	return say;
}

exports.receive = function(req, res, next) {

		
		//curl -X POST --data @sample.xml http://localhost:5003/ --header "Content-Type:text/xml"
		
		// { xml: 
		// 	2014-03-13T10:02:10.060573+00:00 app[web.1]:    { tousername: [ 'gh_5108e39bfd75' ],
		// 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      fromusername: [ 'oDvuOuMVDkSj4iU_Vh3mf0sHjyhg' ],
		// 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      createtime: [ '1394704892' ],
		// 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      msgtype: [ 'text' ],
		// 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      content: [ 'How are you' ],
		// 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      msgid: [ '5990211898911335179' ] } }
		
		
		tousername = req.body.xml.tousername[0];
		fromusername = req.body.xml.fromusername[0];
		msgtype = req.body.xml.msgtype[0];
		content = req.body.xml.content[0];
		createtime = parseInt(req.body.xml.createtime[0]);
		res.contentType("application/xml");
		reply = exports.message(tousername,fromusername,content)
		str = util.format("<xml><ToUserName>%s</ToUserName><FromUserName>%s</FromUserName><CreateTime>%d</CreateTime><MsgType>text</MsgType><Content><![CDATA[%s]]></Content></xml>",fromusername,tousername,createtime+1,reply);
		console.log(str);
		res.send(str);
	
}

