import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";
import TaskForm from "./TaskForm";

describe("TaskForm", () => {
  it("requires a title", async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn();

    render(
      <TaskForm
        onSubmit={onSubmit}
        isSubmitting={false}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /create task/i,
      }),
    );

    expect(
      screen.getByText(
        "Title is required.",
      ),
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables the submit button while submitting", () => {
    render(
      <TaskForm
        onSubmit={vi.fn()}
        isSubmitting={true}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: /creating/i,
      }),
    ).toBeDisabled();
  });
});