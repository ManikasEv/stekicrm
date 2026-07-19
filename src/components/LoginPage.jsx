import { useState } from 'react'
import { useSignIn } from '@clerk/clerk-react'
import logo from '../assets/logo.jpeg'
import Icon from './Icon'

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!isLoaded || !signIn) return

    setSubmitting(true)
    setError('')

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        return
      }

      setError('Anmeldung unvollständig. Bitte erneut versuchen oder Clerk Dashboard prüfen.')
    } catch (err) {
      const message =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        'E-Mail oder Passwort ungültig.'
      setError(message)
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
        <h1>Anmelden</h1>
        <p className="login-lead">
          Internes STEKI-Backoffice. Zugang nur mit freigeschaltetem Konto (E-Mail &amp; Passwort).
        </p>

        <form className="login-form" onSubmit={onSubmit} noValidate>
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

        <p className="login-note">
          Kein öffentlicher Zugang. Neue Konten werden nur im Clerk-Dashboard angelegt.
        </p>
      </main>
    </div>
  )
}
