import React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { List, AutoSizer } from "react-virtualized";

export default class DemoList extends React.Component {
  handleScroll = (e) => {
    // eslint-disable-next-line
    this.list.Grid._onScroll(e);
  };

  componentDidMount = () => {
    // eslint-disable-next-line
    this.list.Grid._scrollingContainer = this.scroll.view;
  };

  componentWillUnmount = () => {
    // this.scroll.
  };

  render() {
    console.log("render");
    return (
      <AutoSizer>
        {({ height, width }) => {
          return (
            <Scrollbars
              ref={(node) => {
                this.scroll = node;
              }}
              onScroll={this.handleScroll}
              style={{ height, width }}
            >
              <List
                {...this.props}
                width={width}
                height={height}
                style={{ overflowX: "visible", overflowY: "visible" }}
                ref={(node) => {
                  this.list = node;
                }}
              />
            </Scrollbars>
          );
        }}
      </AutoSizer>
    );
  }
}
