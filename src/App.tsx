import { Routes, Route } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage"
import './App.css'
import { DynamicUI } from "./pages/DynamicUI"

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/customui" element={<DynamicUI />} />
        </Routes>
    )
}

export default App
