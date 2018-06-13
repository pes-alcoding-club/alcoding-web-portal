const mocha = require('mocha');
const assert = require('assert');
const User = require('../models/users');

describe("Running finding tests: ", function(){

    var char;

    beforeEach(function(done){
        char = new User({
            name : "Aditya",
            age: 19
        });

        char.save().then(function(){
            done();
        });
    });

    it("Finds one record from the database by name", function(done){
        User.findOne({name:"Aditya"}).then(function(result){
            assert(result.name==="Aditya");
            done();
        });
    });

    it("Finds one record from the database by id", function(done){
        User.findOne({_id:char._id}).then(function(result){
            assert(result._id.toString() === char._id.toString());
            // since _id is Object type, convert to Strings
            done();
        });
    });

    
});