import React, { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { motion } from 'framer-motion';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      setUser(res.data.user);
      setToken(res.data.token);
      toast.success("Logged in successfully!");
      navigate("/room");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
        className="bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-transform duration-500 hover:shadow-cyan-500/30"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 shadow-inner"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400 mb-2 block">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200 shadow-inner"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg transition-colors duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Sign In"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 hover:text-orange-400 font-semibold transition duration-200">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;