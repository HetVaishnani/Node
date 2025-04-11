const mongoose = require("mongoose");

const schema = mongoose.Schema({
    number: {
        type: Number,
        requried: true
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        requried: true
    },
    author: {
        type: String,
        requried: true
    },
    price: {
        type: Number,
        requried: true
    }
})

const fiSchema = mongoose.model("book", schema);
module.exports = fiSchema