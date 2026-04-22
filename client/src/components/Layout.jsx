import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FolderTree,
  LogOut,
  User,
  Menu,
  X,
  Zap,
  Plus,
  Power,
  Shield,
} from "lucide-react";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", tag: "CORE" },
    { to: "/transactions", icon: ArrowLeftRight, label: "Transactions", tag: "MATRIX" },
    { to: "/categories", icon: FolderTree, label: "Categories", tag: "GRID" },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* ─── Sidebar (Desktop) ─── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-surface-card border-r border-white/10 fixed inset-y-0 left-0 z-30">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-brand rounded-xl p-2.5 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-glow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Nebula<span className="text-brand">Fin</span>
              </span>
            </div>
          </div>
          <p className="text-[10px] text-white/30 font-semibold uppercase tracking-[0.3em] ml-1 mb-8">Financial Matrix v3.0</p>

          {/* Navigation */}
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mb-3 ml-1">Navigation Protocol</p>
          <nav className="space-y-1.5">
            {navItems.map(({ to, icon: Icon, label, tag }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                  isActive(to)
                    ? "bg-brand/15 text-brand border border-brand/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center">
                  <Icon className={`h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive(to) ? "text-brand" : ""}`} />
                  {label}
                </div>
                <span className={`tag ${isActive(to) ? 'bg-brand/20 text-brand' : 'bg-white/5 text-white/30'}`}>{tag}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Section */}
        <div className="mt-auto p-6 border-t border-white/10">
          <div className="card p-4 flex items-center space-x-3 mb-3 animate-border-glow">
            <div className="bg-brand/15 p-2.5 rounded-xl border border-brand/20">
              <Shield className="h-4 w-4 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.username}</p>
              <p className="text-[10px] text-white/30 truncate font-medium">OPERATOR • ACTIVE</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-danger hover:bg-danger/10 border border-white/5 hover:border-danger/20 transition-all"
          >
            <Power className="h-4 w-4 mr-2" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* ─── Mobile Header ─── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-card/95 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-brand rounded-lg p-1.5 animate-glow">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-white">Nebula<span className="text-brand">Fin</span></span>
        </div>
        <div className="flex items-center gap-2">
          {/* Sign Out on mobile - always visible */}
          <button onClick={handleLogout} className="p-2 rounded-lg bg-danger/10 border border-danger/20 text-danger">
            <Power className="h-4 w-4" />
          </button>
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-brand rounded-lg text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ─── Mobile Sidebar Overlay ─── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-surface-card border-r border-white/10 animate-slide-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="bg-brand rounded-lg p-1.5">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-base font-extrabold text-white">Nebula<span className="text-brand">Fin</span></span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mb-3 ml-1">System Navigation</p>
              <nav className="space-y-1.5 stagger">
                {navItems.map(({ to, icon: Icon, label, tag }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive(to)
                        ? "bg-brand/15 text-brand border border-brand/30"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`h-5 w-5 mr-3 ${isActive(to) ? "text-brand" : ""}`} />
                      {label}
                    </div>
                    <span className={`tag ${isActive(to) ? 'bg-brand/20 text-brand' : 'bg-white/5 text-white/30'}`}>{tag}</span>
                  </Link>
                ))}
              </nav>

              {/* User info in mobile sidebar */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-brand/15 p-2.5 rounded-xl border border-brand/20">
                    <Shield className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user?.username}</p>
                    <p className="text-[10px] text-white/30 font-medium">OPERATOR • ACTIVE</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSidebarOpen(false); handleLogout(); }}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-danger bg-danger/10 border border-danger/20 hover:bg-danger/20 transition-all"
                >
                  <Power className="h-4 w-4 mr-2" />
                  Terminate Session
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <div className="flex-1 lg:ml-72">
        <main className="min-h-screen pt-16 lg:pt-8 pb-24 lg:pb-8 px-4 sm:px-6 lg:px-10">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-white/10 flex items-center justify-around px-2 py-1.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-semibold transition-all ${
              isActive(to) ? "text-brand" : "text-white/40"
            }`}
          >
            <Icon className={`h-5 w-5 mb-0.5 ${isActive(to) ? 'animate-float' : ''}`} />
            {label}
            {isActive(to) && <div className="w-4 h-0.5 bg-brand rounded-full mt-1"></div>}
          </Link>
        ))}
        <button
          onClick={() => navigate("/transactions")}
          className="bg-brand p-2.5 rounded-full text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] -translate-y-3 border-4 border-surface animate-glow"
        >
          <Plus className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default Layout;
