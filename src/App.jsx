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
import ErrorBoundary from './components/ErrorBoundary'
import { useLanguage } from './i18n/LanguageContext'

function App() {
  const { language, t } = useLanguage()
  const pageErrorMessage = t(
    'common.pageError',
    language === 'ar'
      ? 'صار مشكل في الصفحة. جرّب تعمل refresh.'
      : 'Une erreur est survenue. Veuillez rafraîchir la page.',
  )
  const refreshLabel = t('common.refreshPage', language === 'ar' ? 'عمل refresh' : 'Rafraîchir la page')

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Header />

      <main className="relative">
        <Hero />
        <HowItWorks />
        <StyleGallery />
        <Pricing />
        <ErrorBoundary resetKey={language} fallbackMessage={pageErrorMessage} refreshLabel={refreshLabel}>
          <OrderForm />
        </ErrorBoundary>
        <WhyChooseUs />
        <PrivacySection />
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  )
}

export default App
