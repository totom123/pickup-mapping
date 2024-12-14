import { Autocomplete, StandaloneSearchBox } from "@react-google-maps/api";
import { TextField } from "@mui/material";

interface ISearchLocationBox {
  inputRef: React.RefObject<HTMLInputElement>;
  id: string;
  label: string;
  disabled?: boolean;
}

const SearchLocationBox = ({
  inputRef,
  id,
  label,
  disabled = false,
}: ISearchLocationBox) => {
  return (
    <Autocomplete restrictions={{ country: "HK" }}>
      <TextField
        inputRef={inputRef}
        id={id}
        label={label}
        variant="outlined"
        sx={{ mb: "30px", width: "100%" }}
        disabled={disabled}
      />
    </Autocomplete>
  );
};
export default SearchLocationBox;
