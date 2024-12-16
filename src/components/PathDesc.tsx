import { Box, Typography } from "@mui/material";
import { IGetRouteResSuccess } from "../services/routeApis";

function showDistance(m: number) {
  if (m >= 1000) {
    const distanceInKm = (m / 1000).toFixed(2);
    return `${distanceInKm} km`;
  } else {
    return `${m} m`;
  }
}
function showTime(sec: number) {
  if (sec >= 3600) {
    // Convert to hours
    const hours = Math.floor(sec / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (sec >= 60) {
    // Convert to minutes
    const minutes = Math.floor(sec / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else {
    // Return seconds
    return `${sec} second${sec !== 1 ? "s" : ""}`;
  }
}

const PathDesc = ({ pathValue }: { pathValue?: IGetRouteResSuccess }) =>
  pathValue ? (
    <Box mb="25px">
      <Typography variant="body1">{`Total Distance: ${showDistance(pathValue.total_distance)}`}</Typography>
      <Typography variant="body1">{`Total Time: ${showTime(pathValue.total_time)}`}</Typography>
    </Box>
  ) : null;
export default PathDesc;
