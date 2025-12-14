import React from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Award,
  Calendar,
  FileText,
  Shield,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const menuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      icon: TrendingUp,
      label: "Dashboard",
    },
    { id: "candidates", path: "/candidates", icon: Users, label: "Nomzodlar" },
    { id: "mentors", path: "/mentors", icon: Award, label: "Mentorlar" },
    {
      id: "interviews",
      path: "/interviews",
      icon: Calendar,
      label: "Suhbatlar",
    },
    { id: "documents", path: "/documents", icon: FileText, label: "Hujjatlar" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-linear-to-b from-blue-600 to-blue-800 text-white shadow-xl flex flex-col">
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <NavLink className={"text-2xl font-bold"} to={"/"}>
            Verifix
          </NavLink>
        </div>
        <p className="text-blue-200 text-sm mt-1">Smart HR Platform</p>
      </div>

      <div className="p-4 border-b border-blue-500">
        <button
          onClick={() => navigate("/profile")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
            isActive("/profile")
              ? "bg-white text-blue-600 shadow-lg"
              : "hover:bg-blue-800"
          }`}
        >
          {currentUser?.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt={currentUser.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm truncate">
              {currentUser?.fullName}
            </p>
            <p
              className={`text-xs truncate ${
                isActive("/profile") ? "text-blue-500" : "text-blue-200"
              }`}
            >
              {currentUser?.position}
            </p>
          </div>
        </button>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive(item.path)
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-blue-100 hover:bg-blue-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-900 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Chiqish</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
