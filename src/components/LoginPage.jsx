import { useState } from 'react'
import { useSignIn } from '@clerk/clerk-react'
import logo from '../assets/logo.jpeg'
import Icon from './Icon'

const clerkError = (err) =>
  err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Anmeldung fehlgeschlagen.'

async function finishSignIn(result, setActive) {
  if (result.status === 'complete') {
    await setActive({ session: result.createdSessionId })
    return true
  }
  return false
}

async function startEmailCodeStep(signIn) {
  const factors = signIn.supportedSecondFactors || []
  const emailFactor = factors.find((factor) => factor.strategy === 'email_code')

  if (!emailFactor) {
    const strategies = factors.map((factor) => factor.strategy).join(', ') || 'keine'
    throw new Error(
      `E-Mail-Code nicht verfügbar (Strategien: ${strategies}). In Clerk unter Attack protection → Client Trust prüfen.`,
    )
  }

  await signIn.prepareSecondFactor({
    strategy: 'email_code',
    emailAddressId: emailFactor.emailAddressId,
  })
}

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('credentials') // credentials | code
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onCredentialsSubmit = async (event) => {
    event.preventDefault()
    if (!isLoaded || !signIn) return

    setSubmitting(true)
    setError('')

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      })

      if (await finishSignIn(result, setActive)) return

      if (result.status === 'needs_first_factor') {
        const passwordFactor = (result.supportedFirstFactors || []).find(
          (factor) => factor.strategy === 'password',
        )
        if (passwordFactor) {
          const attempted = await signIn.attemptFirstFactor({
            strategy: 'password',
            password,
          })
          if (await finishSignIn(attempted, setActive)) return

          if (attempted.status === 'needs_second_factor' || attempted.status === 'needs_client_trust') {
            await startEmailCodeStep(signIn)
            setStep('code')
            return
          }
        }

        setError(
          'Passwort-Login ist in Clerk nicht aktiv. Unter User & authentication → Email → Password aktivieren.',
        )
        return
      }

      if (result.status === 'needs_second_factor' || result.status === 'needs_client_trust') {
        // Not MFA — usually Clerk Client Trust (verify new browser via email code).
        await startEmailCodeStep(signIn)
        setStep('code')
        return
      }

      setError(`Anmeldung unvollständig (${result.status}). Clerk Dashboard prüfen.`)
    } catch (err) {
      setError(clerkError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const onCodeSubmit = async (event) => {
    event.preventDefault()
    if (!isLoaded || !signIn) return

    setSubmitting(true)
    setError('')

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: 'email_code',
        code: code.trim(),
      })

      if (await finishSignIn(result, setActive)) return
      setError(`Code ungültig oder Anmeldung unvollständig (${result.status}).`)
    } catch (err) {
      setError(clerkError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const resendCode = async () => {
    if (!isLoaded || !signIn) return
    setSubmitting(true)
    setError('')
    try {
      await startEmailCodeStep(signIn)
      setError('')
    } catch (err) {
      setError(clerkError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-backdrop" aria-hidden="true" />

      <main className="login-panel">
        <div className="login-brand">
          <span className="app-logo login-logo">
            <img src={logo} alt="" />
          </span>
          <span>
            <strong>STEKI</strong>
            <small>Backoffice Login</small>
          </span>
        </div>

        <span className="dashboard-kicker">NUR FÜR AUTORISIERTE</span>
        <h1>{step === 'code' ? 'Code bestätigen' : 'Anmelden'}</h1>
        <p className="login-lead">
          {step === 'code'
            ? `Wir haben einen Code an ${email.trim()} gesendet (neues Gerät / Browser).`
            : 'Internes STEKI-Backoffice. Zugang nur mit freigeschaltetem Konto (E-Mail & Passwort).'}
        </p>

        {step === 'credentials' ? (
          <form className="login-form" onSubmit={onCredentialsSubmit} noValidate>
            <label className="field">
              <span>E-Mail</span>
              <input
                type="email"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@steki.ch"
                required
              />
            </label>

            <label className="field">
              <span>Passwort</span>
              <div className="password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? 'Verbergen' : 'Zeigen'}
                </button>
              </div>
            </label>

            {error ? <p className="login-error">{error}</p> : null}

            <button className="primary-button login-submit" type="submit" disabled={!isLoaded || submitting}>
              <Icon name="check" size={17} />
              {submitting ? 'Wird angemeldet…' : 'Anmelden'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={onCodeSubmit} noValidate>
            <label className="field">
              <span>Bestätigungscode</span>
              <input
                type="text"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="123456"
                required
              />
            </label>

            {error ? <p className="login-error">{error}</p> : null}

            <button className="primary-button login-submit" type="submit" disabled={!isLoaded || submitting}>
              <Icon name="check" size={17} />
              {submitting ? 'Wird geprüft…' : 'Code bestätigen'}
            </button>

            <div className="login-secondary-actions">
              <button className="secondary-button" type="button" disabled={submitting} onClick={resendCode}>
                Code erneut senden
              </button>
              <button
                className="secondary-button"
                type="button"
                disabled={submitting}
                onClick={() => {
                  setStep('credentials')
                  setCode('')
                  setError('')
                }}
              >
                Zurück
              </button>
            </div>
          </form>
        )}

        <p className="login-note">
          Kein öffentlicher Zugang. Neue Konten werden nur im Clerk-Dashboard angelegt.
        </p>
      </main>
    </div>
  )
}
