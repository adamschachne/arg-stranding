import React from "react";
import PropTypes from "prop-types";

function CompatibilityMessage({ show, loading }) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="search-message"
      style={{
        opacity: loading ? 1 : 0
      }}
    >
      There are some compatibility issues with Edge and IE
    </div>
  );
}
CompatibilityMessage.propTypes = {
  show: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired
};

export default CompatibilityMessage;
