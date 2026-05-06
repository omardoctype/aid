import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import BrandLogo from './BrandLogo'

const navigation = [
  { key: 'home', href: '#accueil' },
  { key: 'howItWorks', href: '#comment-ca-marche' },
  { key: 'examples', href: '#exemples' },
  { key: 'pricing', href: '#tarifs' },
  { key: 'order', href: '#commander' },
]

const languages = [
  { code: 'ar', key: 'common.langAr' },
  { code: 'fr', key: 'common.langFr' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false)
    const desktopMediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleDesktopLayout = (event) => {
      if (event.matches) {
        closeMenu()
      }
    }

    window.addEventListener('hashchange', closeMenu)
    window.addEventListener('pageshow', closeMenu)

    if (desktopMediaQuery.addEventListener) {
      desktopMediaQuery.addEventListener('change', handleDesktopLayout)
    } else {
      desktopMediaQuery.addListener(handleDesktopLayout)
    }

    return () => {
      window.removeEventListener('hashchange', closeMenu)
      window.removeEventListener('pageshow', closeMenu)

      if (desktopMediaQuery.removeEventListener) {
        desktopMediaQuery.removeEventListener('change', handleDesktopLayout)
      } else {
        desktopMediaQuery.removeListener(handleDesktopLayout)
      }
    }
  }, [])

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="ui-container">
        <div className="flex h-20 items-center justify-between gap-2 sm:gap-3">
          <a
            href="#accueil"
            className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-brand-dark-olive sm:gap-3"
            aria-label={t('common.brand')}
          >
            <BrandLogo className="h-11 w-11 sm:h-12 sm:w-12" alt={t('common.brand')} />
            <span>{t('common.brand')}</span>
          </a>

          <nav
            className="hidden items-center gap-4 text-sm font-semibold text-brand-dark-olive/90 lg:flex"
            aria-label={t('common.mainNavigation')}
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-2 py-1 transition-colors hover:text-brand-olive focus-visible:outline-none"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className="hidden items-center rounded-2xl border border-brand-olive/25 bg-white/75 p-1 sm:flex"
              role="group"
              aria-label={t('common.languageLabel')}
            >
              {languages.map((item) => {
                const isActive = language === item.code

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? 'bg-brand-dark-olive text-brand-cream'
                        : 'text-brand-dark-olive hover:bg-brand-beige/70'
                    }`}
                    aria-pressed={isActive}
                  >
                    {t(item.key)}
                  </button>
                )
              })}
            </div>

            <a href="#commander" className="ui-button-primary hidden lg:inline-flex">
              {t('common.ctaOrderNow')}
            </a>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-olive/25 bg-white/70 text-brand-dark-olive lg:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
              onClick={() => setIsMenuOpen((previousValue) => !previousValue)}
            >
              <span aria-hidden="true" className="text-xl leading-none">
                {isMenuOpen ? '×' : '☰'}
              </span>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav
            id="mobile-navigation"
            className="glass-panel mb-4 flex flex-col gap-3 p-4 lg:hidden"
            aria-label={t('common.mobileNavigation')}
          >
            <div className="flex items-center rounded-2xl border border-brand-olive/25 bg-white/80 p-1">
              {languages.map((item) => {
                const isActive = language === item.code
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code)}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-brand-dark-olive text-brand-cream'
                        : 'text-brand-dark-olive hover:bg-brand-beige/70'
                    }`}
                    aria-pressed={isActive}
                  >
                    {t(item.key)}
                  </button>
                )
              })}
            </div>

            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-brand-dark-olive transition-colors hover:bg-brand-beige/60"
                onClick={handleNavClick}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}

            <a href="#commander" className="ui-button-primary mt-1 w-full" onClick={handleNavClick}>
              {t('common.ctaOrderNow')}
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header

