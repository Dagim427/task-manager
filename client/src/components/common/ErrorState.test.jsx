import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ErrorState from "./ErrorState";

describe("ErrorState", () => {
  it("displays the error message", () => {
    render(
      <ErrorState
        message="Unable to load tasks."
      />,
    );

    expect(
      screen.getByText(
        "Unable to load tasks.",
      ),
    ).toBeInTheDocument();
  });

  it("calls retry when clicked", async () => {
    const onRetry = vi.fn();

    render(
      <ErrorState
        message="Unable to load tasks."
        onRetry={onRetry}
      />,
    );

    const button =
      screen.getByRole("button", {
        name: "Try again",
      });

    button.click();

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});