import React from "react";
import "./App.css";
import MainMap from "./components/MainMap";
import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";

// Create a client
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Box sx={{ height: "100vh" }} className="App">
          <MainMap />
        </Box>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
