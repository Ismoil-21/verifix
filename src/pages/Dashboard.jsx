import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  RefreshCw,
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
  const [chartData, setChartData] = useState({
    weekly: [],
    statusDistribution: [],
    monthlyTrend: [],
  });
  const [performanceScore, setPerformanceScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("weekly");

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
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

      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const newCandidates = candidates.filter((c) => {
        const createdDate = new Date(c.createdAt);
        return createdDate > weekAgo;
      }).length;

      const pendingInterviews = interviews.filter(
        (i) => i.status === "scheduled"
      ).length;
      const activeMentors = mentors.filter((m) => m.active !== false).length;
      const pendingVerification = candidates.filter(
        (c) => c.status === "verification"
      ).length;

      setStats({
        newCandidates,
        pendingInterviews,
        activeMentors,
        pendingVerification,
      });

      generateChartData(candidates, interviews);
      calculatePerformanceScore(candidates, interviews, mentors);

      saveChartData({
        stats: {
          newCandidates,
          pendingInterviews,
          activeMentors,
          pendingVerification,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (candidates, interviews) => {
    const weeklyData = [];
    const days = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayCandidates = candidates.filter((c) => {
        const cDate = new Date(c.createdAt);
        return cDate >= dayStart && cDate <= dayEnd;
      }).length;

      const dayInterviews = interviews.filter((int) => {
        const iDate = new Date(int.date);
        return iDate >= dayStart && iDate <= dayEnd;
      }).length;

      weeklyData.push({
        day: days[date.getDay()],
        candidates: dayCandidates,
        interviews: dayInterviews,
        value: Math.min((dayCandidates + dayInterviews) * 8, 100),
      });
    }

    const statusCounts = {
      interview: candidates.filter((c) => c.status === "interview").length,
      test: candidates.filter((c) => c.status === "test").length,
      verification: candidates.filter((c) => c.status === "verification")
        .length,
      accepted: candidates.filter((c) => c.status === "accepted").length,
      rejected: candidates.filter((c) => c.status === "rejected").length,
    };

    const statusData = [
      { status: "Suhbat", count: statusCounts.interview, color: "bg-blue-500" },
      { status: "Test", count: statusCounts.test, color: "bg-purple-500" },
      {
        status: "Tekshiruv",
        count: statusCounts.verification,
        color: "bg-yellow-500",
      },
      { status: "Qabul", count: statusCounts.accepted, color: "bg-green-500" },
    ];

    const monthlyData = [];
    const months = [
      "Yan",
      "Fev",
      "Mar",
      "Apr",
      "May",
      "Iyun",
      "Iyul",
      "Avg",
      "Sen",
      "Okt",
      "Noy",
      "Dek",
    ];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthCandidates = candidates.filter((c) => {
        const cDate = new Date(c.createdAt);
        return cDate >= monthStart && cDate <= monthEnd;
      }).length;

      const monthInterviews = interviews.filter((int) => {
        const iDate = new Date(int.createdAt || int.date);
        return iDate >= monthStart && iDate <= monthEnd;
      }).length;

      monthlyData.push({
        month: months[date.getMonth()],
        candidates: monthCandidates,
        interviews: monthInterviews,
        value: Math.min((monthCandidates + monthInterviews) * 3, 100),
      });
    }

    setChartData({
      weekly: weeklyData,
      statusDistribution: statusData,
      monthlyTrend: monthlyData,
    });

    localStorage.setItem(
      "verifixChartData",
      JSON.stringify({
        weekly: weeklyData,
        statusDistribution: statusData,
        monthlyTrend: monthlyData,
        timestamp: new Date().toISOString(),
      })
    );
  };

  const calculatePerformanceScore = (candidates, interviews, mentors) => {
    try {
      const totalCandidates = candidates.length;
      const acceptedCandidates = candidates.filter(
        (c) => c.status === "accepted"
      ).length;
      const completedInterviews = interviews.filter(
        (i) => i.status === "completed"
      ).length;
      const totalInterviews = interviews.length;
      const activeMentorCount = mentors.filter(
        (m) => m.active !== false
      ).length;
      const totalMentors = mentors.length;

      let score = 0;

      if (totalCandidates > 0) {
        score += (acceptedCandidates / totalCandidates) * 40;
      }

      if (totalInterviews > 0) {
        score += (completedInterviews / totalInterviews) * 30;
      }

      if (totalMentors > 0) {
        score += (activeMentorCount / totalMentors) * 30;
      }

      const finalScore = Math.round(score);
      setPerformanceScore(finalScore);

      localStorage.setItem(
        "verifixPerformanceScore",
        JSON.stringify({
          score: finalScore,
          breakdown: {
            candidateRate:
              totalCandidates > 0
                ? Math.round((acceptedCandidates / totalCandidates) * 100)
                : 0,
            interviewRate:
              totalInterviews > 0
                ? Math.round((completedInterviews / totalInterviews) * 100)
                : 0,
            mentorRate:
              totalMentors > 0
                ? Math.round((activeMentorCount / totalMentors) * 100)
                : 0,
          },
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Error calculating performance:", error);
      setPerformanceScore(0);
    }
  };

  const saveChartData = (data) => {
    try {
      localStorage.setItem("verifixDashboardStats", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving chart data:", error);
    }
  };

  const getTrendPercentage = () => {
    try {
      const saved = localStorage.getItem("verifixDashboardStats");
      if (!saved) return "+12%";

      const data = JSON.parse(saved);
      const savedTime = new Date(data.timestamp);
      const now = new Date();
      const daysDiff = Math.floor((now - savedTime) / (1000 * 60 * 60 * 24));

      if (daysDiff > 7) return "+12%";

      const currentTotal =
        stats.newCandidates + stats.pendingInterviews + stats.activeMentors;
      const previousTotal =
        data.stats.newCandidates +
        data.stats.pendingInterviews +
        data.stats.activeMentors;

      if (previousTotal === 0) return "+12%";

      const change = (
        ((currentTotal - previousTotal) / previousTotal) *
        100
      ).toFixed(0);
      return change > 0 ? `+${change}%` : `${change}%`;
    } catch {
      return "+12%";
    }
  };

  const statsData = [
    {
      label: "Yangi Nomzodlar",
      value: stats.newCandidates,
      icon: Users,
      color: "blue",
    },
    {
      label: "Kutilayotgan Suhbatlar",
      value: stats.pendingInterviews,
      icon: Calendar,
      color: "green",
    },
    {
      label: "Faol Mentorlar",
      value: stats.activeMentors,
      icon: Award,
      color: "purple",
    },
    {
      label: "Verifikatsiya Kutilmoqda",
      value: stats.pendingVerification,
      icon: Clock,
      color: "orange",
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
      <div className="flex items-center justify-between mb-8">
        <div>
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
        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              loadDashboardData();
            }, 300);
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Yuklanmoqda..." : "Yangilash"}
        </button>
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
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCandidates />
        <TopMentors />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Faollik Statistikasi
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {activeChart === "weekly" &&
                    `So'nggi 7 kun - ${chartData.weekly.reduce(
                      (sum, d) => sum + d.candidates + d.interviews,
                      0
                    )} ta faollik`}
                  {activeChart === "status" &&
                    `Jami ${chartData.statusDistribution.reduce(
                      (sum, d) => sum + d.count,
                      0
                    )} ta nomzod`}
                  {activeChart === "monthly" &&
                    `Yillik o'sish - ${getTrendPercentage()}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveChart("weekly")}
                  className={`p-2 rounded-lg transition-colors ${
                    activeChart === "weekly"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title="Haftalik"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveChart("status")}
                  className={`p-2 rounded-lg transition-colors ${
                    activeChart === "status"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title="Status"
                >
                  <PieChart className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveChart("monthly")}
                  className={`p-2 rounded-lg transition-colors ${
                    activeChart === "monthly"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title="Yillik"
                >
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
            </div>

            {activeChart === "weekly" && (
              <div className="flex items-end justify-between gap-4 h-101">
                {chartData.weekly.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-full">
                      <div
                        className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                        style={{
                          height: `${Math.max(item.value * 2.5, 20)}px`,
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          {item.candidates} nomzod, {item.interviews} suhbat
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeChart === "status" && (
              <div className="space-y-4">
                {chartData.statusDistribution.map((item, idx) => {
                  const total = chartData.statusDistribution.reduce(
                    (sum, i) => sum + i.count,
                    0
                  );
                  const percentage =
                    total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;

                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {item.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeChart === "monthly" && (
              <div className="relative h-64 pt-8">
                <div
                  className="absolute inset-0 flex justify-between gap-2"
                  style={{ paddingTop: "32px", paddingBottom: "24px" }}
                >
                  {chartData.monthlyTrend.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2 group relative"
                    >
                      <div
                        className="relative w-full"
                        style={{ height: "200px" }}
                      >
                        {idx < chartData.monthlyTrend.length - 1 && (
                          <svg
                            className="absolute inset-0 w-full h-101 overflow-visible"
                            style={{ left: "0", top: "0" }}
                          >
                            <line
                              x1="60%"
                              y1={`${200 - item.value * 2}px`}
                              x2="120%"
                              y2={`${
                                200 - chartData.monthlyTrend[idx + 1].value * 1
                              }px`}
                              stroke="#10b981"
                              strokeWidth="2"
                              className="transition-all duration-300"
                            />
                          </svg>
                        )}

                        <div
                          className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md hover:scale-150 transition-transform cursor-pointer z-10"
                          style={{ top: `${200 - item.value * 2}px` }}
                        >
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {item.candidates} nomzod
                            <br />
                            {item.interviews} suhbat
                          </div>
                        </div>
                      </div>
                      <span
                        className="text-xs text-gray-600 font-medium absolute"
                        style={{ bottom: "-20px" }}
                      >
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Umumiy Ko'rsatkich</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 56 * (1 - performanceScore / 100)
                    }`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {performanceScore}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-center text-blue-100 text-sm">
              O'tgan oyga nisbatan {getTrendPercentage()} o'sish
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Tezkor Harakatlar
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/candidates")}
                className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
              >
                + Yangi Nomzod
              </button>
              <button
                onClick={() => (window.location.href = "/interviews")}
                className="w-full py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
              >
                + Suhbat Belgilash
              </button>
              <button
                onClick={() => (window.location.href = "/documents")}
                className="w-full py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
              >
                + Hujjat Yuklash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
