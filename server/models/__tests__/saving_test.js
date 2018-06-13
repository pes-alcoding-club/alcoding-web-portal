const mocha = require('mocha');
const assert = require('assert');
const User = require('../models/person/users');
// importing User from models/users.js

// Desribe the events
describe("Running saving tests: ", function(){
    // Run the tests
    it("Adding two numbers", function(done){
        const char = new User({
            name : "Aditya",
        });

        char.save().then(function(){
            assert(char.isNew===false);
            done();
        });
        // .save() saves the entry as a document into the collection
        // save() is an asynchronous function, hence we need to know when its completed
        // .save().then() executes after the completion
        // done() lets mongoose know when tests are over

    })

    // next test
})