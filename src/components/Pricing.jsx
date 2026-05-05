import { useLanguage } from '../i18n/LanguageContext'

function Pricing() {
  const { t } = useLanguage()
  const packs = t('pricing.packs', [])

  return (
    <section id="tarifs" className="section-space scroll-mt-28" aria-labelledby="pricing-title">
      <div className="ui-container">
        <span className="ui-badge">{t('pricing.badge')}</span>
        <h2 id="pricing-title" className="section-title mt-4">
          {t('pricing.title')}
        </h2>
        <p className="section-subtitle">{t('pricing.subtitle')}</p>
        <p className="mt-3 max-w-3xl text-sm text-brand-brown sm:text-base">{t('pricing.description')}</p>

        <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
          {packs.map((pack) => (
            <article
              key={pack.name}
              className={`ui-card flex h-full flex-col ${pack.featured ? 'border-brand-gold/60 bg-gradient-to-br from-brand-gold/20 via-brand-cream/80 to-white' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl">{pack.name}</h3>
                {pack.featured && (
                  <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold text-brand-dark-olive">
                    {t('pricing.popular')}
                  </span>
                )}
              </div>

              <p className="mt-4 text-4xl font-bold text-brand-dark-olive">{pack.price}</p>

              <ul className="mt-5 space-y-2 text-sm text-brand-brown sm:text-base">
                {pack.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-olive" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <a href="#commander" className="ui-button-primary mt-7">
                {t('pricing.choosePack')}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
