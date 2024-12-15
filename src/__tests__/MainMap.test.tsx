import { render, waitFor } from "@testing-library/react";
import { expect } from "vitest";
import App from "../App";

describe("Main Map Component", () => {
  it("renders map correctly", async () => {
    render(<App />);
    await waitFor(() => {
      const mapDiv = document.getElementById("google-map-script");
      expect(mapDiv).toBeInTheDocument();
    });
  });
});
