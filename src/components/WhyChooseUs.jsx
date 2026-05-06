import { useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

function WhyChooseUs() {
  const { t } = useLanguage()
  const items = useMemo(() => {
    const translatedItems = t('whyChooseUs.items', [])
    return Array.isArray(translatedItems) ? translatedItems : []
  }, [t])

  return (
    <section id="confiance" className="section-space scroll-mt-28" aria-labelledby="why-choose-title">
      <div className="ui-container">
        <span className="ui-badge">{t('whyChooseUs.badge')}</span>
        <h2 id="why-choose-title" className="section-title mt-4">
          {t('whyChooseUs.title')}
        </h2>
        <p className="section-subtitle">{t('whyChooseUs.subtitle')}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <article key={item.title} className="ui-card">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-dark-olive text-lg font-bold text-brand-cream">
                {index + 1}
              </span>
              <h3 className="mt-4 text-xl">{item.title}</h3>
              <p className="mt-3 text-sm text-brand-brown sm:text-base">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
