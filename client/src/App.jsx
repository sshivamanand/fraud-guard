import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./components/Landing";
import FraudPredictor from "./components/FraudPrediction";
import "../public/styles.css"

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/predict" element={<FraudPredictor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App