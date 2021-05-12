import React from "react";

interface WithPathProps {
  exact: boolean;
  pathname: string;
}

const withPath = <P extends object>(Component: React.ComponentType<P>) => {
  return class WithPath extends React.PureComponent<P & WithPathProps> {
    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Component {...(this.props as P)} />;
    }
  };
};

export default withPath;
