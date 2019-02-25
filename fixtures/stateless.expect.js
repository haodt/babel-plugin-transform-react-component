"use strict";

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Team = (() => {
  function Team(_ref) {
    var label = _ref.label;
    return _react.default.createElement("h1", null, "Hello");
  }

  Team.propTypes = {
    spoon: propTypes.string
  }
  Team.defaultProps = {
    spoon: "hello"
  }
  return Team;
})();