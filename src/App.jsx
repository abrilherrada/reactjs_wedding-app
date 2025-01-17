import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import './App.css';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/rsvp" element={<div>RSVP Page</div>} />
          <Route path="/info" element={<div>Info Page</div>} />
          <Route path="/faq" element={<div>FAQ Page</div>} />
        </Routes>
        <Hero/>
      </div>
    </Router>
  )
}

export default App
