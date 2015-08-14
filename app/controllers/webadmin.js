/**
 * Module dependencies.
 */
var ElizaBot = require('eliza/elizabot.js');
var util = require("util");
var elizas = {};
var replies = require('../bot/replies');

var Brain = {};

//only receives a GET request
exports.index = function (req, res, next) {
    var echostr = req.query.echostr;
    //var echo_response= ('echostr', null);
    console.log("echo_response", echostr);
    res.send(echostr);

};

Brain.getReply = function(from, to, message) {
    var say = "";
    // figure out if this is for us
    say = replies.find(message);
    if (say) {
        return say;
    }

    // do we already have a bot for this user?
    var eliza = elizas[from]
    if (!eliza) {
        eliza = elizas[from] = new ElizaBot
        var init = elizas[from].getInitial()
        say = init;
        // just add it to the corpus so we remember it for later
        eliza.transform(message);
    } else {
        // otherwise, pick up
        say = eliza.transform(message);
        if (eliza.quit) delete elizas[from]
    }
    return say;
}

Brain.handleEvent = function(message, xml) {

    //body: { xml:
    //{ tousername: [ 'gh_fb568b0e8821' ],
    //    fromusername: [ 'o3BQnsyPcNSssSKTRacDtc08iTCA' ],
    //    createtime: [ '1439516443' ],
    //    msgtype: [ 'event' ],
    //    event: [ 'CLICK' ],
    //    eventkey: [ 'hello' ] } }

    var key = xml.eventkey[0];
    var reply = replies.find(key);
    return reply;

};

Brain.handleSubscribe = function(message, xml) {
    var reply = replies.find("subscribe");
    return reply;
};

Brain.xmlWrapMessage = function (message) {
    var str = util.format("<xml><ToUserName>%s</ToUserName><FromUserName>%s</FromUserName><CreateTime>%d</CreateTime><MsgType>text</MsgType><Content><![CDATA[%s]]></Content></xml>",
        message.from,
        message.to,
        message.createtime + 1,
        message.reply);
    return str;
};



exports.receive = function (req, res, next) {

    var reply;

    //curl -X POST --data @sample.xml http://localhost:5003/ --header "Content-Type:text/xml"

    // { xml:
    // 	2014-03-13T10:02:10.060573+00:00 app[web.1]:    { tousername: [ 'gh_5108e39bfd75' ],
    // 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      fromusername: [ 'oDvuOuMVDkSj4iU_Vh3mf0sHjyhg' ],
    // 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      createtime: [ '1394704892' ],
    // 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      msgtype: [ 'text' ],
    // 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      content: [ 'How are you' ],
    // 	2014-03-13T10:02:10.060573+00:00 app[web.1]:      msgid: [ '5990211898911335179' ] } }

    var msgtype = req.body.xml.msgtype[0];
    console.log("msgtype", msgtype);

    try {
        message = {
            to: req.body.xml.tousername[0],
            from: req.body.xml.fromusername[0],
            msgtype: msgtype,
            createtime: parseInt(req.body.xml.createtime[0])
        }
    } catch (e) {
        console.error("ERROR cant basic decode message:", req.body);
    }

    switch (msgtype) {
        case 'event':
            reply = Brain.handleEvent(message, req.body.xml);
            break;

        case 'subscribe':
            reply = Brain.handleSubscribe(message, req.body.xml);
            break;

        default:
            message.content = req.body.xml.content[0];
            reply = Brain.getReply(message.to, message.from, message.content);
    }

    message.reply = reply;
    var str = Brain.xmlWrapMessage(message);

    console.log("xml", req.body.xml);
    console.log(message.from, ">", message.content);
    console.log(message.from, "<", message.reply);

    console.log("req.body", req.body);
    console.log("req.body.xml>", req.body.xml);
    console.log("message>", message);

    console.log("--");

    //console.log(str);
    res.contentType("application/xml");
    res.send(str);

};

