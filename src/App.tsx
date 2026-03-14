import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { DynamicUI } from "./pages/DynamicUI";
import { NotFound } from "./pages/NotFound";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<DynamicUI />} />

      {/* fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
