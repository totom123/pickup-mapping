import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import SearchLocationBox from "./SearchLocationBox";

const HK_CENTER = { lat: 22.302711, lng: 114.177216 };
const LocationForm = () => {
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  return (
    <Card
      sx={{
        position: "absolute",
        width: "300px",
        background: "#fff",
        left: "100px",
        top: "200px",
        padding: "30px 30px",
        textAlign: "left",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const startVal = startInputRef?.current?.value;
          const endVal = endInputRef?.current?.value;
          console.log({ startVal, endVal });
        }}
      >
        <Typography variant="h4" mb="30px" fontWeight="bold">
          Find the path
        </Typography>
        <SearchLocationBox
          inputRef={startInputRef}
          id="start"
          label="Starting location"
        />
        <SearchLocationBox
          inputRef={endInputRef}
          id="end"
          label="Drop-off point"
        />
        <Box mt="10px">
          <Button type="submit" variant="contained">
            Submit
          </Button>
          <Button type="submit" variant="text">
            Reset
          </Button>
        </Box>
      </form>
    </Card>
  );
};
export default LocationForm;
