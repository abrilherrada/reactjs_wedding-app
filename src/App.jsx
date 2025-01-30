import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import Countdown from './Components/Countdown/Countdown';
import EventInfo from './Components/EventInfo/EventInfo';
import RSVP from './Components/RSVP/RSVP';
import Gifts from './Components/Gifts/Gifts';
import FAQ from './Components/FAQ/FAQ';
import './App.css';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Hero />
          <Countdown />
          <div id="info">
            <EventInfo />
          </div>
          <div id="rsvp">
            <RSVP />
          </div>
          <div id="gifts">
            <Gifts />
          </div>
          <div id="faq">
            <FAQ />
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
