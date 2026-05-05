import { useLanguage } from '../i18n/LanguageContext'

function HowItWorks() {
  const { t } = useLanguage()
  const steps = t('howItWorks.steps', [])

  return (
    <section
      id="comment-ca-marche"
      className="section-space scroll-mt-28"
      aria-labelledby="how-it-works-title"
    >
      <div className="ui-container">
        <span className="ui-badge">{t('howItWorks.badge')}</span>
        <h2 id="how-it-works-title" className="section-title mt-4">
          {t('howItWorks.title')}
        </h2>
        <p className="section-subtitle">{t('howItWorks.subtitle')}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="ui-card">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-olive text-sm font-bold text-brand-cream">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-brown/80">
                  {t('common.stepWord')}
                </span>
              </div>

              <h3 className="mt-4 text-xl">{step.title}</h3>
              <p className="mt-3 text-sm text-brand-brown sm:text-base">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
