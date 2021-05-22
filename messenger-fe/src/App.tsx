import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "antd/dist/antd.css";
import Lobby from "./Lobby";
import Chat from "./Chat";
import Welcome from "./Welcome";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/">
          <Lobby />
        </Route>
        <Route path="/chat/:id">
          <Chat />
        </Route>
        <Route path="/welcome">
          <Welcome />
        </Route>
      </Router>
    </div>
  );
}

export default App;
