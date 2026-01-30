import React from 'react'
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Scoreboard from './pages/Scoreboard';
import Standings from './pages/Standings';
import CountryPicks from './pages/CountryPicks';
import SignUp from './pages/SignUp';
import MedalTable from './pages/MedalTable';
import MyRoster from './pages/MyRoster';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/countrypicks" element={<CountryPicks />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/medaltable" element={<MedalTable />} />
        <Route path="/myroster" element={<MyRoster />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
