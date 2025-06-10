const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    default: "admin",
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MERN", 
    required: function () {
      return this.role === "manager";
    },
  },
});

const Firstschema = mongoose.model("MERN", schema);

module.exports = Firstschema;
