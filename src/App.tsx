import React from "react";
import "./App.css";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MainMap from "./components/MainMap";
import { Box } from "@mui/material";

function App() {
  return (
    <div className="App">
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: "300px", background: "red" }}></Box>
        <Box sx={{ flex: 1 }}>
          <MainMap />
        </Box>
      </Box>
    </div>
  );
}

export default App;
