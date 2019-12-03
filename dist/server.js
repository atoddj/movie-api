"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _models = _interopRequireWildcard(require("./models"));

var _routes = _interopRequireDefault(require("./routes"));

require("dotenv/config");

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(function _callee(req, res, next) {
  return _regenerator["default"].async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          req.context = {
            models: _models["default"],
            connectSql: _models.connectSql
          };
          next();

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.get('/', function (req, res) {
  res.status(200).send({
    success: true
  });
});
app.use('/requests', _routes["default"].requests);
app.use('/search', _routes["default"].search);
app.use('/auth', _routes["default"].session);
app.use('/plex/latest', _routes["default"].latest);
(0, _models.connectDb)().then(function _callee2() {
  return _regenerator["default"].async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          app.listen(process.env.PORT, function () {
            console.log("app is listening to port ".concat(process.env.PORT));
          });

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
});