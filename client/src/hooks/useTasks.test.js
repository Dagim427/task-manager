import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useTasks from "./useTasks";
import {
  getTasks,
  createTask as createTaskRequest,
  updateTask as updateTaskRequest,
  deleteTask as deleteTaskRequest,
} from "../services/task.service";

vi.mock("../services/task.service", () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

describe("useTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTasks.mockResolvedValue({
      success: true,
      data: {
        tasks: [{ id: 1, title: "Initial task", status: "todo", priority: "medium" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      },
    });
  });

  it("loads tasks successfully", async () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Initial task");
    expect(result.current.error).toBe("");
  });

  it("handles loading errors", async () => {
    getTasks.mockRejectedValueOnce({
      response: { data: { message: "Failed to fetch" } },
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to fetch");
    expect(result.current.tasks).toEqual([]);
  });

  it("creates a task", async () => {
    createTaskRequest.mockResolvedValueOnce({
      success: true,
      data: {
        task: { id: 2, title: "New task" },
      },
    });

    getTasks.mockResolvedValue({
      success: true,
      data: {
        tasks: [
          { id: 2, title: "New task", status: "todo", priority: "medium" },
          { id: 1, title: "Initial task", status: "todo", priority: "medium" },
        ],
        pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
      },
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.createTask({ title: "New task" });
    });

    expect(createTaskRequest).toHaveBeenCalledWith({ title: "New task" });
    expect(result.current.tasks).toContainEqual(
      expect.objectContaining({
        id: 2,
        title: "New task",
      })
    );
  });

  it("updates a task", async () => {
    updateTaskRequest.mockResolvedValueOnce({
      success: true,
      data: {
        task: { id: 1, title: "Updated title" },
      },
    });

    getTasks.mockResolvedValue({
      success: true,
      data: {
        tasks: [{ id: 1, title: "Updated title", status: "todo", priority: "medium" }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      },
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateTask(1, { title: "Updated title" });
    });

    expect(updateTaskRequest).toHaveBeenCalledWith(1, { title: "Updated title" });
    expect(result.current.tasks[0]).toEqual({
      id: 1,
      title: "Updated title",
      status: "todo",
      priority: "medium",
    });
  });

  it("deletes a task", async () => {
    deleteTaskRequest.mockResolvedValueOnce({ success: true });

    getTasks.mockResolvedValue({
      success: true,
      data: {
        tasks: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      },
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.removeTask(1);
    });

    expect(deleteTaskRequest).toHaveBeenCalledWith(1);
    expect(result.current.tasks).toHaveLength(0);
  });

  it("passes search and filters to the API", async () => {
    const { result } = renderHook(() =>
      useTasks({ search: "test", status: "todo", priority: "high" })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getTasks).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: "test",
      status: "todo",
      priority: "high",
    });
  });

  it("changes pages", async () => {
    const { result } = renderHook(() => useTasks());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
  });
});