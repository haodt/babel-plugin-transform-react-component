import React from "react";
import PropTypes from "prop-types";

const Team = (() => {
  function Team(_ref) {
    var label = _ref.label;
    return React.createElement("h1", null, "Hello");
  }

  Team.propTypes = {
    spoon: PropTypes.string
  }
  Team.defaultProps = {
    spoon: "hello"
  }
  return Team;
})();