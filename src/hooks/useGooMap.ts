import { useCallback, useState } from "react";
import { HK_CENTER, HK_PLACE_ID } from "../constants/geo";

const useGooMap = () => {
  const [mapObj, setMapObj] = useState<google.maps.Map | undefined>();
  const onLoadMap = useCallback(async (map: google.maps.Map) => {
    let hkBounds;
    try {
      const geo = new window.google.maps.Geocoder();
      const hkGeo = await geo.geocode({ placeId: HK_PLACE_ID });
      hkBounds = hkGeo.results[0].geometry.bounds;
    } catch (err) {
      console.error(err);
    }
    const bounds = new window.google.maps.LatLngBounds(HK_CENTER);
    map.fitBounds(hkBounds ?? bounds);
    map.setZoom(12);
    setMapObj(map);
  }, []);
  const onUnmountMap = useCallback(() => {
    setMapObj(undefined);
  }, []);
  return { mapObj, onLoadMap, onUnmountMap };
};

export default useGooMap;
