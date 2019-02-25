import React from "react";
import PropTypes from "prop-types";

function Team({ label }) {
  return <h1>Hello</h1>;
}

Team.propTypes = {
  spoon: PropTypes.string
};

Team.defaultProps = {
  spoon: "hello"
};
