import Hero from '../components/Hero';
import ContactForm from '../components/ContactForm';
import ChatBot from '../components/ChatBot';

const LandingPage = () => {
  return (
    <div className="antialiased">
      <Hero />
      <div id="contact">
        <ContactForm />
      </div>
      <ChatBot />
    </div>
  );
};

export default LandingPage;