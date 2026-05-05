import logoImage from '../assets/logo.png'

function BrandLogo({ className = '', alt = 'عيادي' }) {
  return (
    <img
      src={logoImage}
      alt={alt}
      className={`rounded-full border border-brand-gold/45 bg-white object-cover shadow-soft ${className}`}
      loading="lazy"
    />
  )
}

export default BrandLogo
