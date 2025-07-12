import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

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
      toast.success("Registered successfully! Now login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
          Create Your Account ✨
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center"
        >
          {loading ? <ClipLoader size={22} color="#fff" /> : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
