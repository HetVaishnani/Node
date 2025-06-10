const schema = require("../model/schema"); 
const Manager = require("../model/managerschema"); 
const bcrypt = require("bcrypt");

const Employee = require("../model/employeeschema");

module.exports.signup = async (req, res) => {
  console.log("Request Body:", req.body);

  const user = await schema.findOne({ email: req.body.email });
  if (user) {
    return res.status(200).json({ msg: "User already registered" });
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);
  req.body.role = "admin";
  req.body.isAdmin = true;

  const newUser = await schema.create(req.body);
  return res.status(200).json({
    msg: "User successfully created!",
    user: newUser,
  });
};

module.exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields required" });
    }

    let user = null;

    if (role === "admin") {
      user =
        (await schema.findOne({ email })) ||
        (await schema.findOne({ name: email }));
    } else if (role === "manager") {
      user =
        (await Manager.findOne({ email })) ||
        (await Manager.findOne({ username: email }));
    } else if (role === "employee") {
      user =
        (await Employee.findOne({ email })) ||
        (await Employee.findOne({ username: email }));
    } else {
      return res.status(400).json({ success: false, msg: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (user.role && user.role !== role) {
      return res.status(403).json({ success: false, msg: "Role mismatch" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, msg: "Wrong password" });
    }

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      role,
      email: user.email,
      name: user.name || user.username,
      _id: user._id,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

module.exports.dashboard = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, msg: "Email is required" });
  }

  const user =
    (await schema.findOne({ email })) || (await Manager.findOne({ email }));

  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  res.status(200).json({
    success: true,
    msg: `Welcome ${user.role || "manager"}`,
    role: user.role || "manager",
    name: user.name || user.username,
    _id: user._id,
  });
};

module.exports.addManager = async (req, res) => {
  const { username, email, phone, password, adminId } = req.body;

  if (!username || !email || !phone || !password || !adminId) {
    return res
      .status(400)
      .json({ success: false, msg: "All fields are required" });
  }

  const existing = await Manager.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, msg: "Manager already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newManager = new Manager({
    username,
    email,
    phone,
    password: hashedPassword,
    adminId,
  });

  await newManager.save();

  return res
    .status(201)
    .json({ success: true, msg: "Manager added successfully!" });
};

module.exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find().populate("adminId", "name email");
    res.status(200).json({ success: true, managers });
  } catch {
    res.status(500).json({ success: false, msg: "Error fetching managers" });
  }
};

module.exports.deleteManager = async (req, res) => {
  try {
    const deleted = await Manager.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, msg: "Manager not found" });
    }
    res
      .status(200)
      .json({ success: true, msg: "Manager deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

exports.managerDashboard = async (req, res) => {
  const { email } = req.query;

  try {
    const manager = await Manager.findOne({ email }).populate(
      "adminId",
      "name email"
    );

    if (!manager) {
      return res.status(404).json({ success: false, msg: "Manager not found" });
    }

    return res.status(200).json({ success: true, manager });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports.addEmployee = async (req, res) => {
  const { username, email, phone, password, image, managerId } = req.body;

  if (!username || !email || !phone || !password || !managerId) {
    return res.status(400).json({ success: false, msg: "All fields required" });
  }

  const existing = await Employee.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, msg: "Employee already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newEmployee = new Employee({
    username,
    email,
    phone,
    password: hashedPassword,
    image,
    managerId,
  });

  await newEmployee.save();

  return res
    .status(201)
    .json({ success: true, msg: "Employee added successfully" });
};

module.exports.getAllEmployees = (req, res) => {
  Employee.find()
    .then((employees) => {
      res.status(200).json({ success: true, employees });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, msg: "Error fetching employees" });
    });
};

module.exports.employeeProfile = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, msg: "Email required" });
  }
  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, msg: "Employee not found" });
    }
    res.status(200).json({ success: true, employee });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, msg: "Employee not found" });
    }
    res
      .status(200)
      .json({ success: true, msg: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
