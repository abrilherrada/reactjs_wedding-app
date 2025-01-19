import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import Countdown from './Components/Countdown/Countdown';
import EventInfo from './Components/EventInfo/EventInfo';
import RSVP from './Components/RSVP/RSVP';
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
          <div id="faq">
            <div>FAQ Page</div>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
