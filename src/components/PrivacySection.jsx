import { useLanguage } from '../i18n/LanguageContext'

function PrivacySection() {
  const { t } = useLanguage()

  return (
    <section id="privacy-consent" className="section-space scroll-mt-28" aria-labelledby="privacy-title">
      <div className="ui-container">
        <div className="ui-card border-brand-gold/45 bg-gradient-to-br from-brand-gold/15 via-brand-cream to-white">
          <span className="ui-badge bg-brand-gold/15">{t('privacy.badge')}</span>
          <h2 id="privacy-title" className="section-title mt-4">
            {t('privacy.title')}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <p className="rounded-2xl border border-brand-olive/20 bg-white/80 px-4 py-4 text-sm text-brand-brown sm:text-base">
              {t('privacy.text1')}
            </p>
            <p className="rounded-2xl border border-brand-olive/20 bg-white/80 px-4 py-4 text-sm text-brand-brown sm:text-base">
              {t('privacy.text2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrivacySection
