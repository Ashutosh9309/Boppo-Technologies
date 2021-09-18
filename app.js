const express = require("express");
const app = express();
const PORT = process.env.PORT || 9700;
const mongodb = require("./config/db");
const session = require('express-session');
;
const flash = require('connect-flash')
//========middleware for parsing a data=======
app.use(express.urlencoded({ extended: true })),
app.use(express.json());

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))


app.use(require('connect-flash')());
app.use(function (req, res, next){
  res.locals.messages = require('express-message')(req, res);
  next();
});

//============Routes==============
app.use("/", require("./controller/indexRoute"));

mongodb();
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${PORT}`);
});
