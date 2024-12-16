import { Autocomplete } from "@react-google-maps/api";
import { TextField } from "@mui/material";

interface ISearchLocationBox {
  id: string;
  label: string;
  disabled?: boolean;
}

const SearchLocationBox = ({
  id,
  label,
  disabled = false,
}: ISearchLocationBox) => {
  return (
    <Autocomplete restrictions={{ country: "HK" }}>
      <TextField
        id={id}
        name={id}
        label={label}
        variant="outlined"
        sx={{ mb: "30px", width: "100%" }}
        disabled={disabled}
      />
    </Autocomplete>
  );
};
export default SearchLocationBox;
