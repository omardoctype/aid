import { useLanguage } from '../i18n/LanguageContext'

function FloatingWhatsAppButton() {
  const { t } = useLanguage()
  const whatsappNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')

  if (!whatsappNumber) {
    return null
  }

  const whatsappHref = `https://wa.me/${whatsappNumber}`

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      aria-label={t('floatingWhatsapp.label')}
    >
      <span aria-hidden="true">💬</span>
      <span>{t('floatingWhatsapp.text')}</span>
    </a>
  )
}

export default FloatingWhatsAppButton
