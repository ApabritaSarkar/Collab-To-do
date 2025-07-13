import React from "react";
import RoomInfo from "./partials/RoomInfo";
import AddTaskForm from "./partials/AddTaskForm";
import KanbanBoard from "./partials/KanbanBoard";
import ActivityLog from "../components/ActivityLog";
import { useDashboardLogic } from "./partials/useDashboardLogic";

const Dashboard = () => {
  const {
    roomInfo,
    tasks,
    loading,
    newTask,
    assigningTaskId,
    handleAddTask,
    handleInputChange,
    onDragEnd,
    handleSmartAssign,
    getTasksByStatus,
    getPriorityColor,
    getColumnBgColor,
  } = useDashboardLogic();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col md:flex-row gap-6 overflow-x-auto">
      {/* Left: Task Board & Controls */}
      <div className="flex-1 space-y-6">
        <RoomInfo roomInfo={roomInfo} />
        <AddTaskForm
          newTask={newTask}
          handleInputChange={handleInputChange}
          handleAddTask={handleAddTask}
          loading={loading}
        />
        <KanbanBoard
          tasks={tasks}
          onDragEnd={onDragEnd}
          getTasksByStatus={getTasksByStatus}
          getPriorityColor={getPriorityColor}
          getColumnBgColor={getColumnBgColor}
          handleSmartAssign={handleSmartAssign}
          assigningTaskId={assigningTaskId}
        />
      </div>

      {/* Right: Members & Logs */}
      <div className="w-full md:w-80 flex-shrink-0 space-y-6">
        <ActivityLog />
      </div>
    </div>
  );
};

export default Dashboard;
