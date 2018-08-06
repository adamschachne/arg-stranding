import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './menu.css';

class Menu extends Component {

  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <div className={"menu-bar"}>
        {/* {this.props.render(this.props.nodes)} */}
        {this.props.children}
      </div>
    );
  }
}

Menu.propTypes = {
  // nodes: PropTypes.array.isRequired,
  // render: PropTypes.func.isRequired,
  children: PropTypes.element
}

export default Menu;
