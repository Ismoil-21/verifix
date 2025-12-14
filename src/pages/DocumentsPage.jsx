import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  File,
  CheckCircle,
  Clock,
  X,
  Trash2,
  Eye,
} from "lucide-react";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
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
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchQuery, selectedType, selectedStatus, documents]);

  const loadDocuments = () => {
    try {
      const stored = localStorage.getItem("verifixDocuments");
      if (stored) {
        setDocuments(JSON.parse(stored));
      } else {
        const demoData = [
          {
            id: 1,
            name: "Alisher Karimov - Shartnoma",
            type: "contract",
            candidate: "Alisher Karimov",
            uploadDate: "2025-12-10",
            size: "2.4 MB",
            status: "signed",
            signedBy: "HR Manager",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Sardor Tursunov - Sertifikat",
            type: "certificate",
            candidate: "Sardor Tursunov",
            uploadDate: "2025-12-11",
            size: "3.2 MB",
            status: "signed",
            signedBy: "Verification Team",
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Malika Yusupova - Buyruq",
            type: "order",
            candidate: "Malika Yusupova",
            uploadDate: "2025-12-09",
            size: "1.1 MB",
            status: "signed",
            signedBy: "Director",
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem("verifixDocuments", JSON.stringify(demoData));
        setDocuments(demoData);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.candidate.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((d) => d.type === selectedType);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((d) => d.status === selectedStatus);
    }

    setFilteredDocuments(filtered);
  };

  const deleteDocument = (id) => {
    if (window.confirm("Haqiqatan ham bu hujjatni o'chirmoqchimisiz?")) {
      const updated = documents.filter((d) => d.id !== id);
      setDocuments(updated);
      localStorage.setItem("verifixDocuments", JSON.stringify(updated));
    }
  };

  const updateDocumentStatus = (id, newStatus) => {
    const updated = documents.map((d) =>
      d.id === id
        ? {
            ...d,
            status: newStatus,
            signedBy: newStatus === "signed" ? "HR Manager" : d.signedBy,
          }
        : d
    );
    setDocuments(updated);
    localStorage.setItem("verifixDocuments", JSON.stringify(updated));
  };

  const getDocumentIcon = (type) => {
    return <FileText className="w-5 h-5 text-indigo-600" />;
  };

  const getStatusConfig = (status) => {
    const configs = {
      signed: { label: "Imzolangan", color: "green", icon: CheckCircle },
      pending: { label: "Kutilmoqda", color: "yellow", icon: Clock },
    };
    return configs[status] || configs.pending;
  };

  const stats = {
    total: documents.length,
    signed: documents.filter((d) => d.status === "signed").length,
    pending: documents.filter((d) => d.status === "pending").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Hujjatlar</h2>
          <p className="text-gray-600 mt-1">
            Jami {documents.length} ta hujjat
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md transform hover:scale-105"
        >
          <Upload className="w-5 h-5" />
          Hujjat Yuklash
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Jami Hujjatlar</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <File className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Imzolangan</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {stats.signed}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Kutilmoqda</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tasdiqlangan</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {stats.verified}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Hujjat qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">Barcha turlar</option>
            <option value="contract">Shartnomalar</option>
            <option value="resume">Resume</option>
            <option value="certificate">Sertifikatlar</option>
            <option value="order">Buyruqlar</option>
            <option value="id">ID Card</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">Barcha statuslar</option>
            <option value="signed">Imzolangan</option>
            <option value="pending">Kutilmoqda</option>
            <option value="verified">Tasdiqlangan</option>
            <option value="rejected">Rad etildi</option>
          </select>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Hujjat topilmadi</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Hujjat nomi
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nomzod
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Sana
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Hajm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Holat
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => {
                const statusConfig = getStatusConfig(doc.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {doc.name}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {doc.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{doc.candidate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{doc.uploadDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{doc.size}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 bg-${statusConfig.color}-100 text-${statusConfig.color}-700 rounded-full text-sm font-medium`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {doc.status === "pending" && (
                          <button
                            onClick={() =>
                              updateDocumentStatus(doc.id, "signed")
                            }
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Imzolash"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Ko'rish"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Yuklab olish"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddDocumentModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newDocument) => {
            const updated = [...documents, { ...newDocument, id: Date.now() }];
            setDocuments(updated);
            localStorage.setItem("verifixDocuments", JSON.stringify(updated));
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

const AddDocumentModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "contract",
    candidate: "",
    uploadDate: new Date().toISOString().split("T")[0],
    size: "",
    status: "pending",
    signedBy: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  p-4">
      <div className="fixed inset-0 -z-50 bg-black opacity-60"></div>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            Yangi Hujjat Yuklash
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Hujjat nomi *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Alisher Karimov - Shartnoma"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Hujjat turi *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="contract">Shartnoma</option>
              <option value="resume">Resume</option>
              <option value="certificate">Sertifikat</option>
              <option value="order">Buyruq</option>
              <option value="id">ID Card</option>
            </select>
          </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fayl yuklash
            </label>
            <label
              htmlFor="fileInput"
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer block"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                Faylni tanlang yoki shu yerga torting
              </p>
              <p className="text-sm text-gray-500">
                PDF, DOC, DOCX, JPG, PNG (max 10MB)
              </p>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Yuklash
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

export default DocumentsPage;
