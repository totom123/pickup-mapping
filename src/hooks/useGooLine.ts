import { useCallback, useState } from "react";

const useGooLine = () => {
  const [pathObj, setPathObj] = useState<google.maps.Polyline | undefined>();
  const onLoadPath = useCallback((path: google.maps.Polyline) => {
    setPathObj(path);
  }, []);
  const onUnmontPath = useCallback(() => {
    setPathObj(undefined);
  }, []);
  return { pathObj, onLoadPath, onUnmontPath };
};

export default useGooLine;
