import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        {/* لاحقًا تضيف صفحات تانية هون */}
      </Routes>
    </Router>
  );
};

export default App;
