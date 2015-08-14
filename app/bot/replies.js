"use strict";

var _ = require("lodash-node");

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

    {
        regex: /hello/i,
        replies: [
            "Hello back!",
            "Nice to meet you",
            "What's up!",
            "How are you today?"
        ]
    },

    {
        regex: /subscribe/i,
        replies: [
            "Hello back!",
            "Nice to meet you",
            "What's up!",
            "How are you today?"
        ]
    },

    {
        regex: /cn/i,
        replies: [
            "你好吗",
            "很高兴认识你"
        ]
    }

];

var replies = {

    find: function(input, which) {
        var res = replyData.filter(function(one) {
            return one.regex.test(input);
        });
        var one = _.sample(res);
        if (one) {
            if (one.replies) {
                if (which!=null) { return one.replies[which]; }
                return _.sample(one.replies);
            } else if (one.reply) {
                return one.reply;
            }
        }
        return null;
    }
};

module.exports = replies;
