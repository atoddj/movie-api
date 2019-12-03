"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.connectSql = exports.connectDb = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _betterSqlite = _interopRequireDefault(require("better-sqlite3"));

require("dotenv/config");

var _request = _interopRequireDefault(require("./request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var connectDb = function connectDb() {
  return _mongoose["default"].connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

exports.connectDb = connectDb;

var connectSql = function connectSql() {
  return new _betterSqlite["default"](process.env.PLEX_DB_PATH);
};

exports.connectSql = connectSql;
var models = {
  Request: _request["default"]
};
var _default = models;
exports["default"] = _default;