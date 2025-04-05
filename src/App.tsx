import {LandingPage} from "./pages/LandingPage.tsx";
import './App.css'
import {NavigationBar} from "./components/NavigationBar.tsx";

function App() {
    return (
        <>
            <NavigationBar/>
            <LandingPage/>
        </>
    )
}

export default App
