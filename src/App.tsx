import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FightAnalyticsPage from './pages/FightAnalyticsPage';
import IndividualFightPage from './pages/IndividualFightPage';
import FighterProfilePage from './pages/FighterProfilePage';
import AccuracyTrackerPage from './pages/AccuracyTrackerPage';
import HowItWorksPage from './pages/HowItWorksPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fights" element={<FightAnalyticsPage />} />
          <Route path="/fight/:fightId" element={<IndividualFightPage />} />
          <Route path="/fighter/:fighterId" element={<FighterProfilePage />} />
          <Route path="/accuracy" element={<AccuracyTrackerPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
