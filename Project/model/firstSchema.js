const mongoose = require("mongoose");

const schema = mongoose.Schema({
    profile : {
        type : String,
        required : true
    },
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

const firstSchema = mongoose.model("AdminData",schema);

module.exports = firstSchema;