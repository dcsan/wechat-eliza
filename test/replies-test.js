"use strict";

require('dotenv').config({path: 'dot.env'});
var expect = require("chai").expect;

var replies = require("../app/bot/replies.js");

describe("replies", function () {

    it("should reply to help", function () {
        var rep = "";
        rep = replies.find("help");
        expect(rep).to.include("what can i help")
    });

    it("should reply to english", function () {
        var rep = replies.find("how about english");
        expect(rep).to.include("Do you speak it?")
    });

    // FIXME, this is a random from a list
    it("should reply from lists", function () {
        var rep = replies.find("hello", 0);
        expect(rep).to.include("Hello back!");
    });

});
