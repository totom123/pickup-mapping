import { useCallback, useState } from "react";
import { HK_CENTER } from "../constants/geo";

const useGoMap = () => {
  const [mapObj, setMapObj] = useState<google.maps.Map | undefined>();
  const onLoadMap = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(HK_CENTER);
    map.fitBounds(bounds);
    setTimeout(() => map.setZoom(12), 100);
    setMapObj(map);
  }, []);
  const onUnmountMap = useCallback(() => {
    setMapObj(undefined);
  }, []);
  return { mapObj, onLoadMap, onUnmountMap };
};

export default useGoMap;
