import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import AuthContext from "../../context/AuthContext";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import socket from "../../api/socket";

export const useDashboardLogic = () => {
  const { token } = useContext(AuthContext);
  const { roomId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [assigningTaskId, setAssigningTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/room/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  const fetchRoomDetails = async () => {
    try {
      const res = await API.get(`/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Room response", res.data); // 👈 DEBUG LOG
      setRoomInfo(res.data);
    } catch {
      toast.error("Failed to load room info");
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post(
        "/tasks",
        { ...newTask, roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
        { status: newStatus, updatedAt: originalUpdatedAt, roomId },
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
        if (window.confirm("Task was updated elsewhere. Overwrite?")) {
          await API.put(
            `/tasks/${draggableId}`,
            { status: newStatus, roomId },
            { headers: { Authorization: `Bearer ${token}` } }
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
        { roomId },
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

  useEffect(() => {
    fetchTasks();
    fetchRoomDetails();

    socket.emit("joinRoom", roomId);

    socket.on("task-updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    return () => {
      socket.off("task-updated");
      socket.emit("leaveRoom", roomId);
    };
  }, [token, roomId]);

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500 font-bold";
      case "Medium":
        return "text-orange-500 font-semibold";
      case "Low":
        return "text-emerald-500";
      default:
        return "text-slate-500";
    }
  };

  const getColumnBgColor = (col) => {
    switch (col) {
      case "Todo":
        return "bg-slate-800";
      case "In Progress":
        return "bg-cyan-950/20";
      case "Done":
        return "bg-emerald-950/20";
      default:
        return "bg-slate-900";
    }
  };

  return {
    roomInfo,
    tasks,
    newTask,
    loading,
    assigningTaskId,
    handleInputChange,
    handleAddTask,
    onDragEnd,
    handleSmartAssign,
    getTasksByStatus,
    getPriorityColor,
    getColumnBgColor,
  };
};
