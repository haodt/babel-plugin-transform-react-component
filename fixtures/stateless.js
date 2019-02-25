import React from "react";
import PropTypes from "prop-types";

const Team = ({ label }) => <h1>Hello</h1>;

Team.propTypes = {
  spoon: propTypes.string
};

Team.defaultProps = {
  spoon: "hello"
};
