"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _express = require("express");

var router = (0, _express.Router)();
router.get('/', function _callee(req, res) {
  var requests;
  return _regenerator["default"].async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.status(200);

          if (!req.query) {
            _context.next = 7;
            break;
          }

          _context.next = 4;
          return _regenerator["default"].awrap(req.context.models.Request.find(req.query));

        case 4:
          requests = _context.sent;
          _context.next = 10;
          break;

        case 7:
          _context.next = 9;
          return _regenerator["default"].awrap(req.context.models.Request.find());

        case 9:
          requests = _context.sent;

        case 10:
          return _context.abrupt("return", res.send(requests));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post('/', function _callee2(req, res) {
  var request, newRequest;
  return _regenerator["default"].async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          request = req.body;
          _context2.next = 3;
          return _regenerator["default"].awrap(req.context.models.Request.create({
            _id: request.id,
            movie_name: request.title,
            year: new Date(request.release_date).getFullYear(),
            status: 'pending',
            timestamp: new Date(),
            mediatype: request.media_type,
            backdrop_path: request.backdrop_path,
            poster_path: request.poster_path,
            overview: request.overview
          }));

        case 3:
          newRequest = _context2.sent;
          return _context2.abrupt("return", res.send({
            success: true,
            status: newRequest.status
          }));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.get('/update', function _callee3(req, res) {
  var requests, found;
  return _regenerator["default"].async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.status(200);
          _context3.next = 3;
          return _regenerator["default"].awrap(req.context.models.Request.find({
            status: 'pending'
          }));

        case 3:
          requests = _context3.sent;
          found = [];
          requests.forEach(function (r) {
            var plexDb = req.context.connectSql();
            var stmt = plexDb.prepare("SELECT title, year, guid FROM metadata_items\n        WHERE title = ? AND duration IS NOT NULL");
            var availableMatch = stmt.get(r.movie_name);
            plexDb.close();

            if (availableMatch) {
              var regex = /themoviedb:\/\/(.*)\?/gm;
              var match = regex.exec(availableMatch.guid);
              var group = match ? match[1] : null;

              if (r.year === availableMatch.year || group === r._id) {
                // if match in the plexdb by title, check against the stored year or check against the tmdb id
                r.status = 'complete';
                r.save();
                found = [].concat((0, _toConsumableArray2["default"])(found), [availableMatch]);
              }
            }
          });

          if (!(found.length > 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.send(found));

        case 10:
          return _context3.abrupt("return", res.send({
            message: 'no updates',
            status: 'complete'
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});
router.put('/:id', function _callee4(req, res) {
  var id, filter, update, match;
  return _regenerator["default"].async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          filter = {
            _id: id
          };
          update = req.body;
          match = req.context.models.Request.findOneAndUpdate(filter, update, {
            useFindAndModify: false,
            "new": true
          }, function (err, result) {
            if (err) console.error(err);
            console.log(result);
          });
          return _context4.abrupt("return", res.status(200).send({
            status: 'ok'
          }));

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
});
router["delete"]('/:id', function _callee5(req, res) {
  var isLoggedIn, idToDelete, deleted;
  return _regenerator["default"].async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          isLoggedIn = req.body.admin === process.env.ADMIN_TOKEN;
          idToDelete = req.params.id;

          if (!isLoggedIn) {
            _context5.next = 13;
            break;
          }

          _context5.next = 5;
          return _regenerator["default"].awrap(req.context.models.Request.deleteOne({
            _id: idToDelete
          }));

        case 5:
          deleted = _context5.sent;

          if (!(deleted.deletedCount === 1)) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.send({
            deleted: true,
            message: "deleted entry where _id = ".concat(idToDelete)
          }));

        case 10:
          return _context5.abrupt("return", res.send({
            status: 'ERROR',
            message: "id ".concat(idToDelete, " not found in database"),
            deleted: false
          }));

        case 11:
          _context5.next = 14;
          break;

        case 13:
          return _context5.abrupt("return", res.send({
            status: 'ERROR',
            message: 'Authentication failed'
          }));

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  });
});
var _default = router;
exports["default"] = _default;