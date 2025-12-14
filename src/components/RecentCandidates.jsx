// components/RecentCandidates.jsx - FULL WORKING VERSION
import React, { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";

const RecentCandidates = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = () => {
    try {
      const stored = localStorage.getItem("verifixCandidates");
      if (stored) {
        const all = JSON.parse(stored);
        // Get last 4 candidates
        const recent = all.slice(-4).reverse();
        setCandidates(recent);
      }
    } catch (error) {
      console.error("Error loading recent candidates:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Oxirgi Nomzodlar</h3>
        <span className="text-sm text-gray-500">{candidates.length} ta</span>
      </div>

      <div className="space-y-4">
        {candidates.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Hozircha nomzodlar yo'q
          </p>
        ) : (
          candidates.map((candidate, idx) => (
            <div
              key={candidate.id || idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {candidate.name}
                  </h4>
                  <p className="text-sm text-gray-600">{candidate.position}</p>
                </div>
              </div>
              <StatusBadge status={candidate.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentCandidates;
