import React from "react";
import PropTypes from "prop-types";

const Team = ({ label }) => <h1>Hello</h1>;

Team.propTypes = {
  spoon: PropTypes.string
};

Team.defaultProps = {
  spoon: <label>test</label>
};
