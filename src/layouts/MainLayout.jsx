import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-8">
        <Outlet context={{ setSelectedCandidate }} />
      </div>
    </div>
  );
};

export default MainLayout;
