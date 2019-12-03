"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = _interopRequireDefault(require("express"));

var _axios = _interopRequireDefault(require("axios"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var router = (0, _express["default"])();
router.get('/', function _callee2(req, res) {
  var tmdbRes, returnedResponse;
  return _regenerator["default"].async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!req.query.q) {
            _context2.next = 11;
            break;
          }

          _context2.next = 3;
          return _regenerator["default"].awrap(_axios["default"].get(process.env.TMDB_SEARCH_URL, {
            params: {
              api_key: process.env.TMDB_API_KEY,
              query: req.query.q
            }
          }));

        case 3:
          tmdbRes = _context2.sent;
          _context2.next = 6;
          return _regenerator["default"].awrap(Promise.all(tmdbRes.data.results.map(function _callee(tmdb) {
            var pendingMatch, plexDb, stmt, year, availableMatch, _stmt, _year, _availableMatch, seasons;

            return _regenerator["default"].async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return _regenerator["default"].awrap(req.context.models.Request.findOne({
                      _id: tmdb.id
                    }));

                  case 2:
                    pendingMatch = _context.sent;

                    if (!tmdb.title) {
                      _context.next = 11;
                      break;
                    }

                    plexDb = req.context.connectSql();
                    stmt = plexDb.prepare("SELECT title FROM metadata_items\n                WHERE title = ? AND year = ?");
                    year = Number(new Date(tmdb.release_date).getFullYear());
                    availableMatch = stmt.get(tmdb.title, year);
                    plexDb.close();

                    if (!availableMatch) {
                      _context.next = 11;
                      break;
                    }

                    return _context.abrupt("return", _objectSpread({}, tmdb, {
                      status: 'Available'
                    }));

                  case 11:
                    if (!tmdb.name) {
                      _context.next = 24;
                      break;
                    }

                    plexDb = req.context.connectSql();
                    _stmt = plexDb.prepare("SELECT title, id, [index] FROM metadata_items WHERE title = ? AND year = ?");
                    _year = Number(new Date(tmdb.first_air_date).getFullYear());
                    _availableMatch = _stmt.get(tmdb.name, _year);

                    if (!_availableMatch) {
                      _context.next = 23;
                      break;
                    }

                    _stmt = plexDb.prepare("SELECT [index] FROM metadata_items WHERE parent_id = ?");
                    seasons = _stmt.all(_availableMatch.id).map(function (s) {
                      return s.index;
                    }).sort(function (a, b) {
                      return a - b;
                    });
                    plexDb.close();
                    return _context.abrupt("return", _objectSpread({}, tmdb, {
                      status: 'Available',
                      seasons: seasons
                    }));

                  case 23:
                    plexDb.close();

                  case 24:
                    if (!pendingMatch) {
                      _context.next = 26;
                      break;
                    }

                    return _context.abrupt("return", _objectSpread({}, tmdb, {
                      status: pendingMatch.status
                    }));

                  case 26:
                    return _context.abrupt("return", tmdb);

                  case 27:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 6:
          returnedResponse = _context2.sent;
          tmdbRes.data.results = returnedResponse;
          res.status(200).send(tmdbRes.data);
          _context2.next = 12;
          break;

        case 11:
          res.send({
            success: false,
            message: "Include search parameter 'q' in url with a search term."
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
});
var _default = router;
exports["default"] = _default;