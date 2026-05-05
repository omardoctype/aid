import { useEffect, useMemo, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useLanguage } from '../i18n/LanguageContext'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const FALLBACK_WHATSAPP_NUMBER = '21629850995'

const getEnvConfig = () => {
  const cloudName = String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim()
  const uploadPreset = String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim()
  const emailServiceId = String(import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim()
  const emailTemplateId = String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim()
  const emailPublicKey = String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim()
  const normalizedWhatsAppNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const whatsappNumber = normalizedWhatsAppNumber || FALLBACK_WHATSAPP_NUMBER

  return {
    cloudName,
    uploadPreset,
    emailServiceId,
    emailTemplateId,
    emailPublicKey,
    whatsappNumber,
  }
}

const initialFormState = {
  prenom: '',
  nom: '',
  telephone: '',
  adresse: '',
  enfant: '',
  age: '',
  taille: '',
  couleur: '',
  pack: '',
  style: '',
  message: '',
  photo: null,
  consent: false,
}

const initialStatus = {
  type: null,
  message: '',
}

const createErrorWithCode = (code) => {
  const error = new Error(code)
  error.code = code
  return error
}

const uploadImageToCloudinary = async (file, config) => {
  if (!config.cloudName || !config.uploadPreset) {
    throw createErrorWithCode('submit_config')
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', config.uploadPreset)

  let response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body,
    })
  } catch {
    throw createErrorWithCode('cloudinary_upload')
  }

  if (!response.ok) {
    throw createErrorWithCode('cloudinary_upload')
  }

  const result = await response.json()
  if (!result?.secure_url) {
    throw createErrorWithCode('cloudinary_upload')
  }

  return result.secure_url
}

const buildWhatsappMessage = (formData, photoUrl, t) =>
  [
    t('whatsappMessage.intro'),
    '',
    `${t('whatsappMessage.nom')}: ${formData.nom}`,
    `${t('whatsappMessage.prenom')}: ${formData.prenom}`,
    `${t('whatsappMessage.telephone')}: ${formData.telephone}`,
    `${t('whatsappMessage.adresse')}: ${formData.adresse}`,
    '',
    `${t('whatsappMessage.enfant')}: ${formData.enfant}`,
    `${t('whatsappMessage.age')}: ${formData.age}`,
    `${t('whatsappMessage.taille')}: ${formData.taille}`,
    `${t('whatsappMessage.couleur')}: ${formData.couleur}`,
    `${t('whatsappMessage.pack')}: ${formData.pack}`,
    `${t('whatsappMessage.style')}: ${formData.style}`,
    `${t('whatsappMessage.message')}: ${formData.message}`,
    '',
    `${t('whatsappMessage.photo')}:`,
    photoUrl,
  ].join('\n')

