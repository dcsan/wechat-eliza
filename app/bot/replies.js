"use strict"

_ = require("lodash-node");

// TODO read from CSV file?

var replyData = [
    {
        regex: /help/i,
        reply: "what can i help you with?"
    },

    {
        regex: /how are you/i,
        reply: "I'm great, and you?"
    },

    {
        regex: /english/i,
        reply: "Do you speak it?"
    },

];

var replies = {

    find: function(input) {
        var res = replyData.filter(function(one) {
            return one.regex.test(input);
        });
        var one = _.sample(res);
        if (one) {
            return one.reply;
            //return one.fn(input);
        }
        return null;
    }
};

module.exports = replies;
