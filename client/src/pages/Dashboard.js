import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import AuthContext from "../context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import socket from "../api/socket";
import ActivityLog from "../components/ActivityLog";

const columns = ["Todo", "In Progress", "Done"];

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  // ──────────────────────── Handlers ────────────────────────

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch {
      alert("Failed to fetch tasks");
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
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
    } catch {
      alert("Failed to add task");
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
        alert("Failed to update task status");
      }
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const res = await API.put(
        `/tasks/smart-assign/${taskId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));

      socket.emit("task-updated", res.data);
    } catch {
      alert("Smart assign failed");
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
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, paddingRight: "1rem" }}>
        {/* Add Task Form */}
        <div style={formContainerStyle}>
          <h3>Add New Task</h3>
          <form onSubmit={handleAddTask} style={formStyle}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
              value={newTask.title}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newTask.description}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button type="submit" style={btnStyle}>
              Add Task
            </button>
          </form>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={columnStyle}
                >
                  <h3>{col}</h3>
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
                          style={{
                            ...taskCardStyle,
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{task.title}</strong>
                          <p>{task.description}</p>
                          <p style={{ fontSize: "0.8rem", color: "#666" }}>
                            Priority: {task.priority}
                          </p>
                          <p style={{ fontSize: "0.8rem", color: "#888" }}>
                            Assigned to: {task.assignedTo?.name || "Unassigned"}
                          </p>
                          <button
                            onClick={() => handleSmartAssign(task._id)}
                            style={smartAssignBtnStyle}
                          >
                            Smart Assign
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
        </DragDropContext>
      </div>

      <ActivityLog />
    </div>
  );
};

// ──────────────────────── Styles ────────────────────────

const formContainerStyle = {
  marginBottom: "2rem",
  padding: "1rem",
  background: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const formStyle = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
};

const inputStyle = {
  padding: "0.5rem",
  fontSize: "1rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
  flex: "1",
};

const btnStyle = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#1976d2",
  color: "white",
  cursor: "pointer",
};

const columnStyle = {
  flex: 1,
  backgroundColor: "#f4f4f4",
  padding: "1rem",
  borderRadius: "8px",
  minHeight: "500px",
};

const taskCardStyle = {
  backgroundColor: "white",
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "5px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const smartAssignBtnStyle = {
  marginTop: "0.5rem",
  fontSize: "0.8rem",
  padding: "0.25rem 0.5rem",
  background: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "3px",
  cursor: "pointer",
};

export default Dashboard;
