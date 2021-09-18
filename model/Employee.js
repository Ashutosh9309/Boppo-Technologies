const mongoose = require("mongoose");
var User = require("./User");

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  organizationName: {
    type: String,
    required: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
module.exports = mongoose.model("Employee", EmployeeSchema);

//First Name, Last Name, Email ID, Password, a unique employeeID and Organization Name.
