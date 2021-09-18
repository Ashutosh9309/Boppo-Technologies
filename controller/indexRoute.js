const express = require("express");
const route = express.Router();
const User = require("../model/User");
const Employee = require("../model/Employee");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const flash = require('connect-flash')
//===========Register Employee=====================
route.post("/register", async (req, res) => {
  try {
    let users = await User.findOne({ email: req.body.email });
    if (users) {
      return res.send("User already exists! Please Login");
    } else {
      const hashedPassord = bcrypt.hashSync(req.body.password, 8);
      const user = {
        email: req.body.email,
        password: hashedPassord,
      };
      users = await User.create(user);
      try {
        const employee = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          organizationName: req.body.organizationName,
          employees: mongoose.Types.ObjectId(users._id),
        };
        let employees = await Employee.create(employee);
        return res.status(201).send(employees);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});
//============ Login ====================
route.post("/login", async (req, res) => {
  try {
    let emp = await User.findOne({ email: req.body.email });

    if (!emp) {
      return res.send("User Not Found! Please Register");
    } else {
      const validPassword = bcrypt.compareSync(req.body.password, emp.password);
      if (!validPassword) {
        return res.send("Please enter right credential");
      } else {
        const token = jwt.sign({ id: emp._id }, config.secrete, {
          expiresIn: 86400,
        });
        return res.send({ auth: true, token: token });
      }
    }
  } catch (err) {
    console.log(err);
  }
});



//==========Find Employee using query params==============
route.get("/findEmployee", async (req, res, next) => {
  try {
    var query = {};
    if (req.query.firstName && req.query.lastName && req.query.employees) {
      query = {firstName: req.query.firstName, lastName: req.query.lastName,employees:req.query.employees};
    } else if (req.query.firstName) {
      query = { firstName: req.query.firstName };
    } else if (req.query.lastName) {
      query = { lastName: req.query.lastName };
    } else if (req.query.employees) {
      query = { employees: req.query.employees };
    }else{
      req.flash('info', 'Employee does not exists')
    }
    const token = req.headers["x-access-token"];
    if (token) {
      let emp = await Employee.find(query, { __v: 0 })
        .populate("employees", {
          firstName: 1,
          lastName: 1,
          organizationName: 1,
          email: 1,
        })
        .sort({
          firstName: 1,
          lastName: 1,
          email: 1,
          employees: 1,
          organizationName: 1,
        });
        if(emp){
          return res.send(emp);
        }else{ 
          res.send({ messages: req.flash('info')})
        }
      
    } else {
      return res.send("please login");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
