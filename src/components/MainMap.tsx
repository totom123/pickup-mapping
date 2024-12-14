import React, { useCallback, useRef } from "react";
import {
  GoogleMap,
  MapContext,
  Polyline,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { HK_CENTER } from "../constants/geo";
import LocationForm from "./LocationForm";

const MainMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: ["maps", "places"],
  });
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds(HK_CENTER);
    map.fitBounds(bounds);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100%",
      }}
      center={HK_CENTER}
      zoom={13}
      onLoad={onLoad}
    >
      <LocationForm />
      {/* <Polyline
        options={{
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 3,
        }}
        path={[
          { lat: 22.3393166, lng: 114.1355741 },
          { lat: 22.3793166, lng: 114.1355741 },
        ]}
      /> */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MainMap;
