import { StandaloneSearchBox } from "@react-google-maps/api";
import { HK_CENTER } from "../constants/geo";
import { TextField } from "@mui/material";

interface ISearchLocationBox {
  inputRef: React.RefObject<HTMLInputElement>;
  id: string;
  label: string;
}

const SearchLocationBox = ({ inputRef, id, label }: ISearchLocationBox) => {
  const bounds = new google.maps.LatLngBounds({
    lat: HK_CENTER.lat,
    lng: HK_CENTER.lng,
  });
  return (
    <StandaloneSearchBox bounds={bounds}>
      <TextField
        inputRef={inputRef}
        id={id}
        label={label}
        variant="outlined"
        sx={{ mb: "30px", width: "100%" }}
      />
    </StandaloneSearchBox>
  );
};
export default SearchLocationBox;
