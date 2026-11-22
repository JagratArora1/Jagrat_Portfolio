import { About, Contact, Experience, Feedbacks, Footer, Hero, Navbar, Tech, Works, StarsCanvas } from './components' ;

const App = () => {
  return (
    <div className="relative z-0 bg-primary">
      {/* Navbar is position:fixed, so it sits outside the hero wrapper without moving. */}
      <Navbar />
      <main>
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <div className="relative z-0">
          <Contact />
          <Footer />
          <StarsCanvas />
        </div>
      </main>
    </div>
  )
}

export default App
