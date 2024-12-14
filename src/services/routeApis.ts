import axios from "axios";
import pRetry from "p-retry";

export interface IGetRouteResSuccess {
  status: "success";
  path: string[][];
  total_distance: number;
  total_time: number;
}
interface IGetRouteResFailure {
  status: "failure";
  error: string;
}
interface IGetRouteResInProgress {
  status: "in progress";
}
type IGetRouteRes =
  | IGetRouteResSuccess
  | IGetRouteResFailure
  | IGetRouteResInProgress;
const BASE_URL = "https://sg-mock-api.lalamove.com";
const RETRY_TIME = 5;

export const onPostRoute = (origin: string, destination: string) => {
  const fetchFn = async () => {
    const res = await axios.post<{ token: string }>(`${BASE_URL}/route`, {
      origin,
      destination,
    });
    if (!res.data.token) {
      throw new Error("No Valid Token");
    }
    return res.data.token;
  };

  return pRetry(fetchFn, { retries: RETRY_TIME });
};
export const onGetRouteByToken = (token: string) => {
  const fetchFn = async () => {
    const res = await axios.get<IGetRouteRes>(`${BASE_URL}/route/${token}`);
    if (res.data.status === "in progress") {
      console.log("in progress");
      throw new Error("System busy, please try again later");
    }
    return res.data;
  };

  return pRetry(fetchFn, { retries: RETRY_TIME });
};
