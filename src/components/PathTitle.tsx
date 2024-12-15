import { Typography } from "@mui/material";
import { truncate } from "lodash";

function toTrun(text: string) {
  return truncate(text, {
    length: 25,
    separator: /,? +/,
  });
}

const PathTitle = ({ start, end }: { start: string; end: string }) => (
  <Typography variant="h5" mb="30px" data-testid="PathTitle">
    <Typography component="span" variant="h5" fontWeight="bold" title={start}>
      {toTrun(start)}
    </Typography>{" "}
    to{" "}
    <Typography component="span" variant="h5" fontWeight="bold" title={end}>
      {toTrun(end)}
    </Typography>
  </Typography>
);
export default PathTitle;
