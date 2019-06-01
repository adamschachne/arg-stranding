import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import Theme from "./components/Theme";
import { SettingsProvider } from "./components/Settings/SettingsContext";

ReactDOM.render(
  <BrowserRouter>
    <SettingsProvider>
      <Theme>
        <App />
      </Theme>
    </SettingsProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
