import { useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import BrandLogo from './BrandLogo'

function Hero() {
  const { t } = useLanguage()
  const visualSteps = useMemo(() => {
    const translatedSteps = t('hero.visualSteps', [])
    return Array.isArray(translatedSteps) ? translatedSteps : []
  }, [t])

  return (
    <section id="accueil" className="section-space scroll-mt-28 overflow-hidden">
      <div className="ui-container">
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="pointer-events-none absolute -left-12 -top-8 h-36 w-36 rounded-full bg-brand-gold/20 blur-2xl" />
          <div className="pointer-events-none absolute -right-10 bottom-4 h-40 w-40 rounded-full bg-brand-olive/15 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-12 w-12 sm:h-14 sm:w-14" alt={t('common.brand')} />
              <span className="ui-badge">{t('hero.badge')}</span>
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl">{t('hero.title')}</h1>

            <p className="mt-5 max-w-2xl text-base text-brand-brown sm:text-lg">{t('hero.subtitle')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#commander" className="ui-button-primary">
                {t('common.ctaOrderNow')}
              </a>
              <a href="#exemples" className="ui-button-secondary">
                {t('common.ctaSeeExamples')}
              </a>
            </div>

            <p className="mt-4 text-sm font-medium text-brand-brown">{t('hero.note')}</p>
          </div>

          <aside className="relative" aria-label={t('hero.visualAsideAria')}>
            <div className="ui-card relative overflow-hidden border-brand-gold/35 bg-gradient-to-br from-white/90 via-brand-cream to-brand-beige/65">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-gold/20 blur-2xl" />
              <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-brand-olive/20 blur-2xl" />

              <p className="relative text-sm font-semibold uppercase tracking-[0.08em] text-brand-olive">
                {t('hero.visualBadge')}
              </p>
              <h2 className="relative mt-2 text-2xl sm:text-3xl">{t('hero.visualTitle')}</h2>

              <div className="relative mt-6 grid gap-3" role="img" aria-label={t('hero.visualAria')}>
                {visualSteps.map((step) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-brand-olive/20 bg-white/90 px-4 py-3 text-sm font-semibold text-brand-dark-olive"
                  >
                    {step}
                  </div>
                ))}
              </div>

              <p className="relative mt-5 text-sm text-brand-brown">{t('hero.visualSummary')}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Hero
