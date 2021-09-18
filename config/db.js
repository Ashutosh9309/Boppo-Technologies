const mongoose = require("mongoose");
const URL = "mongodb://localhost:27017/EmployeeData2";

const mongoDb = async () => {
  try {
    mongoose.connect(URL);
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoDb;
