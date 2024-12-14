import React from "react";
import "./App.css";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MainMap from "./components/MainMap";
import { Box, TextField } from "@mui/material";
import LocationForm from "./components/LocationForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ height: "100vh" }} className="App">
        <MainMap />
      </Box>
    </QueryClientProvider>
  );
}

export default App;