function OrderForm() {
  const { t } = useLanguage()
  const envConfig = useMemo(() => getEnvConfig(), [])
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(initialStatus)
  const [previewUrl, setPreviewUrl] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const sizeOptions = t('form.options.sizes', [])
  const colorOptions = t('form.options.colors', [])
  const packOptions = t('form.options.packs', [])
  const styleOptions = t('form.options.styles', [])
  const hasSubmitConfig = useMemo(
    () =>
      Boolean(
        envConfig.cloudName &&
          envConfig.uploadPreset &&
          envConfig.emailServiceId &&
          envConfig.emailTemplateId &&
          envConfig.emailPublicKey,
      ),
    [envConfig],
  )
  const fallbackWhatsappHref = `https://wa.me/${envConfig.whatsappNumber}`

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const photoDetails = useMemo(() => {
    if (!formData.photo) {
      return null
    }

    return {
      name: formData.photo.name,
      size: `${(formData.photo.size / (1024 * 1024)).toFixed(2)} MB`,
    }
  }, [formData.photo])

  const validatePhoto = (file) => {
    if (!file) {
      return t('form.errors.photoRequired')
    }

    if (!file.type.startsWith('image/')) {
      return t('form.errors.photoNotImage')
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      return t('form.errors.photoInvalidType')
    }

    if (file.size > MAX_FILE_SIZE) {
      return t('form.errors.photoTooLarge')
    }

    return ''
  }

  const validateField = (name, value) => {
    switch (name) {
      case 'prenom':
      case 'nom':
      case 'telephone':
      case 'adresse':
      case 'enfant':
      case 'age':
      case 'taille':
      case 'couleur':
      case 'pack':
      case 'style':
      case 'message':
        return String(value).trim() ? '' : t('form.errors.required')
      case 'photo':
        return validatePhoto(value)
      case 'consent':
        return value ? '' : t('form.errors.consentRequired')
      default:
        return ''
    }
  }

  const validateForm = () => {
    const newErrors = {
      prenom: validateField('prenom', formData.prenom),
      nom: validateField('nom', formData.nom),
      telephone: validateField('telephone', formData.telephone),
      adresse: validateField('adresse', formData.adresse),
      enfant: validateField('enfant', formData.enfant),
      age: validateField('age', formData.age),
      taille: validateField('taille', formData.taille),
      couleur: validateField('couleur', formData.couleur),
      pack: validateField('pack', formData.pack),
      style: validateField('style', formData.style),
      message: validateField('message', formData.message),
      photo: validateField('photo', formData.photo),
      consent: validateField('consent', formData.consent),
    }

    const hasError = Object.values(newErrors).some(Boolean)
    setErrors(newErrors)
    return !hasError
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setFormData((previous) => ({
      ...previous,
      [name]: nextValue,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: validateField(name, nextValue),
    }))
  }

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0] || null
    const photoError = validatePhoto(selectedFile)

    setFormData((previous) => ({
      ...previous,
      photo: photoError ? null : selectedFile,
    }))

    setErrors((previous) => ({
      ...previous,
      photo: photoError,
    }))

    setPreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous)
      }

      if (photoError || !selectedFile) {
        return ''
      }

      return URL.createObjectURL(selectedFile)
    })

    if (photoError) {
      setStatus({
        type: 'error',
        message: photoError,
      })
      event.target.value = ''
      return
    }

    setStatus(initialStatus)
  }

  const handleBlur = (event) => {
    const { name, type, checked, value } = event.target
    const currentValue = type === 'checkbox' ? checked : value

    setErrors((previous) => ({
      ...previous,
      [name]: validateField(name, currentValue),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(initialStatus)
    setWhatsappUrl('')

    if (!hasSubmitConfig) {
      setStatus({
        type: 'error',
        message: t('form.errors.submitFailedFriendly'),
      })
      return
    }

    if (!validateForm()) {
      setStatus({
        type: 'error',
        message: t('form.errors.validation'),
      })
      return
    }

    setIsLoading(true)

    try {
      const photoUrl = await uploadImageToCloudinary(formData.photo, envConfig)
      const orderDate = new Date().toLocaleString('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })

      const templateParams = {
        from_name: `${formData.prenom} ${formData.nom}`,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        adresse: formData.adresse,
        enfant: formData.enfant,
        age: formData.age,
        taille: formData.taille,
        couleur: formData.couleur,
        pack: formData.pack,
        style: formData.style,
        message: formData.message,
        photo_url: photoUrl,
        order_date: orderDate,
      }

      try {
        await emailjs.send(
          envConfig.emailServiceId,
          envConfig.emailTemplateId,
          templateParams,
          envConfig.emailPublicKey,
        )
      } catch {
        throw createErrorWithCode('emailjs_send')
      }

      const whatsappMessage = buildWhatsappMessage(formData, photoUrl, t)
      const whatsappLink = `https://wa.me/${envConfig.whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage,
      )}`

      setWhatsappUrl(whatsappLink)
      setStatus({
        type: 'success',
        message: t('form.success'),
      })
      setFormData(initialFormState)
      setErrors({})

      setPreviewUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous)
        }
        return ''
      })
    } catch (error) {
      if (error?.code === 'submit_config') {
        setStatus({
          type: 'error',
          message: t('form.errors.submitFailedFriendly'),
        })
      } else if (error?.code === 'cloudinary_upload') {
        setStatus({
          type: 'error',
          message: t('form.errors.cloudinary'),
        })
      } else if (error?.code === 'emailjs_send') {
        setStatus({
          type: 'error',
          message: t('form.errors.emailjs'),
        })
      } else {
        setStatus({
          type: 'error',
          message: t('form.errors.generic'),
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fieldClassName = (fieldName) =>
    `w-full rounded-2xl border bg-white/90 px-4 py-3 text-sm text-brand-dark-olive shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand-gold/50 sm:text-base ${
      errors[fieldName] ? 'border-red-400' : 'border-brand-olive/20'
    }`

  return (
    <section id="commander" className="section-space scroll-mt-28" aria-labelledby="order-form-title">
      <div className="ui-container">
        <div className="ui-card border-brand-gold/40 bg-gradient-to-br from-white via-brand-cream/90 to-brand-beige/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="ui-badge">{t('form.badge')}</span>
              <h2 id="order-form-title" className="section-title mt-4">
                {t('form.title')}
              </h2>
            </div>
          </div>

          <p className="section-subtitle mt-3 max-w-3xl">{t('form.subtitle')}</p>

          {status.type === 'success' && (
            <div
              className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:text-base"
              role="status"
              aria-live="polite"
            >
              {status.message}
            </div>
          )}

          {status.type === 'error' && (
            <div
              className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 sm:text-base"
              role="alert"
              aria-live="assertive"
            >
              {status.message}
            </div>
          )}

          <form className="mt-7 grid gap-4 sm:grid-cols-2 lg:gap-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="prenom" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.prenom')}
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                value={formData.prenom}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('prenom')}
                placeholder={t('form.placeholders.prenom')}
                aria-invalid={Boolean(errors.prenom)}
                aria-describedby={errors.prenom ? 'prenom-error' : undefined}
              />
              {errors.prenom && (
                <p id="prenom-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.prenom}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="nom" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.nom')}
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                value={formData.nom}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('nom')}
                placeholder={t('form.placeholders.nom')}
                aria-invalid={Boolean(errors.nom)}
                aria-describedby={errors.nom ? 'nom-error' : undefined}
              />
              {errors.nom && (
                <p id="nom-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.nom}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="telephone" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.telephone')}
              </label>
              <input
                id="telephone"
                name="telephone"
                type="text"
                required
                value={formData.telephone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('telephone')}
                placeholder={t('form.placeholders.telephone')}
                aria-invalid={Boolean(errors.telephone)}
                aria-describedby={errors.telephone ? 'telephone-error' : undefined}
              />
              {errors.telephone && (
                <p id="telephone-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.telephone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="adresse" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.adresse')}
              </label>
              <input
                id="adresse"
                name="adresse"
                type="text"
                required
                value={formData.adresse}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('adresse')}
                placeholder={t('form.placeholders.adresse')}
                aria-invalid={Boolean(errors.adresse)}
                aria-describedby={errors.adresse ? 'adresse-error' : undefined}
              />
              {errors.adresse && (
                <p id="adresse-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.adresse}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="enfant" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.enfant')}
              </label>
              <input
                id="enfant"
                name="enfant"
                type="text"
                required
                value={formData.enfant}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('enfant')}
                placeholder={t('form.placeholders.enfant')}
                aria-invalid={Boolean(errors.enfant)}
                aria-describedby={errors.enfant ? 'enfant-error' : undefined}
              />
              {errors.enfant && (
                <p id="enfant-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.enfant}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.age')}
              </label>
              <input
                id="age"
                name="age"
                type="text"
                required
                value={formData.age}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('age')}
                placeholder={t('form.placeholders.age')}
                aria-invalid={Boolean(errors.age)}
                aria-describedby={errors.age ? 'age-error' : undefined}
              />
              {errors.age && (
                <p id="age-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.age}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="taille" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.taille')}
              </label>
              <select
                id="taille"
                name="taille"
                required
                value={formData.taille}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('taille')}
                aria-invalid={Boolean(errors.taille)}
                aria-describedby={errors.taille ? 'taille-error' : undefined}
              >
                <option value="">{t('form.selects.sizePlaceholder')}</option>
                {sizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.taille && (
                <p id="taille-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.taille}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="couleur" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.couleur')}
              </label>
              <select
                id="couleur"
                name="couleur"
                required
                value={formData.couleur}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('couleur')}
                aria-invalid={Boolean(errors.couleur)}
                aria-describedby={errors.couleur ? 'couleur-error' : undefined}
              >
                <option value="">{t('form.selects.colorPlaceholder')}</option>
                {colorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.couleur && (
                <p id="couleur-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.couleur}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="pack" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.pack')}
              </label>
              <select
                id="pack"
                name="pack"
                required
                value={formData.pack}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('pack')}
                aria-invalid={Boolean(errors.pack)}
                aria-describedby={errors.pack ? 'pack-error' : undefined}
              >
                <option value="">{t('form.selects.packPlaceholder')}</option>
                {packOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.pack && (
                <p id="pack-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.pack}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="style" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.style')}
              </label>
              <select
                id="style"
                name="style"
                required
                value={formData.style}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={fieldClassName('style')}
                aria-invalid={Boolean(errors.style)}
                aria-describedby={errors.style ? 'style-error' : undefined}
              >
                <option value="">{t('form.selects.stylePlaceholder')}</option>
                {styleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.style && (
                <p id="style-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.style}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.message')}
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`${fieldClassName('message')} resize-none`}
                placeholder={t('form.placeholders.message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="photo" className="mb-2 block text-sm font-semibold text-brand-dark-olive">
                {t('form.labels.photo')}
              </label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                required
                onChange={handlePhotoChange}
                onBlur={handleBlur}
                className={fieldClassName('photo')}
                aria-invalid={Boolean(errors.photo)}
                aria-describedby={errors.photo ? 'photo-error' : 'photo-help'}
              />
              <p id="photo-help" className="mt-1 text-xs text-brand-brown/90 sm:text-sm">
                {t('form.photoHelp')}
              </p>
              {errors.photo && (
                <p id="photo-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.photo}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="rounded-3xl border border-brand-olive/20 bg-white/70 p-4">
                <p className="text-sm font-semibold text-brand-dark-olive">{t('form.photoPreviewTitle')}</p>
                {previewUrl ? (
                  <>
                    {photoDetails && (
                      <p className="mt-1 text-xs text-brand-brown sm:text-sm">
                        {photoDetails.name} - {photoDetails.size}
                      </p>
                    )}
                    <img
                      src={previewUrl}
                      alt={t('form.previewAria')}
                      className="mt-3 h-56 w-full rounded-2xl object-cover sm:h-64"
                    />
                  </>
                ) : (
                  <div className="mt-3 rounded-2xl border border-dashed border-brand-olive/30 bg-brand-cream/60 px-4 py-6 text-sm text-brand-brown sm:text-base">
                    {t('form.photoPreviewEmpty')}
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-brand-olive/20 bg-white/70 px-4 py-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  required
                  checked={formData.consent}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="mt-1 h-5 w-5 rounded border-brand-olive/40 text-brand-dark-olive focus:ring-brand-gold/50"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                <span className="text-sm text-brand-brown sm:text-base">{t('form.consent')}</span>
              </label>
              {errors.consent && (
                <p id="consent-error" className="mt-1 text-xs text-red-600 sm:text-sm">
                  {errors.consent}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                className="ui-button-primary min-w-[230px] disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isLoading}
              >
                {isLoading ? t('form.loading') : t('form.submit')}
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {status.type === 'success' && whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="ui-button-secondary"
                aria-label={t('form.whatsappAria')}
              >
                {t('form.whatsappConfirm')}
              </a>
            )}

            <a
              href={fallbackWhatsappHref}
              target="_blank"
              rel="noreferrer"
              className="ui-button-secondary"
              aria-label={t('form.contactWhatsappAria')}
            >
              {t('form.contactWhatsapp')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderForm
