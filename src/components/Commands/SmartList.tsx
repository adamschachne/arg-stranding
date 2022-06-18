import React, { Component } from "react";
// @ts-ignore
import Scrollbars from "react-custom-scrollbars";
import { List, ListProps } from "react-virtualized/dist/es/List";

interface Props extends ListProps {
  renderThumbVertical?: React.FC;
}

class SmartList extends Component<Props> {
  list: List | null = null;

  handleScroll = ({ target }: React.UIEvent<any>) => {
    // @ts-ignore
    const { scrollTop, scrollLeft } = target;
    if (this.list) {
      const { Grid: grid } = this.list;
      grid!.handleScrollEvent({ scrollTop, scrollLeft });
    }
  };

  render() {
    const { width, height } = this.props;

    return (
      <Scrollbars
        // @ts-ignore
        renderThumbVertical={({ style, ...props }) => (
          <div style={{ ...style, backgroundColor: "blue" }} />
        )}
        style={{ width, height }}
        onScroll={this.handleScroll}
      >
        <List
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...this.props}
          ref={(instance) => {
            this.list = instance;
          }}
          style={{
            overflowX: "visible",
            overflowY: "visible"
          }}
        />
      </Scrollbars>
    );
  }
}

export default SmartList;
