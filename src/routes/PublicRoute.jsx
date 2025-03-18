import Navbar from '../Components/Navbar/Navbar';
import Hero from '../Components/Hero/Hero';
import Countdown from '../Components/Countdown/Countdown';
import EventInfo from '../Components/EventInfo/EventInfo';
import RSVP from '../Components/RSVP/RSVP';
import Lodging from '../Components/Lodging/Lodging';
import Transportation from '../Components/Transportation/Transportation';
import Gifts from '../Components/Gifts/Gifts';
import FAQ from '../Components/FAQ/FAQ';

const PublicRoute = () => {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Hero />
        <Countdown />
        <section id="info">
          <EventInfo />
        </section>
        <section id="rsvp">
          <RSVP />
        </section>
        <section id="gifts">
          <Gifts />
        </section>
        <section id="lodging">
          <Lodging />
        </section>
        <section id="transportation">
          <Transportation />
        </section>
        <section id="faq">
          <FAQ />
        </section>
      </main>
    </div>
  )
};

export default PublicRoute;
