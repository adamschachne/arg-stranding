import React, { Component } from 'react';
import Network from './Network/Network';
import Search from './Search/SearchBar';
// import Button from './button';

const RESIZE_DELAY = 100; // 100ms

class App extends Component {

  constructor(props) {
    super(props);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.resizeEnd = null;
    this.state = {
      dimensions: {
        width,
        height
      },
      focus: null,
      loading: true
    };

    this.searchRef = React.createRef();
    this.searchIsFocused = false;
  }

  resize = () => {
    console.log("resize");
    this.setState({
      dimensions: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  onResize = () => {
    clearTimeout(this.resizeEnd);
    this.resizeEnd = setTimeout(this.resize, RESIZE_DELAY);
  }

  onKeydown = event => {
    if (!this.searchIsFocused) {
      this.searchRef.current.focus();
    } else if (event.keyCode === 27) { // Esc      
      this.searchRef.current.blur();
    } else if (event.keyCode === 9) { // Tab      
      event.preventDefault();
      this.searchRef.current.blur();
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("keydown", this.onKeydown);
  }

  focusNode = (node) => {
    console.log("focusing ", node);
    this.setState({ focus: node });
  }

  unfocusNode = () => {
    console.log("unfocus");
    this.setState({ focus: null });
  }

  doneLoading = () => {
    this.setState({ loading: false });
  }

  interactNetwork = (event) => {
    if (event) {
      if (event.length === 1 && this.state.focus !== event[0]) {
        this.setState({ focus: event[0] });
      } else if (this.state.focus !== null) {
        this.setState({ focus: null });
      }
    }
    this.searchRef.current && this.searchRef.current.blur();
  }

  render() {
    const { width, height } = this.state.dimensions;
    return (
      <div style={{ width, height }}>
        <Network
          interactNetwork={this.interactNetwork}
          doneLoading={this.doneLoading}
          focus={this.state.focus}
          width={width}
          height={height}
        />
        <Search
          focus={() => {
            console.log("search in focus");
            this.searchIsFocused = true;
          }}
          blur={() => {
            console.log("search out of focus");
            this.searchIsFocused = false;
            this.searchRef.current.value = "";      
          }}
          innerRef={this.searchRef} 
        />
        {/* <div style={{ position: 'absolute', zIndex: '9999', bottom: "5px", left: "5px" }}>
          <p style={{textAlign: 'center'}}>Focus Test</p>
          <div>
            <Button
              click={() => this.focusNode("?4an3p8ptn")}
              disabled={this.state.focus === "?4an3p8ptn"}
              node="?4an3p8ptn"
            />
            <Button
              click={() => this.focusNode("?onethousandfivehundred")}
              disabled={this.state.focus === "?onethousandfivehundred"}
              node="?onethousandfivehundred"
            />
            <Button
              click={() => this.focusNode("?tearsinrain")}
              disabled={this.state.focus === "?tearsinrain"}
              node="?tearsinrain"
            />
            <Button
              click={() => this.focusNode("?thatgamecompany")}
              disabled={this.state.focus === "?thatgamecompany"}
              node="?thatgamecompany"
            />
          </div>
        </div> */}
      </div>
    );
  }
}

export default App;
