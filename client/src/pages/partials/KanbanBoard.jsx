import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const columns = ["Todo", "In Progress", "Done"];

const KanbanBoard = ({
  tasks,
  onDragEnd,
  getTasksByStatus,
  getPriorityColor,
  getColumnBgColor,
  handleSmartAssign,
  assigningTaskId,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided, snapshot) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`p-6 rounded-xl min-h-[500px] space-y-4 shadow-xl transition-all duration-300 ${getColumnBgColor(col)} border-t-8 border-slate-600 ${snapshot.isDraggingOver ? "ring-4 ring-indigo-500" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold mb-4 pb-2 border-b border-slate-700 text-slate-100">
                  {col} ({tasks.filter((t) => t.status === col).length})
                </h3>

                {getTasksByStatus(col).map((task, index) => (
                  <Draggable draggableId={task._id} index={index} key={task._id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 cursor-grab transform transition-all duration-200 hover:border-indigo-500 ${snapshot.isDragging ? "rotate-1 scale-105 shadow-2xl ring-2 ring-indigo-400" : ""}`}
                      >
                        <strong className="block text-white mb-2 text-lg">{task.title}</strong>
                        <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                        <div className="space-y-2 text-sm text-slate-400">
                          <p className={getPriorityColor(task.priority)}>
                            Priority: {task.priority}
                          </p>
                          <p>
                            Assigned to:{" "}
                            <span className="font-medium text-slate-300">
                              {task.assignedTo?.name || "Unassigned"}
                            </span>
                          </p>
                        </div>

                        <motion.button
                          onClick={() => handleSmartAssign(task._id)}
                          disabled={assigningTaskId === task._id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full transition duration-300 font-semibold flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {assigningTaskId === task._id ? (
                            <ClipLoader size={14} color="#fff" />
                          ) : (
                            "Smart Assign"
                          )}
                        </motion.button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </motion.div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
