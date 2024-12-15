import { Box, Typography } from "@mui/material";
import { IGetRouteResSuccess } from "../services/routeApis";

const PathDesc = ({ pathValue }: { pathValue?: IGetRouteResSuccess }) =>
  pathValue ? (
    <Box mb="25px">
      <Typography variant="body1">{`Total Distance: ${pathValue.total_distance}`}</Typography>
      <Typography variant="body1">{`Total Time: ${pathValue.total_time}`}</Typography>
    </Box>
  ) : null;
export default PathDesc;
