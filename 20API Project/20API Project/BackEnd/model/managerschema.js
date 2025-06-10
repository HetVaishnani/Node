const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MERN",
    required: true,
  },
  role: {
    type: String,
    enum: ["manager"],
    default: "manager",
  },
});

const Manager = mongoose.model("Manager", managerSchema);

module.exports = Manager;
  