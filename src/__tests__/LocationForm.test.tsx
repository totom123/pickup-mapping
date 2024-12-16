import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, expect, vi } from "vitest";
import App from "../App";

describe("Location Form Component", () => {
  const setup = () => {
    vi.clearAllMocks();
    const uiUtils = render(<App />);
    const submitBtn = screen.getByRole<HTMLButtonElement>("button", {
      name: "Submit",
    });
    const startInput = screen.getByLabelText("Starting location");
    const endInput = screen.getByLabelText("Drop-off point");
    const mocks = vi.hoisted(() => ({
      onPostRoute: vi.fn(),
      onGetRouteByToken: vi.fn(),
    }));
    return {
      submitBtn,
      startInput,
      endInput,
      uiUtils,
      mocks,
    };
  };
  beforeAll(() => {
    // @ts-expect-error mock api
    vi.mock(import("@react-google-maps/api"), () => {
      return {
        useJsApiLoader: vi.fn().mockReturnValue({ isLoaded: true }),
        GoogleMap: ({ children }: { children: React.ReactNode }) => (
          <div id="google-map-script">{children}</div>
        ), // Mock to render a simple div
        Polyline: () => <div />, // Mock to render a simple div
        Marker: ({
          position,
          label,
        }: {
          position: { lng: string; lat: string };
          label: string;
        }) => <p>{`lat=${position.lat},lng=${position.lng},label=${label}`}</p>, // Mock to render a simple div
        Autocomplete: ({ children }: { children: React.ReactNode }) => {
          return children;
        }, // Mock to render a simple div
      };
    });
  });
  it("should show error message if starting locatiion or Drop-off-point is empty", async () => {
    const { submitBtn } = setup();
    submitBtn.click();
    expect(
      await screen.findByText(
        "Please select starting locatiion and Drop-off-point"
      )
    ).toBeVisible();
  });
  it("should show error message if onPostRoute not return token", async () => {
    const { mocks, submitBtn, endInput, startInput } = setup();
    vi.mock(import("../services/routeApis"), () => {
      return {
        onGetRouteByToken: mocks.onGetRouteByToken,
        onPostRoute: mocks.onPostRoute,
      };
    });
    fireEvent.change(startInput, { target: { value: "111" } });
    fireEvent.change(endInput, { target: { value: "222" } });
    submitBtn.click();
    expect(mocks.onPostRoute).toBeCalledTimes(1);
    expect(
      await screen.findByText("Route token not found, please try again later.")
    ).toBeVisible();
  });
  it("should show error message if onGetRouteByToken is failure", async () => {
    const { mocks, submitBtn, endInput, startInput } = setup();
    vi.mock(import("../services/routeApis"), () => {
      return {
        onGetRouteByToken: mocks.onGetRouteByToken,
        onPostRoute: mocks.onPostRoute,
      };
    });
    vi.mocked(mocks.onPostRoute).mockReturnValue("fake-token");
    vi.mocked(mocks.onGetRouteByToken).mockReturnValue({
      status: "failure",
      error: "This is a fake error",
    });
    fireEvent.change(startInput, { target: { value: "111" } });
    fireEvent.change(endInput, { target: { value: "222" } });
    submitBtn.click();
    expect(await mocks.onPostRoute).toBeCalledTimes(1);
    expect(await mocks.onGetRouteByToken).toBeCalledTimes(1);
    expect(await screen.findByText("This is a fake error")).toBeVisible();
  });
  it("should display path name if onGetRouteByToken is success", async () => {
    const { mocks, submitBtn, endInput, startInput, uiUtils } = setup();
    vi.mock(import("../services/routeApis"), () => {
      return {
        onGetRouteByToken: mocks.onGetRouteByToken,
        onPostRoute: mocks.onPostRoute,
      };
    });
    vi.mocked(mocks.onPostRoute).mockReturnValue("fake-token");
    vi.mocked(mocks.onGetRouteByToken).mockReturnValue({
      status: "success",
      path: [[111, 222]],
      total_distance: 9876,
      total_time: 54321,
    });
    fireEvent.change(startInput, { target: { value: "mockStart" } });
    fireEvent.change(endInput, { target: { value: "mockEnd" } });
    expect(await screen.findByText("Find the way")).toBeVisible();
    submitBtn.click();
    const pathTitle = await uiUtils.findByTestId("PathTitle");
    expect(pathTitle.textContent).toEqual("mockStart to mockEnd");

    // expect(await screen.getByTestId("pathTitle").textContent).toEqual("");
  });
  it("should display markers if onGetRouteByToken is success", async () => {
    const { mocks, submitBtn, endInput, startInput } = setup();
    vi.mock(import("../services/routeApis"), () => {
      return {
        onGetRouteByToken: mocks.onGetRouteByToken,
        onPostRoute: mocks.onPostRoute,
      };
    });
    vi.mocked(mocks.onPostRoute).mockReturnValue("fake-token");
    vi.mocked(mocks.onGetRouteByToken).mockReturnValue({
      status: "success",
      path: [
        [111, 222],
        [333, 444],
        [555, 666],
        [777, 888],
      ],
      total_distance: 9876,
      total_time: 54321,
    });
    fireEvent.change(startInput, { target: { value: "mockStart" } });
    fireEvent.change(endInput, { target: { value: "mockEnd" } });
    expect(await screen.findByText("Find the way")).toBeVisible();
    submitBtn.click();
    expect(
      await screen.findByText("lat=111,lng=222,label=1")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("lat=333,lng=444,label=2")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("lat=555,lng=666,label=3")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("lat=777,lng=888,label=4")
    ).toBeInTheDocument();
  });
});
