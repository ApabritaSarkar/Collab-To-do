import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import AuthContext from "../context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import socket from "../api/socket";
import ActivityLog from "../components/ActivityLog";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const columns = ["Todo", "In Progress", "Done"];

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [assigningTaskId, setAssigningTaskId] = useState(null);

  // ──────────────────────── Handlers ────────────────────────

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) => [...prev, res.data]);
      socket.emit("task-changed", {
        taskId: res.data._id,
        newStatus: res.data.status,
      });

      setNewTask({ title: "", description: "", priority: "Medium" });
      toast.success("Task added successfully!");
    } catch {
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const originalUpdatedAt = tasks.find(
      (t) => t._id === draggableId
    )?.updatedAt;

    try {
      const res = await API.put(
        `/tasks/${draggableId}`,
        { status: newStatus, updatedAt: originalUpdatedAt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === draggableId ? { ...t, status: newStatus } : t
          )
        );
        socket.emit("task-changed", { taskId: draggableId, newStatus });
      }
      toast.success("Task status updated!");
    } catch (err) {
      if (err.response?.status === 409) {
        const confirm = window.confirm(
          "Task was updated elsewhere. Overwrite?"
        );
        if (confirm) {
          await API.put(
            `/tasks/${draggableId}`,
            { status: newStatus },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fetchTasks();
          socket.emit("task-changed", { taskId: draggableId, newStatus });
        }
      } else {
        toast.error("Failed to update task status");
      }
    }
  };

  const handleSmartAssign = async (taskId) => {
    setAssigningTaskId(taskId);
    try {
      const res = await API.put(
        `/tasks/smart-assign/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
      socket.emit("task-updated", res.data);
      toast.success("Smart assigned!");
    } catch {
      toast.error("Smart assign failed");
    } finally {
      setAssigningTaskId(null);
    }
  };

  // ──────────────────────── Effects ────────────────────────

  useEffect(() => {
    fetchTasks();

    socket.on("task-updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    return () => {
      socket.off("task-updated");
    };
  }, [token]);

  // ──────────────────────── Helpers ────────────────────────

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  // ──────────────────────── Render ────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col md:flex-row gap-6 overflow-x-auto">
      {/* Left Side: Form + Board */}
      <div className="flex-1 space-y-6">
        {/* Add Task Form */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Add New Task</h3>
          <form onSubmit={handleAddTask} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
              value={newTask.title}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newTask.description}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
              className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center"
            >
              {loading ? <ClipLoader size={22} color="#fff" /> : "Add Task"}
            </button>
          </form>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {columns.map((col) => (
              <Droppable droppableId={col} key={col}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-slate-900 p-4 rounded-xl min-h-[500px] space-y-4 shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-slate-200">
                      {col}
                    </h3>
                    {getTasksByStatus(col).map((task, index) => (
                      <Draggable
                        draggableId={task._id}
                        index={index}
                        key={task._id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-slate-800 p-4 rounded-lg shadow hover:shadow-md transition"
                          >
                            <strong className="block text-white mb-1">
                              {task.title}
                            </strong>
                            <p className="text-slate-400 text-sm mb-1">
                              {task.description}
                            </p>
                            <p className="text-xs text-slate-500">
                              Priority: {task.priority}
                            </p>
                            <p className="text-xs text-slate-500">
                              Assigned to:{" "}
                              {task.assignedTo?.name || "Unassigned"}
                            </p>
                            <button
                              onClick={() => handleSmartAssign(task._id)}
                              disabled={assigningTaskId === task._id}
                              className="mt-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded transition flex items-center justify-center"
                            >
                              {assigningTaskId === task._id ? (
                                <ClipLoader size={14} color="#fff" />
                              ) : (
                                "Smart Assign"
                              )}
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Right Side: Activity Log */}
      <div className="w-full md:w-80">
        <ActivityLog />
      </div>
    </div>
  );
};

export default Dashboard;
