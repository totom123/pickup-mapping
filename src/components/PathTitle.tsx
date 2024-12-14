import { Typography } from "@mui/material";
import { truncate } from "lodash";

const PathTitle = ({ start, end }: { start: string; end: string }) => (
  <Typography variant="h5" mb="30px">
    <Typography component="span" variant="h5" fontWeight="bold" title={start}>
      {truncate(start, {
        length: 25,
        separator: /,? +/,
      })}
    </Typography>{" "}
    to{" "}
    <Typography component="span" variant="h5" fontWeight="bold" title={end}>
      {truncate(end, {
        length: 25,
        separator: /,? +/,
      })}
    </Typography>
  </Typography>
);
export default PathTitle;
