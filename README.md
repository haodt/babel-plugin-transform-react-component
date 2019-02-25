# Transform React Component

Remove side effect on react component by wrapping it in an iife

- Before transpile stateful component

```jsx
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
  spoon: "hello"
};
```

- After transpile

```js
"use strict";

// Interop require codes

var Tea =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Tea, _React$Component);

  function Tea() {
    _classCallCheck(this, Tea);

    return _possibleConstructorReturn(this, _getPrototypeOf(Tea).apply(this, arguments));
  }

  _createClass(Tea, [{
    key: "render",
    value: function render() {
      var spoon = this.props.spoon;
      return _react.default.createElement("h1", null, "hello");
    }
  }]);

  Tea.propTypes = {
    spoon: _propTypes.default.string
  }
  Tea.defaultProps = {
    spoon: "hello"
  }
  return Tea;
}(_react.default.Component);
```

- Before transpile stateless component

```jsx
import React from "react";
import PropTypes from "prop-types";

const Team = ({ label }) => <h1>Hello</h1>;

Team.propTypes = {
  spoon: propTypes.string
};

Team.defaultProps = {
  spoon: "hello"
};

```

- After transpile

```js
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
```
