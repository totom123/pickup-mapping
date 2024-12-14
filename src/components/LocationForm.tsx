import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { useRef, useState } from "react";
import SearchLocationBox from "./SearchLocationBox";
import {
  IGetRouteResSuccess,
  onGetRouteByToken,
  onPostRoute,
} from "../services/routeApis";
import { enqueueSnackbar } from "notistack";
import { HK_CENTER } from "../constants/geo";

interface ILocationForm {
  setPathValue: React.Dispatch<
    React.SetStateAction<IGetRouteResSuccess | undefined>
  >;
  mapObj?: google.maps.Map;
  pathObj?: google.maps.Polyline;
}

const LocationForm = ({ setPathValue, mapObj, pathObj }: ILocationForm) => {
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const onReset = () => {
    setPathValue(undefined);
    pathObj?.setPath([]);
    if (startInputRef?.current) startInputRef.current.value = "";
    if (endInputRef?.current) endInputRef.current.value = "";
  };

  const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      setPathValue(undefined);
      evt.preventDefault();
      const startVal = startInputRef?.current?.value;
      const endVal = endInputRef?.current?.value;
      if (!startVal || !endVal) {
        enqueueSnackbar("Please select starting locatiion and Drop-off-point", {
          variant: "error",
        });
        return;
      }
      const token = await onPostRoute(startVal, endVal);
      const res = await onGetRouteByToken(token);
      if (res.status === "failure") {
        throw new Error(res.error);
      }
      setPathValue(res);
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
      <form onSubmit={onSubmit}>
        <Typography variant="h4" mb="30px" fontWeight="bold">
          Find the way
        </Typography>
        <SearchLocationBox
          inputRef={startInputRef}
          id="start"
          label="Starting location"
          disabled={isLoading}
        />
        <SearchLocationBox
          inputRef={endInputRef}
          id="end"
          label="Drop-off point"
          disabled={isLoading}
        />
        <Box>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ height: "40px", width: "100px", mr: "20px" }}
          >
            {isLoading ? <CircularProgress size={20} /> : "Submit"}
          </Button>
          <Button
            type="button"
            variant="text"
            disabled={isLoading}
            onClick={onReset}
          >
            Reset
          </Button>
        </Box>
      </form>
    </Card>
  );
};
export default LocationForm;
