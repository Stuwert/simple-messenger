import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

jest.mock("../Lobby/useSetUser", () => ({
  __esModule: true,
  default: () => undefined,
}));

test("Should render loading to start", () => {
  render(<App />);
  const linkElement = screen.getByText(/Loading/i);
  expect(linkElement).toBeInTheDocument();
});
