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
import PathTitle from "./PathTitle";
import PathDesc from "./PathDesc";

interface ILocationForm {
  pathValue?: IGetRouteResSuccess;
  setPathValue: React.Dispatch<
    React.SetStateAction<IGetRouteResSuccess | undefined>
  >;
  mapObj?: google.maps.Map;
  pathObj?: google.maps.Polyline;
}

const LocationForm = ({
  pathValue,
  setPathValue,
  mapObj,
  pathObj,
}: ILocationForm) => {
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitedLocations, setSubmitedLocations] = useState<
    string[] | undefined
  >();
  const onReset = () => {
    setPathValue(undefined);
    pathObj?.setPath([]);

    setSubmitedLocations(undefined);
    if (startInputRef?.current) startInputRef.current.value = "";
    if (endInputRef?.current) endInputRef.current.value = "";
  };

  const onSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    try {
      evt.preventDefault();
      setIsLoading(true);
      // setPathValue(undefined);
      // pathObj?.setPath([]);
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

  return (
    <Card
      sx={{
        position: "absolute",
        width: "380px",
        background: "#fff",
        left: "100px",
        top: "200px",
        padding: "30px 30px",
        textAlign: "left",
      }}
    >
      <form onSubmit={onSubmit}>
        {submitedLocations ? (
          <PathTitle start={submitedLocations[0]} end={submitedLocations[1]} />
        ) : (
          <Typography variant="h4" mb="30px" fontWeight="bold">
            Find the way
          </Typography>
        )}
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
        <PathDesc pathValue={pathValue} />
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
