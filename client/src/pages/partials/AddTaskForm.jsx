import React from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

const AddTaskForm = ({ newTask, handleInputChange, handleAddTask, loading }) => {
  return (
    <motion.div
      className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-2xl font-semibold mb-4 text-white">Add New Task</h3>
      <form onSubmit={handleAddTask} className="grid gap-4 md:grid-cols-4 items-end">
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          value={newTask.title}
          onChange={handleInputChange}
          className="md:col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleInputChange}
          className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="md:col-span-4 lg:col-span-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? <ClipLoader size={22} color="#fff" /> : "Add Task"}
        </button>
      </form>
    </motion.div>
  );
};

export default AddTaskForm;
