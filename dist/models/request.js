"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var RequestSchema = new _mongoose["default"].Schema({
  _id: String,
  movie_name: String,
  year: String,
  status: String,
  timestamp: Object,
  mediatype: String,
  backdrop_path: String,
  poster_path: String,
  overview: String
}, {
  collection: 'requests'
});

var Request = _mongoose["default"].model('Request', RequestSchema);

var _default = Request;
exports["default"] = _default;