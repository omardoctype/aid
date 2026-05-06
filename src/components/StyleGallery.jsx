import { useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import cartoonStyleImage from '../assets/cartoon.png'
import chibiStyleImage from '../assets/chiibi.png'

const resolveStyleImage = (styleTitle) => {
  const normalizedTitle = String(styleTitle).toLowerCase()
  return normalizedTitle.includes('cartoon') ? cartoonStyleImage : chibiStyleImage
}

function StyleGallery() {
  const { t } = useLanguage()
  const cards = useMemo(() => {
    const translatedCards = t('styles.cards', [])
    return Array.isArray(translatedCards) ? translatedCards : []
  }, [t])

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
            <article key={style.title} className="ui-card group overflow-hidden p-0">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={resolveStyleImage(style.title)}
                  alt={t('styles.cardAria', '').replace('{style}', style.title)}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-olive/45 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-full border border-white/75 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-dark-olive">
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
