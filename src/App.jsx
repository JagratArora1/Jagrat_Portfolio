import { About, Contact, Experience, Feedbacks, Footer, Hero, Navbar, Tech, Works, StarsCanvas } from './components' ;
import { BackToTop, CursorGlow, ScrollProgress, SmoothScroll } from './components/Effects';

const App = () => {
  return (
    // overflow-x-clip: elements that slide in from the side (e.g. the photo in
    // About) start off-screen; without it they widen the page on phones.
    <div className="relative z-0 bg-primary transition-colors duration-500 overflow-x-clip">
      <SmoothScroll />
      <ScrollProgress />
      <CursorGlow />
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
      <BackToTop />
    </div>
  )
}

export default App
