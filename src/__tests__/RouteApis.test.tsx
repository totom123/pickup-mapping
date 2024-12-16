import { expect, vi } from "vitest";
import { onGetRouteByToken, onPostRoute } from "../services/routeApis";

describe("Route apis", () => {
  const setup = () => {
    vi.clearAllMocks();
    const mocks = vi.hoisted(() => ({
      axiosPost: vi.fn(),
      axiosGet: vi.fn(),
    }));
    // @ts-expect-error mock api
    vi.mock(import("axios"), async (importOriginal) => {
      const actual = await importOriginal();
      return {
        default: {
          ...actual.default,
          post: mocks.axiosPost,
          get: mocks.axiosGet,
        },
      };
    });
    return { mocks };
  };
  describe("onPostRoute Api", () => {
    it("should call onPostRoute by correct param", async () => {
      const { mocks } = setup();
      vi.mocked(mocks.axiosPost).mockResolvedValue({
        data: { token: "fake-token" },
      });
      const res = await onPostRoute("HK", "LA");
      expect(mocks.axiosPost).toBeCalledTimes(1);
      expect(mocks.axiosPost).toBeCalledWith(
        "https://sg-mock-api.lalamove.com/route",
        { origin: "HK", destination: "LA" }
      );
      expect(res).toEqual("fake-token");
    });

    it("should will retry onPostRoute when fail", async () => {
      const { mocks } = setup();
      const mockErr = new Error("mock error");
      vi.mocked(mocks.axiosPost).mockRejectedValueOnce(mockErr);
      vi.mocked(mocks.axiosPost).mockResolvedValueOnce({
        data: { token: "fake-token" },
      });
      const res = await onPostRoute("HK", "LA");
      expect(mocks.axiosPost).toBeCalledTimes(2);
      expect(res).toEqual("fake-token");
    });
    it("should retry onPostRoute max 3 times", async () => {
      const { mocks } = setup();
      const mockErr = new Error("mock error");
      vi.mocked(mocks.axiosPost).mockRejectedValue(mockErr);
      try {
        await onPostRoute("HK", "LA");
      } catch (err) {
        expect(err === mockErr).toBeTruthy();
      }
      expect(mocks.axiosPost).toBeCalledTimes(4);
    });
  });

  describe("onGetRouteByToken", () => {
    it("should call onGetRouteByToken by correct param", async () => {
      const { mocks } = setup();

      vi.mocked(mocks.axiosGet).mockResolvedValue({
        data: { path: 123 },
      });
      const res = await onGetRouteByToken("13456723464");
      expect(mocks.axiosGet).toBeCalledTimes(1);
      expect(mocks.axiosGet).toBeCalledWith(
        "https://sg-mock-api.lalamove.com/route/13456723464"
      );
      expect(res).toEqual({ path: 123 });
    });

    it("should will retry onGetRouteByToken when fail", async () => {
      const { mocks } = setup();

      const mockErr = new Error("mock error");
      vi.mocked(mocks.axiosGet).mockRejectedValueOnce(mockErr);
      vi.mocked(mocks.axiosGet).mockResolvedValueOnce({
        data: { path: 123 },
      });
      const res = await onGetRouteByToken("13456723464");
      expect(mocks.axiosGet).toBeCalledTimes(2);
      expect(res).toEqual({ path: 123 });
    });
    it("should will retry onGetRouteByToken when receive in progress status", async () => {
      const { mocks } = setup();

      vi.mocked(mocks.axiosGet).mockResolvedValueOnce({
        data: { status: "in progress" },
      });
      vi.mocked(mocks.axiosGet).mockResolvedValueOnce({
        data: { status: "success", path: 123 },
      });
      const res = await onGetRouteByToken("13456723464");
      expect(mocks.axiosGet).toBeCalledTimes(2);
      expect(res).toEqual({ status: "success", path: 123 });
    });
    it("should retry onGetRouteByToken max 3 times", async () => {
      const { mocks } = setup();

      const mockErr = new Error("mock error");
      vi.mocked(mocks.axiosGet).mockRejectedValue(mockErr);
      try {
        await onGetRouteByToken("13456723464");
      } catch (err) {
        expect(err === mockErr).toBeTruthy();
      }
      expect(mocks.axiosGet).toBeCalledTimes(4);
    });
  });
});
