import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) navigate("/dashboard");
  };

  const isFormValid = () =>
    formData.username && formData.email && formData.password &&
    formData.confirmPassword && formData.password === formData.confirmPassword &&
    formData.password.length >= 6;

  const passwordsMatch = !formData.confirmPassword || formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface relative">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-brand/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-brand rounded-2xl p-4 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-glow">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Initialize Identity</h1>
          <p className="text-white/30 text-sm mt-2 font-medium">Register to NebulaFin Command Matrix</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Shield className="h-3 w-3 text-brand/60" />
            <span className="text-[10px] text-white/20 font-semibold uppercase tracking-[0.3em]">Data Encryption Active</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="card card-glow p-8 relative overflow-hidden">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-40"></div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
                <span className="font-bold">ERROR:</span> {error}
              </div>
            )}

            <div>
              <label className="label">Operator Handle</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input name="username" type="text" required className="input pl-11" placeholder="Username"
                  value={formData.username} onChange={handleChange} minLength="3" maxLength="30" />
              </div>
            </div>

            <div>
              <label className="label">Identity Vector (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input name="email" type="email" required className="input pl-11" placeholder="operator@nebula.io"
                  value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="label">Security Token</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input name="password" type={showPassword ? "text" : "password"} required
                  className="input pl-11 pr-11" placeholder="Min. 6 characters"
                  value={formData.password} onChange={handleChange} minLength="6" />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Security Token</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                  className={`input pl-11 pr-11 ${!passwordsMatch ? '!border-danger/50' : ''}`}
                  placeholder="Repeat token"
                  value={formData.confirmPassword} onChange={handleChange} />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-danger text-xs mt-1.5 font-semibold">⚠ Token mismatch detected</p>
              )}
            </div>

            <button type="submit" disabled={loading || !isFormValid()} className="btn-blue w-full py-4 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Initializing...
                </span>
              ) : "Commit Identity Protocol"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm">
              Already identified?{" "}
              <Link to="/login" className="text-brand hover:text-brand-light font-bold transition-colors">
                Access Portal →
              </Link>
            </p>
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-white/15 font-semibold uppercase tracking-wider px-2">
          <span>NebulaFin v3.0</span>
          <span>Cobalt Matrix</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
