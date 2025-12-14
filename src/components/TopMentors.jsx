import React, { useState, useEffect } from "react";
import { Star, CheckCircle } from "lucide-react";

const TopMentors = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = () => {
    try {
      const stored = localStorage.getItem("verifixMentors");
      if (stored) {
        const all = JSON.parse(stored);
        const top = all.sort((a, b) => b.rating - a.rating).slice(0, 4);
        setMentors(top);
      }
    } catch (error) {
      console.error("Error loading top mentors:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Top Mentorlar</h3>
        <span className="text-sm text-gray-500">{mentors.length} ta</span>
      </div>

      <div className="space-y-4">
        {mentors.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Hozircha mentorlar yo'q
          </p>
        ) : (
          mentors.map((mentor, idx) => (
            <div
              key={mentor.id || idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {mentor.verified && (
                    <CheckCircle className="w-4 h-4 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{mentor.name}</h4>
                  <p className="text-sm text-gray-600">
                    {mentor.students} ta o'quvchi
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-bold text-gray-800">{mentor.rating}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopMentors;
