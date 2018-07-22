import React from 'react';
import PropTypes from "prop-types";

const Button = ({click, disabled, node}) => (
  <button
    style={{marginLeft: "10px"}}
    onClick={click}
    disabled={disabled}
  >
    {node}
  </button>
);

Button.propTypes = {
  node: PropTypes.string,
  click: PropTypes.func,
  disabled: PropTypes.bool
}

export default Button;