// pages/InterviewsPage.jsx - FULL WORKING VERSION
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  CheckCircle,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showAddModal]);

  useEffect(() => {
    loadInterviews();
  }, []);

  useEffect(() => {
    filterInterviews();
  }, [searchQuery, selectedDate, interviews]);

  const loadInterviews = () => {
    try {
      const stored = localStorage.getItem("verifixInterviews");
      if (stored) {
        setInterviews(JSON.parse(stored));
      } else {
        // Initialize with demo data
        const demoData = [
          {
            id: 1,
            candidate: "Alisher Karimov",
            position: "Frontend Developer",
            date: "2025-12-15",
            time: "10:00",
            duration: "45 daqiqa",
            type: "online",
            interviewer: "Jamshid Toshmatov",
            status: "scheduled",
            meetLink: "meet.google.com/abc-defg-hij",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            candidate: "Zilola Rahimova",
            position: "UX Designer",
            date: "2025-12-15",
            time: "14:00",
            duration: "60 daqiqa",
            type: "offline",
            interviewer: "Nigora Saidova",
            status: "scheduled",
            location: "Ofis - 3-qavat, 305-xona",
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            candidate: "Sardor Tursunov",
            position: "Backend Developer",
            date: "2025-12-16",
            time: "11:00",
            duration: "45 daqiqa",
            type: "online",
            interviewer: "Bobur Alijonov",
            status: "scheduled",
            meetLink: "zoom.us/j/123456789",
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem("verifixInterviews", JSON.stringify(demoData));
        setInterviews(demoData);
      }
    } catch (error) {
      console.error("Error loading interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterInterviews = () => {
    let filtered = interviews;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (i) =>
          i.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.interviewer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    if (selectedDate !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((i) => {
        const interviewDate = new Date(i.date);
        interviewDate.setHours(0, 0, 0, 0);

        if (selectedDate === "today") {
          return interviewDate.getTime() === today.getTime();
        } else if (selectedDate === "week") {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return interviewDate >= today && interviewDate <= weekFromNow;
        } else if (selectedDate === "month") {
          const monthFromNow = new Date(today);
          monthFromNow.setMonth(monthFromNow.getMonth() + 1);
          return interviewDate >= today && interviewDate <= monthFromNow;
        }
        return true;
      });
    }

    setFilteredInterviews(filtered);
  };

  const deleteInterview = (id) => {
    if (window.confirm("Haqiqatan ham bu suhbatni o'chirmoqchimisiz?")) {
      const updated = interviews.filter((i) => i.id !== id);
      setInterviews(updated);
      localStorage.setItem("verifixInterviews", JSON.stringify(updated));
    }
  };

  const completeInterview = (id) => {
    const updated = interviews.map((i) =>
      i.id === id ? { ...i, status: "completed" } : i
    );
    setInterviews(updated);
    localStorage.setItem("verifixInterviews", JSON.stringify(updated));
  };

  const upcomingInterviews = filteredInterviews.filter(
    (i) => i.status === "scheduled"
  );
  const completedInterviews = filteredInterviews.filter(
    (i) => i.status === "completed"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Suhbatlar</h2>
          <p className="text-gray-600 mt-1">
            Jami {interviews.length} ta suhbat
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Suhbat Belgilash
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Suhbat qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="all">Barcha sanalar</option>
            <option value="today">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-600" />
            Kutilayotgan Suhbatlar ({upcomingInterviews.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onDelete={deleteInterview}
                onComplete={completeInterview}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Interviews */}
      {completedInterviews.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            Yakunlangan Suhbatlar ({completedInterviews.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onDelete={deleteInterview}
              />
            ))}
          </div>
        </div>
      )}

      {filteredInterviews.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Suhbat topilmadi</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddInterviewModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newInterview) => {
            const updated = [
              ...interviews,
              { ...newInterview, id: Date.now(), status: "scheduled" },
            ];
            setInterviews(updated);
            localStorage.setItem("verifixInterviews", JSON.stringify(updated));
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

const InterviewCard = ({ interview, onDelete, onComplete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {interview.candidate
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800">
              {interview.candidate}
            </h4>
            <p className="text-sm text-gray-600">{interview.position}</p>
          </div>
        </div>
        <StatusBadge
          status={interview.status === "scheduled" ? "interview" : "accepted"}
        />
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{interview.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {interview.time} ({interview.duration})
          </span>
        </div>
        {interview.type === "online" ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Video className="w-4 h-4" />
            <a
              href={`https://${interview.meetLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {interview.meetLink}
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{interview.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span className="text-sm">Interviewer: {interview.interviewer}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        {interview.status === "scheduled" && (
          <>
            <button
              onClick={() => onComplete(interview.id)}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Yakunlash
            </button>
            <button
              onClick={() => onDelete(interview.id)}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
        {interview.status === "completed" && (
          <button
            onClick={() => onDelete(interview.id)}
            className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            O'chirish
          </button>
        )}
      </div>
    </div>
  );
};

// Add Interview Modal
const AddInterviewModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    candidate: "",
    position: "",
    date: "",
    time: "",
    duration: "45 daqiqa",
    type: "online",
    interviewer: "",
    meetLink: "",
    location: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 ">
      <div className="absolute inset-0 bg-black opacity-70 -z-50"></div>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            Yangi Suhbat Belgilash
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nomzod *
              </label>
              <input
                type="text"
                required
                value={formData.candidate}
                onChange={(e) =>
                  setFormData({ ...formData, candidate: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Lavozim *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Sana *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Vaqt *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Turi *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Interviewer *
            </label>
            <input
              type="text"
              required
              value={formData.interviewer}
              onChange={(e) =>
                setFormData({ ...formData, interviewer: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {formData.type === "online" ? (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Meet Link *
              </label>
              <input
                type="text"
                required
                value={formData.meetLink}
                onChange={(e) =>
                  setFormData({ ...formData, meetLink: e.target.value })
                }
                placeholder="meet.google.com/abc-defg-hij"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Manzil *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Ofis - 3-qavat, 305-xona"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Belgilash
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Bekor qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewsPage;
