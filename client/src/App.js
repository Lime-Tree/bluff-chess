import "./App.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001", {
  withCredentials: true,
  extraHeaders: { "my-custom-header": "abcd" },
});

function App() {
  useEffect(() => {
    socket.emit("stuff");
  });

  return <div className="App"></div>;
}

export default App;
