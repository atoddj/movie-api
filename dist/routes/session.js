"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var router = (0, _express.Router)();
router.get('/', function (req, res, next) {
  var isLoggedIn = false;

  if (req.query.admin) {
    isLoggedIn = req.query.admin === process.env.ADMIN_TOKEN;
  }

  res.status(200).send({
    isLoggedIn: isLoggedIn
  });
});
var _default = router;
exports["default"] = _default;