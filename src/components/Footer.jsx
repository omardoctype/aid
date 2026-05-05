import { useLanguage } from '../i18n/LanguageContext'

function Footer() {
  const { t } = useLanguage()
  const whatsappNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const whatsappDisplay = whatsappNumber ? `+${whatsappNumber}` : t('common.notConfiguredWhatsApp')
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#commander'
  const year = String(new Date().getFullYear())

  return (
    <footer className="border-t border-brand-olive/15 bg-brand-dark-olive text-brand-cream">
      <div className="ui-container py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
          <section aria-labelledby="footer-brand">
            <h2 id="footer-brand" className="text-3xl text-brand-cream">
              {t('common.brand')}
            </h2>
            <p className="mt-3 max-w-sm text-sm text-brand-cream/85 sm:text-base">{t('footer.tagline')}</p>
          </section>

          <section aria-labelledby="footer-links" className="sm:justify-self-center">
            <h3 id="footer-links" className="text-base font-semibold text-brand-cream">
              {t('footer.linksTitle')}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-cream/85">
              <li>
                <a className="transition-colors hover:text-brand-gold" href="#comment-ca-marche">
                  {t('nav.howItWorks')}
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-brand-gold" href="#exemples">
                  {t('nav.examples')}
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-brand-gold" href="#tarifs">
                  {t('nav.pricing')}
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-brand-gold" href="#privacy-consent">
                  {t('privacy.badge')}
                </a>
              </li>
            </ul>
          </section>

          <section aria-labelledby="footer-contact" className="sm:justify-self-center">
            <h3 id="footer-contact" className="text-base font-semibold text-brand-cream">
              {t('footer.contactTitle')}
            </h3>
            <p className="mt-3 text-sm text-brand-cream/85">{t('common.whatsapp')}: {whatsappDisplay}</p>
            <a
              href={whatsappHref}
              target={whatsappNumber ? '_blank' : undefined}
              rel={whatsappNumber ? 'noreferrer' : undefined}
              className="mt-4 inline-flex rounded-2xl border border-brand-gold/60 px-4 py-2 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-dark-olive"
            >
              {t('common.askOnWhatsApp')}
            </a>
          </section>

          <section aria-labelledby="footer-note">
            <h3 id="footer-note" className="text-base font-semibold text-brand-cream">
              {t('footer.familyTitle')}
            </h3>
            <p className="mt-3 text-sm text-brand-cream/85">{t('footer.familyText')}</p>
          </section>
        </div>

        <p className="mt-10 border-t border-brand-cream/15 pt-6 text-xs text-brand-cream/75">
          {t('common.copyright').replace('{year}', year)}
        </p>
      </div>
    </footer>
  )
}

export default Footer
