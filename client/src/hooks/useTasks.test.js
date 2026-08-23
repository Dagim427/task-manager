import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import useTasks from "../hooks/useTasks";
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
  });

  it("loads tasks successfully", async () => {
    getTasks.mockResolvedValue({
      data: {
        tasks: [
          {
            id: 1,
            title: "Test task",
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
    });

    const { result } = renderHook(() =>
      useTasks(),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tasks).toHaveLength(1);

    expect(result.current.tasks[0]).toEqual({
      id: 1,
      title: "Test task",
    });

    expect(getTasks).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: "",
      status: "",
      priority: "",
    });
  });

  it("handles loading errors", async () => {
    getTasks.mockRejectedValue({
      response: {
        data: {
          message: "Unable to load tasks.",
        },
      },
    });

    const { result } = renderHook(() =>
      useTasks(),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(
      "Unable to load tasks.",
    );

    expect(result.current.tasks).toEqual([]);
  });

  it("creates a task", async () => {
    getTasks.mockResolvedValue({
      data: {
        tasks: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      },
    });

    createTaskRequest.mockResolvedValue({
      data: {
        task: {
          id: 2,
          title: "New task",
        },
      },
    });

    const { result } = renderHook(() =>
      useTasks(),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.createTask({
        title: "New task",
      });
    });

    expect(result.current.tasks).toContainEqual({
      id: 2,
      title: "New task",
    });

    expect(createTaskRequest).toHaveBeenCalledWith({
      title: "New task",
    });
  });

  it("updates a task", async () => {
    getTasks.mockResolvedValue({
      data: {
        tasks: [
          {
            id: 1,
            title: "Old title",
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
    });

    updateTaskRequest.mockResolvedValue({
      data: {
        task: {
          id: 1,
          title: "Updated title",
        },
      },
    });

    const { result } = renderHook(() =>
      useTasks(),
    );

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    await act(async () => {
      await result.current.updateTask(1, {
        title: "Updated title",
      });
    });

    expect(result.current.tasks[0]).toEqual({
      id: 1,
      title: "Updated title",
    });

    expect(updateTaskRequest).toHaveBeenCalledWith(
      1,
      {
        title: "Updated title",
      },
    );
  });

  it("deletes a task", async () => {
    getTasks.mockResolvedValue({
      data: {
        tasks: [
          {
            id: 1,
            title: "Task to delete",
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
    });

    deleteTaskRequest.mockResolvedValue({});

    const { result } = renderHook(() =>
      useTasks(),
    );

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
    });

    await act(async () => {
      await result.current.removeTask(1);
    });

    expect(deleteTaskRequest).toHaveBeenCalledWith(1);

    expect(getTasks).toHaveBeenCalled();
  });

  it("passes search and filters to the API", async () => {
    getTasks.mockResolvedValue({
      data: {
        tasks: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      },
    });

    renderHook(() =>
      useTasks({
        search: "project",
        status: "completed",
        priority: "high",
      }),
    );

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        search: "project",
        status: "completed",
        priority: "high",
      });
    });
  });

  it("changes pages", async () => {
    getTasks.mockResolvedValue({
      data: {
        tasks: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 40,
          totalPages: 2,
        },
      },
    });

    const { result } = renderHook(() =>
      useTasks(),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        search: "",
        status: "",
        priority: "",
      });
    });
  });
});
