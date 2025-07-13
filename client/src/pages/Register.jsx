import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { motion } from 'framer-motion';

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Registered successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-6">
      <motion.div
        className="bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-transform duration-500 hover:shadow-orange-500/30"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 shadow-inner"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 shadow-inner"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 shadow-inner"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg transition-colors duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Register"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-semibold transition duration-200">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;