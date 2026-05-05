import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import StyleGallery from './components/StyleGallery'
import Pricing from './components/Pricing'
import OrderForm from './components/OrderForm'
import WhyChooseUs from './components/WhyChooseUs'
import PrivacySection from './components/PrivacySection'
import Footer from './components/Footer'
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton'

function App() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero />
        <HowItWorks />
        <StyleGallery />
        <Pricing />
        <OrderForm />
        <WhyChooseUs />
        <PrivacySection />
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  )
}

export default App
