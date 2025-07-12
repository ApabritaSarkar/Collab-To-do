import React, { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

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
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Welcome Back 👋
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center"
        >
          {loading ? <ClipLoader size={22} color="#fff" /> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
