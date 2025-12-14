import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Award,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import RecentCandidates from "../components/RecentCandidates";
import TopMentors from "../components/TopMentors";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    newCandidates: 0,
    pendingInterviews: 0,
    activeMentors: 0,
    pendingVerification: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      const candidates = JSON.parse(
        localStorage.getItem("verifixCandidates") || "[]"
      );
      const interviews = JSON.parse(
        localStorage.getItem("verifixInterviews") || "[]"
      );
      const mentors = JSON.parse(
        localStorage.getItem("verifixMentors") || "[]"
      );

      const newCandidates = candidates.filter((c) => {
        const createdDate = new Date(c.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length;

      const pendingInterviews = interviews.filter(
        (i) => i.status === "scheduled"
      ).length;
      const activeMentors = mentors.filter((m) => m.active).length;
      const pendingVerification = candidates.filter(
        (c) => c.status === "verification"
      ).length;

      setStats({
        newCandidates,
        pendingInterviews,
        activeMentors,
        pendingVerification,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      label: "Yangi Nomzodlar",
      value: stats.newCandidates,
      icon: Users,
      color: "blue",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Kutilayotgan Suhbatlar",
      value: stats.pendingInterviews,
      icon: Calendar,
      color: "green",
      change: "+5%",
      trend: "up",
    },
    {
      label: "Faol Mentorlar",
      value: stats.activeMentors,
      icon: Award,
      color: "purple",
      change: "+3%",
      trend: "up",
    },
    {
      label: "Verifikatsiya Kutilmoqda",
      value: stats.pendingVerification,
      icon: Clock,
      color: "orange",
      change: "-2%",
      trend: "down",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Xush kelibsiz, {currentUser?.fullName}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Bugun{" "}
          {new Date().toLocaleDateString("uz-UZ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentCandidates />
        <TopMentors />
      </div>
    </div>
  );
};

export default Dashboard;
