
import { useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { Segmented } from '../ui/Segmented'
import { Photo } from '../ui/Photo'

// Email doğrulama için basit bir regex deseni
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// LocalStorage anahtarı
const USERS_STORAGE_KEY = 'easygym_registered_users_v1'

// AuthScreen bileşeni
export function AuthScreen({ onAuthenticated }) {
  const { t } = useTranslation()

  const [mode, setMode] = useState('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState('beginner')
  const [errors, setErrors] = useState({})

  const isSignup = mode === 'signup'

  const MODES = [
    { value: 'signup', label: t('signup') },
    { value: 'login', label: t('login') },
  ]

  const LEVELS = [
    { value: 'beginner', label: t('beginner') },
    { value: 'intermediate', label: t('intermediate') },
    { value: 'advanced', label: t('advanced') },
  ]

  const switchMode = (next) => {
    setMode(next)
    setErrors({})
    setPassword('')
  }

  const finish = (profile) => {
    onAuthenticated(profile)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    const trimmedEmail = email.trim().toLowerCase()

    if (isSignup && name.trim().length < 2) {
      nextErrors.name = t('nameError')
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = t('emailError')
    }

    if (password.length < 4) {
      nextErrors.password = t('passwordError')
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) return

    let storedUsers = []

    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY)

      if (raw) {
        const parsed = JSON.parse(raw)
        storedUsers = Array.isArray(parsed) ? parsed : []
      }
    } catch {
      storedUsers = []
    }

    if (isSignup) {
      const existing = storedUsers.find(
        (u) => u.email?.trim().toLowerCase() === trimmedEmail
      )

      if (existing) {
        setErrors({
          email: t('emailExists'),
        })
        return
      }

      const newUser = {
        id: `user-${Date.now()}`,
        joinedAt: new Date().toISOString(),
        name: name.trim(),
        email: trimmedEmail,
        password,
        level,
        provider: 'email',
      }

      try {
        storedUsers.push(newUser)

        localStorage.setItem(
          USERS_STORAGE_KEY,
          JSON.stringify(storedUsers)
        )
      } catch {
        setErrors({
          email: t('saveAccountError'),
        })
        return
      }

      finish(newUser)
    } else {
      const found = storedUsers.find(
        (u) => u.email?.trim().toLowerCase() === trimmedEmail
      )

      if (!found) {
        setErrors({
          email: t('accountNotFound'),
        })
        return
      }

      if (found.password !== password) {
        setErrors({
          password: t('incorrectPassword'),
        })
        return
      }

      // Eski kullanıcı kayıtlarında eksik alanları tamamla.
      const normalizedUser = {
        ...found,
        id: found.id || `user-${Date.now()}`,
        joinedAt: found.joinedAt || new Date().toISOString(),
        level: found.level || 'beginner',
        provider: found.provider || 'email',
      }

      const updatedUsers = storedUsers.map((user) =>
        user.email?.trim().toLowerCase() === trimmedEmail
          ? normalizedUser
          : user
      )

      try {
        localStorage.setItem(
          USERS_STORAGE_KEY,
          JSON.stringify(updatedUsers)
        )
      } catch {
        setErrors({
          email: t('updateAccountError'),
        })
        return
      }

      finish(normalizedUser)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Tanıtım paneli — yalnızca masaüstü */}
      <aside className="relative hidden min-h-screen lg:block bg-black overflow-hidden">
        <Photo
          src="/images/glow-deep.jpg"
          alt="Neon blue runner man"
          rounded="none"
          className="absolute inset-0 h-full w-full object-contain object-center"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(1,8,18,0.1) 0%, rgba(1,8,18,0.4) 70%, var(--tp-bg) 100%)',
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14 z-10">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-btn"
              style={{ background: 'var(--tp-grad)' }}
            >
              <span
                className="block h-2 w-2 rounded-full"
                style={{ background: 'var(--tp-acc-ink)' }}
              />
            </span>

            <span className="text-[15px] font-semibold tracking-tight text-ink">
              easyGYM
            </span>
          </div>

          <div className="max-w-[420px]">
            <p className="display-xl mb-6 text-ink">
              {t('tagline')}
            </p>

            <figure className="plate p-6">
              <blockquote className="text-[15px] leading-relaxed text-ink">
                {t('testimonial')}
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-3">
                <span
                  className="h-9 w-9 rounded-full"
                  style={{ background: 'var(--tp-grad)' }}
                  aria-hidden="true"
                />

                <span className="text-[13px] text-mute">
                  {t('testimonialAuthor')}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </aside>

      {/* Giriş ve kayıt formu */}
      <main className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-[480px]">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-btn"
              style={{ background: 'var(--tp-grad)' }}
            >
              <span
                className="block h-2 w-2 rounded-full"
                style={{ background: 'var(--tp-acc-ink)' }}
              />
            </span>

            <span className="text-[15px] font-semibold tracking-tight text-ink">
              easyGYM
            </span>
          </div>

          <h1 className="display-hero mb-3 text-ink">
            {t('welcome')}
          </h1>

          <p className="mb-7 max-w-[400px] text-[15px] leading-relaxed text-mute">
            {t('welcomeDescription')}
          </p>

          <Segmented
            options={MODES}
            value={mode}
            onChange={switchMode}
            label={t('authModeLabel')}
            className="mb-6"
          />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {isSignup ? (
              <>
                <TextField
                  id="name"
                  label={t('name')}
                  value={name}
                  onChange={setName}
                  placeholder={t('namePlaceholder')}
                  autoComplete="given-name"
                  error={errors.name}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-ink">
                    {t('fitnessLevel')}
                  </label>

                  <Segmented
                    options={LEVELS}
                    value={level}
                    onChange={setLevel}
                    label={t('selectFitnessLevel')}
                  />
                </div>
              </>
            ) : null}

            <TextField
              id="email"
              label={t('email')}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@somewhere.com"
              autoComplete="email"
              error={errors.email}
            />

            <TextField
              id="password"
              label={t('password')}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              error={errors.password}
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              iconAfter="arrowRight"
              className="mt-1"
            >
              {isSignup ? t('signupButton') : t('loginButton')}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => switchMode(isSignup ? 'login' : 'signup')}
            className="press mt-5 w-full text-center text-[13px] text-mute transition-colors duration-theme ease-theme hover:text-ink"
          >
            {isSignup
              ? t('alreadyRegistered')
              : t('newHere')}
          </button>

          <p className="mt-8 text-[11px] leading-relaxed text-mute">
            {t('localStorageNotice')}
          </p>
        </div>
      </main>
    </div>
  )
}
