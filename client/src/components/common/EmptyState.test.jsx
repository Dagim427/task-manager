import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("shows the empty state content", () => {
    render(
      <EmptyState
        title="No tasks yet"
        message="Create your first task."
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "No tasks yet",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create your first task.",
      ),
    ).toBeInTheDocument();
  });
});