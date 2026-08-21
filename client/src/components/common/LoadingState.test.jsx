import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoadingState from "./LoadingState";

describe("LoadingState", () => {
  it("displays the loading message", () => {
    render(
      <LoadingState message="Loading tasks..." />,
    );

    expect(
      screen.getByText("Loading tasks..."),
    ).toBeInTheDocument();
  });
});