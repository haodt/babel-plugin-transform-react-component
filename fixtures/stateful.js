import React from "react";
import PropTypes from "prop-types";

class Tea extends React.Component {
  render() {
    const { spoon } = this.props;
    return <h1>hello</h1>;
  }
}

Tea.propTypes = {
  spoon: PropTypes.string
};

Tea.defaultProps = {
  spoon: <label>test</label>
};
