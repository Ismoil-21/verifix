import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Galaxy from "../Galaxy";

const AuthPage = ({ isRegister = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(!isRegister);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    position: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Rasm hajmi 5MB dan oshmasligi kerak" });
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email kiritish majburiy";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email noto'g'ri formatda";
    }

    if (!formData.password) {
      newErrors.password = "Parol kiritish majburiy";
    } else if (formData.password.length < 6) {
      newErrors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak";
    }

    if (!isLoginMode) {
      if (!formData.fullName) {
        newErrors.fullName = "Ism-familiya kiritish majburiy";
      } else if (formData.fullName.length < 3) {
        newErrors.fullName =
          "Ism-familiya kamida 3 ta belgidan iborat bo'lishi kerak";
      }

      if (!formData.phone) {
        newErrors.phone = "Telefon raqam kiritish majburiy";
      } else if (!/^\+998\d{9}$/.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone =
          "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak";
      }

      if (!formData.position) {
        newErrors.position = "Lavozim tanlash majburiy";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Parollar mos kelmadi";
      }

      if (!imagePreview) {
        newErrors.image = "Profil rasmini yuklash majburiy";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLoginMode) {
        const users = JSON.parse(localStorage.getItem("verifixUsers") || "[]");
        const user = users.find(
          (u) => u.email === formData.email && u.password === formData.password
        );

        if (user) {
          login(user);
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        } else {
          setErrors({ email: "Email yoki parol noto'g'ri" });
        }
      } else {
        try {
          const userData = {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone,
            position: formData.position,
            profileImage: imagePreview,
          };

          register(userData);
          navigate("/dashboard", { replace: true });
        } catch (error) {
          setErrors({ email: error.message });
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ email: "Xatolik yuz berdi. Qayta urinib ko'ring" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrors({});
    setFormData({
      email: "",
      password: "",
      fullName: "",
      phone: "",
      position: "",
      confirmPassword: "",
    });
    setImagePreview(null);
    setProfileImage(null);

    if (isLoginMode) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div
        className="flex items-center justify-center bg-black"
        style={{ width: "100%", height: "600px", position: "relative" }}
      >
        <Galaxy />

        <div className="absolute w-full max-w-md z-10">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-transparent px-6 py-3 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
              <Shield className="w-10 h-10 text-white" />
              <h1 className="text-3xl font-bold text-white">Verifix</h1>
            </div>
            <p className="text-white text-lg mt-4 font-medium">
              Smart HR Platform
            </p>
            <p className="text-white text-sm mt-2">
              Zamonaviy HR boshqaruv tizimi
            </p>
          </div>

          <div className="rounded-2xl opacity-90 bg-gray-900 shadow-2xl p-8 animate-slide-up">
            <div className="flex gap-2 mb-8 px-2 opacity-80 bg-white p-1 rounded-xl sticky top-4">
              <button
                onClick={() => {
                  if (!isLoginMode) switchMode();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  isLoginMode
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Kirish
              </button>
              <button
                onClick={() => {
                  if (isLoginMode) switchMode();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  !isLoginMode
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Ro'yxatdan o'tish
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 h-88 overflow-scroll"
            >
              {!isLoginMode && (
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div
                      className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                        errors.image ? "border-red-500" : "border-blue-600"
                      } shadow-lg mb-4 transition-all group-hover:shadow-xl`}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <User className="w-16 h-16 text-blue-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg group-hover:scale-110">
                      <Upload className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {errors.image && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.image}</span>
                    </div>
                  )}
                  <p className="text-white text-xs mt-2">
                    Rasmni yuklang (max 5MB)
                  </p>
                </div>
              )}

              {!isLoginMode && (
                <div className="animate-fade-in">
                  <label className="block text-white font-semibold mb-2 items-center gap-2">
                    <User className="w-4 h-4 text-white" />
                    Ism-Familiya *
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-white absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="To'liq ismingizni kiriting"
                      className={`w-full text-white pl-10 pr-4 py-3 border-2 ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    />
                  </div>
                  {errors.fullName && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="animate-fade-in">
                <label className="block text-white font-semibold mb-2 items-center gap-2">
                  <Mail className="w-4 h-4 text-white" />
                  Email *
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-white absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@verifix.com"
                    className={`w-full pl-10 text-white pr-4 py-3 border-2 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {!isLoginMode && (
                <div className="animate-fade-in">
                  <label className="block text-white font-semibold mb-2 items-center gap-2">
                    <Phone className="w-4 h-4 text-white" />
                    Telefon *
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-white absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+998 90 123 45 67"
                      className={`w-full pl-10 text-white pr-4 py-3 border-2 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {!isLoginMode && (
                <div className="animate-fade-in">
                  <label className="block text-white font-semibold mb-2 items-center gap-2">
                    <Briefcase className="w-4 h-4 text-white" />
                    Lavozim *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-5 h-5 text-white absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className={`w-full pl-10 text-gray-400 pr-4 py-3 border-2 ${
                        errors.position ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-transparent transition-all cursor-pointer`}
                    >
                      <option value="">Lavozimni tanlang</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.position && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.position}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="animate-fade-in">
                <label className="block text-white font-semibold mb-2 items-center gap-2">
                  <Lock className="w-4 h-4 text-white" />
                  Parol *
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-white absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 text-white pr-12 py-3 border-2 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 text-white h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {!isLoginMode && (
                <div className="animate-fade-in">
                  <label className="block text-white font-semibold mb-2 items-center gap-2">
                    <Lock className="w-4 h-4 text-white" />
                    Parolni Tasdiqlang *
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-white absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 text-white py-3 border-2 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 text-white h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Kuting...</span>
                  </>
                ) : (
                  <>
                    {isLoginMode ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Kirish</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Ro'yxatdan o'tish</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-white">
                Ro'yxatdan o'tish orqali siz{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Foydalanish shartlari
                </a>{" "}
                va{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Maxfiylik siyosati
                </a>{" "}
                ga rozisiz
              </p>
            </div>
          </div>

          <div className="text-center my-5 text-white text-sm">
            <p>© 2025 Verifix. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
