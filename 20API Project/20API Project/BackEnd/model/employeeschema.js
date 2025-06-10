const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  role: {
    type: String,
    enum: ["employee"],
    default: "employee",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
