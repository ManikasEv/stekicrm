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

function findFactor(factors, strategy) {
  return (factors || []).find((factor) => factor.strategy === strategy)
}

async function sendEmailCode(signIn, { asSecondFactor }) {
  const factors = asSecondFactor ? signIn.supportedSecondFactors : signIn.supportedFirstFactors
  const emailFactor = findFactor(factors, 'email_code')

  if (!emailFactor) {
    const list = (factors || []).map((factor) => factor.strategy).join(', ') || 'keine'
    throw new Error(`E-Mail-Code nicht verfügbar (Strategien: ${list}).`)
  }

  const payload = {
    strategy: 'email_code',
    emailAddressId: emailFactor.emailAddressId,
  }

  if (asSecondFactor) {
    await signIn.prepareSecondFactor(payload)
  } else {
    await signIn.prepareFirstFactor(payload)
  }
}

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('credentials') // credentials | code
  const [codeKind, setCodeKind] = useState('first') // first | second
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const continueAfterFactor = async (result) => {
    if (await finishSignIn(result, setActive)) return true

    if (result.status === 'needs_second_factor' || result.status === 'needs_client_trust') {
      await sendEmailCode(signIn, { asSecondFactor: true })
      setCodeKind('second')
      setStep('code')
      return true
    }

    return false
  }

  const onCredentialsSubmit = async (event) => {
    event.preventDefault()
    if (!isLoaded || !signIn) return

    setSubmitting(true)
    setError('')

    try {
      // Always start with identifier, then pick the enabled first factor.
      const created = await signIn.create({ identifier: email.trim() })

      if (await finishSignIn(created, setActive)) return

      const firstFactors = created.supportedFirstFactors || signIn.supportedFirstFactors || []
      const passwordFactor = findFactor(firstFactors, 'password')
      const emailCodeFactor = findFactor(firstFactors, 'email_code')

      if (passwordFactor && password) {
        const attempted = await signIn.attemptFirstFactor({
          strategy: 'password',
          password,
        })
        if (await continueAfterFactor(attempted)) return
        setError(`Anmeldung unvollständig (${attempted.status}).`)
        return
      }

      // Matches Clerk Email tab: "Email verification code" for sign-in.
      if (emailCodeFactor) {
        await sendEmailCode(signIn, { asSecondFactor: false })
        setCodeKind('first')
        setStep('code')
        return
      }

      if (!passwordFactor) {
        setError(
          'Passwort-Login ist noch nicht aktiv. In Clerk: User & authentication → Password → Sign-in with password einschalten. Bis dahin wird der E-Mail-Code verwendet — bitte Email verification code aktiv lassen.',
        )
        return
      }

      setError('Kein Passwort eingegeben.')
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
      const result =
        codeKind === 'second'
          ? await signIn.attemptSecondFactor({
              strategy: 'email_code',
              code: code.trim(),
            })
          : await signIn.attemptFirstFactor({
              strategy: 'email_code',
              code: code.trim(),
            })

      if (await continueAfterFactor(result)) return
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
      await sendEmailCode(signIn, { asSecondFactor: codeKind === 'second' })
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
            ? `Code an ${email.trim()} gesendet. Bitte Posteingang prüfen.`
            : 'E-Mail eingeben. Falls Passwort-Login in Clerk aktiv ist, auch Passwort — sonst kommt ein E-Mail-Code.'}
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
              <span>Passwort (optional falls nur E-Mail-Code)</span>
              <div className="password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
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
              {submitting ? 'Wird angemeldet…' : 'Weiter'}
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
