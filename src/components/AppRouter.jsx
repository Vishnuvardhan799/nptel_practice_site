import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz" element={<App />} />
        <Route path="/quiz/:year" element={<App />} />
        <Route path="/quiz/:year/:week" element={<App />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
