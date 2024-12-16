import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { HK_CENTER } from "../constants/geo";
import LocationForm from "./LocationForm";
import {
  IGetRouteResSuccess,
  onGetRouteByToken,
  onPostRoute,
} from "../services/routeApis";
import { enqueueSnackbar } from "notistack";
import { isAxiosError } from "axios";
import useGoMap from "../hooks/useGoMap";
import useGoLine from "../hooks/useGoLine";

const MainMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
    libraries: ["maps", "places"],
  });
  const { mapObj, onLoadMap, onUnmountMap } = useGoMap();
  const { pathObj, onLoadPath, onUnmontPath } = useGoLine();
  const [isLoading, setIsLoading] = useState(false);
  const [pathValue, setPathValue] = useState<IGetRouteResSuccess | undefined>();
  const [submitedLocations, setSubmitedLocations] = useState<
    string[] | undefined
  >();
  const onReset = () => {
    setPathValue(undefined);
    pathObj?.setPath([]);
    setSubmitedLocations(undefined);
  };

  const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    try {
      evt.preventDefault();
      setIsLoading(true);
      const fd = new FormData(evt.target as HTMLFormElement);
      const startVal = fd.get("startPoint")?.toString();
      const endVal = fd.get("endPoint")?.toString();
      if (!startVal || !endVal) {
        enqueueSnackbar("Please select starting locatiion and Drop-off-point", {
          variant: "error",
        });
        return;
      }
      const token = await onPostRoute(startVal, endVal);
      if (!token) {
        throw new Error("Route token not found, please try again later.");
      }
      const res = await onGetRouteByToken(token);
      if (res.status === "failure") {
        throw new Error(res.error);
      }
      setPathValue(res);
      setSubmitedLocations([startVal, endVal]);
      if (mapObj) {
        const allPoints = new window.google.maps.LatLngBounds();
        res.path.forEach((p) => allPoints.extend({ lat: +p[0], lng: +p[1] }));
        mapObj.fitBounds(allPoints);
      }
      if (pathObj) {
        pathObj.setPath(res.path.map((p) => ({ lat: +p[0], lng: +p[1] })));
      }
    } catch (err) {
      let errMsg = "";
      if (isAxiosError(err)) {
        errMsg = "Internal server error, please try again later.";
      } else if (err instanceof Error) {
        errMsg = err.message;
      } else {
        errMsg = "Unknown error, please try again later.";
      }
      enqueueSnackbar(errMsg, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // if (!isLoaded) {
  //   return null;
  // }

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        onLoad={onLoadMap}
        onUnmount={onUnmountMap}
        center={HK_CENTER}
        id="google-map-container"
      >
        <LocationForm
          isLoading={isLoading}
          onReset={onReset}
          onSubmit={onSubmit}
          pathValue={pathValue}
          submitedLocations={submitedLocations}
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
    )
  );
};

export default MainMap;
