import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Search,
  Filter,
  Upload,
  Mail,
  Phone,
  Briefcase,
  CheckCircle,
  Trash2,
  Edit,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import Timeline from "../components/Timeline";
import { useAuth } from "../hooks/useAuth";

const CandidatesPage = () => {
  const { setSelectedCandidate } = useOutletContext();
  const { currentUser } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
    loadCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [searchQuery, filterStatus, candidates]);

  const loadCandidates = () => {
    try {
      const stored = localStorage.getItem("verifixCandidates");
      if (stored) {
        setCandidates(JSON.parse(stored));
      } else {
        // Initialize with demo data
        const demoData = [
          {
            id: 1,
            name: "Alisher Karimov",
            position: "Frontend Developer",
            email: "alisher@example.com",
            phone: "+998 90 123 45 67",
            status: "interview",
            stage: 2,
            verified: true,
            experience: "3 yil",
            skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Zilola Rahimova",
            position: "UX Designer",
            email: "zilola@example.com",
            phone: "+998 91 234 56 78",
            status: "verification",
            stage: 1,
            verified: false,
            experience: "2 yil",
            skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Sardor Tursunov",
            position: "Backend Developer",
            email: "sardor@example.com",
            phone: "+998 93 345 67 89",
            status: "test",
            stage: 3,
            verified: true,
            experience: "4 yil",
            skills: ["Node.js", "Python", "PostgreSQL", "Docker"],
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem("verifixCandidates", JSON.stringify(demoData));
        setCandidates(demoData);
      }
    } catch (error) {
      console.error("Error loading candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    setFilteredCandidates(filtered);
  };

  const deleteCandidate = (id) => {
    if (window.confirm("Haqiqatan ham bu nomzodni o'chirmoqchimisiz?")) {
      const updated = candidates.filter((c) => c.id !== id);
      setCandidates(updated);
      localStorage.setItem("verifixCandidates", JSON.stringify(updated));
    }
  };

  const updateCandidateStatus = (id, newStatus, newStage) => {
    const updated = candidates.map((c) =>
      c.id === id ? { ...c, status: newStatus, stage: newStage } : c
    );
    setCandidates(updated);
    localStorage.setItem("verifixCandidates", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Nomzodlar</h2>
          <p className="text-gray-600 mt-1">
            Jami {candidates.length} ta nomzod
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md transform hover:scale-105"
        >
          <Upload className="w-5 h-5" />
          Yangi Nomzod Qo'shish
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Nomzod qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">Barcha statuslar</option>
            <option value="interview">Suhbat</option>
            <option value="verification">Tekshiruv</option>
            <option value="accepted">Qabul qilindi</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Nomzod topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex items-center gap-4 flex-1"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl relative shadow-lg">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    {candidate.verified && (
                      <CheckCircle className="w-5 h-5 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {candidate.name}
                    </h3>
                    <p className="text-gray-600">{candidate.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={candidate.status} />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">
                    {candidate.experience} tajriba
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-0 overflow-hidden">
                <Timeline stage={candidate.stage} />
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    updateCandidateStatus(candidate.id, "interview", 2)
                  }
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Suhbat Belgilash
                </button>
                <button
                  onClick={() =>
                    updateCandidateStatus(candidate.id, "accepted", 4)
                  }
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Qabul Qilish
                </button>
                <button
                  onClick={() => deleteCandidate(candidate.id)}
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
        <AddCandidateModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newCandidate) => {
            const updated = [
              ...candidates,
              { ...newCandidate, id: Date.now() },
            ];
            setCandidates(updated);
            localStorage.setItem("verifixCandidates", JSON.stringify(updated));
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

// Add Candidate Modal Component
const AddCandidateModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    status: "verification",
    stage: 1,
    verified: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-50 bg-black opacity-60"></div>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-2xl font-bold text-gray-800">
            Yangi Nomzod Qo'shish
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Telefon *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
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
              placeholder="3 yil"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Ko'nikmalar (vergul bilan ajrating) *
            </label>
            <input
              type="text"
              required
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              placeholder="React, JavaScript, TypeScript"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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

export default CandidatesPage;
