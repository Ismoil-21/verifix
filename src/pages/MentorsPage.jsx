// pages/MentorsPage.jsx - FULL WORKING VERSION
import React, { useState, useEffect } from "react";
import {
  Star,
  CheckCircle,
  Users,
  BookOpen,
  TrendingUp,
  Search,
  Filter,
  UserPlus,
  Trash2,
  Edit,
} from "lucide-react";

const MentorsPage = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
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
    loadMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [searchQuery, filterSpecialty, mentors]);

  const loadMentors = () => {
    try {
      const stored = localStorage.getItem("verifixMentors");
      if (stored) {
        setMentors(JSON.parse(stored));
      } else {
        const demoData = [
          {
            id: 1,
            name: "Jasur Hakimbekov",
            specialty: "Frontend Development",
            rating: 4.9,
            students: 45,
            verified: true,
            active: true,
            courses: 3,
            attendance: 95,
            completionRate: 88,
            experience: "7 yil",
            reviews: 38,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Aziz Badalov",
            specialty: "Full Stack Developer",
            rating: 4.8,
            students: 38,
            verified: true,
            active: true,
            courses: 2,
            attendance: 92,
            completionRate: 91,
            experience: "5 yil",
            reviews: 32,
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Behruz Satimbayev",
            specialty: "Full Stack Development",
            rating: 4.7,
            students: 42,
            verified: true,
            active: true,
            courses: 4,
            attendance: 89,
            completionRate: 85,
            experience: "6 yil",
            reviews: 35,
            createdAt: new Date().toISOString(),
          },
          {
            id: 4,
            name: "Ziyovuddin Abdurashidov",
            specialty: "Frontend Development",
            rating: 4.9,
            students: 45,
            verified: true,
            active: true,
            courses: 3,
            attendance: 95,
            completionRate: 88,
            experience: "3 yil",
            reviews: 38,
            createdAt: new Date().toISOString(),
          }
        ];
        localStorage.setItem("verifixMentors", JSON.stringify(demoData));
        setMentors(demoData);
      }
    } catch (error) {
      console.error("Error loading mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = mentors;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Specialty filter
    if (filterSpecialty !== "all") {
      filtered = filtered.filter((m) => m.specialty === filterSpecialty);
    }

    setFilteredMentors(filtered);
  };

  const deleteMentor = (id) => {
    if (window.confirm("Haqiqatan ham bu mentorni o'chirmoqchimisiz?")) {
      const updated = mentors.filter((m) => m.id !== id);
      setMentors(updated);
      localStorage.setItem("verifixMentors", JSON.stringify(updated));
    }
  };

  const toggleVerification = (id) => {
    const updated = mentors.map((m) =>
      m.id === id ? { ...m, verified: !m.verified } : m
    );
    setMentors(updated);
    localStorage.setItem("verifixMentors", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Mentorlar</h2>
          <p className="text-gray-600 mt-1">Jami {mentors.length} ta mentor</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md transform hover:scale-105"
        >
          <UserPlus className="w-5 h-5" />
          Yangi Mentor
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Mentor qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="all">Barcha mutaxassisliklar</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="UX/UI Design">UX/UI Design</option>
            <option value="Mobile Development">Mobile Development</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Mentors Grid */}
      {filteredMentors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Mentor topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {mentor.verified && (
                      <CheckCircle className="w-5 h-5 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-600">{mentor.specialty}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {mentor.experience} tajriba
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-yellow-600 fill-current" />
                  <span className="font-bold text-yellow-700">
                    {mentor.rating}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-600">
                    {mentor.students}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">O'quvchilar</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-600">
                    {mentor.courses}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Kurslar</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-purple-600">
                    {mentor.attendance}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Davomat</div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Kurs yakunlash</span>
                    <span className="font-semibold text-gray-800">
                      {mentor.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${mentor.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => toggleVerification(mentor.id)}
                  className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium ${
                    mentor.verified
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {mentor.verified ? "Tasdiqlangan" : "Tasdiqlash"}
                </button>
                <button
                  onClick={() => deleteMentor(mentor.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddMentorModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newMentor) => {
            const updated = [
              ...mentors,
              {
                ...newMentor,
                id: Date.now(),
                rating: newMentor.rating,
                students: newMentor.students,
                reviews: 0,
                verified: false,
                active: true,
                createdAt: new Date().toISOString(),
              },
            ];
            setMentors(updated);
            localStorage.setItem("verifixMentors", JSON.stringify(updated));
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

const AddMentorModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    rating: "",
    students: "",
    experience: "",
    courses: "",
    attendance: "",
    completionRate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      courses: parseInt(formData.courses),
      attendance: parseInt(formData.attendance),
      completionRate: parseInt(formData.completionRate),
      rating: parseFloat(formData.rating),
      students: parseInt(formData.students),
    });
    setFormData({
      name: "",
      specialty: "",
      rating: "",
      students: "",
      experience: "",
      courses: "",
      attendance: "",
      completionRate: "",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-50 bg-black opacity-60"></div>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            Yangi Mentor Qo'shish
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Ism-Familiya *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Mutaxassislik *
            </label>
            <select
              required
              value={formData.specialty}
              onChange={(e) =>
                setFormData({ ...formData, specialty: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="">Tanlang</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
              <option value="UX/UI Design">UX/UI Design</option>
              <option value="Mobile Development">Mobile Development</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tajriba *
            </label>
            <input
              type="text"
              required
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              placeholder="5 yil"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Reytingi *
            </label>
            <input
              type="text"
              required
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              placeholder="4.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              O'quvchilar soni *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.students}
              onChange={(e) =>
                setFormData({ ...formData, students: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Kurslar soni *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.courses}
                onChange={(e) =>
                  setFormData({ ...formData, courses: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Davomat (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.attendance}
                onChange={(e) =>
                  setFormData({ ...formData, attendance: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Yakunlash (%) *
            </label>
            <input
              type="number"
              required
              min="0"
              max="100"
              value={formData.completionRate}
              onChange={(e) =>
                setFormData({ ...formData, completionRate: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Qo'shish
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

export default MentorsPage;
