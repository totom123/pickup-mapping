import {
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchLocationBox from "./SearchLocationBox";
import { IGetRouteResSuccess } from "../services/routeApis";
import PathTitle from "./PathTitle";
import PathDesc from "./PathDesc";

interface ILocationForm {
  onSubmit: (evt: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onReset: () => void;
  isLoading: boolean;
  pathValue?: IGetRouteResSuccess;
  submitedLocations?: string[];
}

const LocationForm = ({
  pathValue,
  submitedLocations,
  onSubmit,
  onReset,
  isLoading,
}: ILocationForm) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Card
      sx={{
        position: "absolute",
        background: "#fff",
        padding: "30px 30px",
        textAlign: "left",
        boxSizing: "border-box",
        ...(isMobile
          ? { width: "100vw", left: "0", top: "auto", bottom: "0" }
          : { width: "380px", left: "100px", top: "200px" }),
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
          id="startPoint"
          label="Starting location"
          disabled={isLoading}
        />
        <SearchLocationBox
          id="endPoint"
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
            type="reset"
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
