"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var RequestSchema = new _mongoose["default"].Schema({
  _id: String,
  movie_name: String,
  url: String,
  year: String,
  status: String,
  timestamp: Object,
  mediatype: String
}, {
  collection: 'requests'
});

var Request = _mongoose["default"].model('Request', RequestSchema);

var _default = Request;
exports["default"] = _default;