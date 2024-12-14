import React, { useCallback } from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};
const HK_CENTER = { lat: 22.3479204, lng: 114.0603951 };

const MainMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds(HK_CENTER);
    map.fitBounds(bounds);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={HK_CENTER}
      zoom={13}
      onLoad={onLoad}
    >
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
