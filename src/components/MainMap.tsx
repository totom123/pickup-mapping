import React, { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  MapContext,
  Marker,
  Polyline,
  PolylineF,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { HK_CENTER } from "../constants/geo";
import LocationForm from "./LocationForm";
import { IGetRouteResSuccess } from "../services/routeApis";

const MainMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: ["maps", "places"],
  });
  const [mapObj, setMapObj] = useState<google.maps.Map | undefined>();
  const [pathObj, setPathObj] = useState<google.maps.Polyline | undefined>();
  const onLoadMap = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(HK_CENTER);
    map.fitBounds(bounds);
    setTimeout(() => map.setZoom(12), 100);
    setMapObj(map);
  }, []);
  const onLoadPath = useCallback((path: google.maps.Polyline) => {
    setPathObj(path);
  }, []);
  const onUnmontPath = useCallback((path: google.maps.Polyline) => {
    setPathObj(undefined);
  }, []);
  const onUnmountMap = useCallback((map: google.maps.Map) => {
    setMapObj(undefined);
  }, []);

  const [pathValue, setPathValue] = useState<IGetRouteResSuccess | undefined>();

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100%",
      }}
      onLoad={onLoadMap}
      onUnmount={onUnmountMap}
      center={HK_CENTER}
    >
      <LocationForm
        setPathValue={setPathValue}
        mapObj={mapObj}
        pathObj={pathObj}
        pathValue={pathValue}
      />
      <Polyline
        options={{
          strokeColor: "#000000",
          strokeWeight: 5,
        }}
        onLoad={onLoadPath}
        onUnmount={onUnmontPath}
      />
      {pathValue?.path
        ? pathValue.path.map((p, idx) => (
            <Marker
              key={p[0] + p[1]}
              position={{ lat: +p[0], lng: +p[1] }}
              label={(idx + 1).toString()}
            />
          ))
        : null}
    </GoogleMap>
  ) : null;
};

export default MainMap;
