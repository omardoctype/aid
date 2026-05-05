import { useLanguage } from '../i18n/LanguageContext'

const gradients = [
  'from-brand-gold/45 via-brand-beige to-brand-olive/20',
  'from-brand-olive/25 via-white to-brand-beige/80',
]

function StyleGallery() {
  const { t } = useLanguage()
  const cards = t('styles.cards', [])

  return (
    <section id="exemples" className="section-space scroll-mt-28" aria-labelledby="style-gallery-title">
      <div className="ui-container">
        <span className="ui-badge">{t('styles.badge')}</span>
        <h2 id="style-gallery-title" className="section-title mt-4">
          {t('styles.title')}
        </h2>
        <p className="section-subtitle">{t('styles.subtitle')}</p>

        <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
          {cards.map((style, index) => (
            <article key={style.title} className="ui-card overflow-hidden p-0">
              <div
                className={`relative h-40 bg-gradient-to-br ${gradients[index % gradients.length]}`}
                role="img"
                aria-label={t('styles.cardAria', '').replace('{style}', style.title)}
              >
                <div className="absolute inset-4 rounded-2xl border border-white/65 bg-white/35 backdrop-blur-sm" />
                <div className="absolute bottom-3 left-3 rounded-full border border-white/75 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-dark-olive">
                  {t('styles.previewLabel')}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl">{style.title}</h3>
                <p className="mt-2 text-sm text-brand-brown sm:text-base">{style.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StyleGallery
