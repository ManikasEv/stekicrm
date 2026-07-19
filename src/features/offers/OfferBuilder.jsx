import { useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Icon from '../../components/Icon'
import { truckDetails, truckNote } from '../../data/company'
import OfferDocument from './OfferDocument'

const STORAGE_KEY = 'steki-location-proposal'
const isoDate = (date) => date.toISOString().slice(0, 10)

const createInitialProposal = () => {
  const today = new Date()

  return {
    proposalNumber: `ST-${today.getFullYear()}-001`,
    issueDate: isoDate(today),
    recipientName: '',
    recipientCompany: '',
    recipientAddress: '',
    recipientEmail: '',
    locationName: '',
    locationAddress: '',
    desiredStart: '',
    operatingDays: '',
    operatingHours: '',
    duration: 'Langfristige Zusammenarbeit nach Absprache',
    siteAccess: '',
    cooperationTerms: 'Standortmiete oder Umsatzbeteiligung nach gemeinsamer Absprache.',
    concept:
      'STEKI ist ein mobiler griechischer Foodtruck mit frisch zubereiteten Spezialitäten. Wir möchten unseren Foodtruck regelmässig auf der vorgeschlagenen Fläche betreiben und damit das gastronomische Angebot am Standort ergänzen.',
    benefits:
      'Ein professioneller, sauber geführter Foodtruck, ein flexibles Menü, kurze Bestellzeiten und ein attraktives Angebot für Mitarbeitende, Besucherinnen, Besucher und die Nachbarschaft.',
    notes:
      'Die genaue Positionierung, Zufahrt, Betriebszeiten, Entsorgung und alle weiteren organisatorischen Details stimmen wir vor der Aufstellung gemeinsam ab.',
  }
}

function Field({ label, className = '', ...props }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <input {...props} />
    </label>
  )
}

function TextArea({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea {...props} />
    </label>
  )
}

export default function OfferBuilder({ onBack }) {
  const [proposal, setProposal] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return createInitialProposal()
    try {
      return { ...createInitialProposal(), ...JSON.parse(stored) }
    } catch {
      return createInitialProposal()
    }
  })

  const update = (field, value) => {
    setProposal((current) => ({ ...current, [field]: value }))
  }

  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposal))
  }

  const newProposal = () => {
    if (window.confirm('Aktuelle Standortanfrage verwerfen und eine neue beginnen?')) {
      setProposal(createInitialProposal())
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const fileName = `STEKI-Standortanfrage-${proposal.proposalNumber || 'Entwurf'}.pdf`

  return (
    <div className="module-page">
      <div className="module-toolbar">
        <button className="back-button" type="button" onClick={onBack}>
          <Icon name="back" size={18} /> Übersicht
        </button>
        <div>
          <span className="module-kicker">STANDORT-PDF</span>
          <h1>Standortanfrage erstellen</h1>
        </div>
        <div className="toolbar-actions">
          <button className="secondary-button" type="button" onClick={newProposal}>
            Neue Anfrage
          </button>
          <button className="secondary-button" type="button" onClick={saveDraft}>
            Entwurf speichern
          </button>
          <PDFDownloadLink
            className="primary-button"
            document={<OfferDocument proposal={proposal} />}
            fileName={fileName}
          >
            {({ loading }) => (
              <>
                <Icon name="download" size={18} />
                {loading ? 'PDF wird erstellt…' : 'PDF herunterladen'}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="builder-layout">
        <main className="form-stack">
          <section className="panel">
            <div className="panel-heading">
              <span className="step">01</span>
              <div>
                <h2>Dokument</h2>
                <p>Referenz und Erstellungsdatum</p>
              </div>
            </div>
            <div className="fields-grid">
              <Field
                label="Referenznummer"
                value={proposal.proposalNumber}
                onChange={(event) => update('proposalNumber', event.target.value)}
              />
              <Field
                label="Datum"
                type="date"
                value={proposal.issueDate}
                onChange={(event) => update('issueDate', event.target.value)}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="step">02</span>
              <div>
                <h2>Empfänger</h2>
                <p>Eigentümer, Verwaltung oder zuständige Kontaktperson</p>
              </div>
            </div>
            <div className="fields-grid">
              <Field
                label="Kontaktperson"
                placeholder="Vorname Nachname"
                value={proposal.recipientName}
                onChange={(event) => update('recipientName', event.target.value)}
              />
              <Field
                label="Firma / Verwaltung"
                placeholder="Firmenname"
                value={proposal.recipientCompany}
                onChange={(event) => update('recipientCompany', event.target.value)}
              />
              <Field
                label="Postadresse"
                placeholder="Strasse, PLZ Ort"
                value={proposal.recipientAddress}
                onChange={(event) => update('recipientAddress', event.target.value)}
              />
              <Field
                label="E-Mail"
                type="email"
                placeholder="kontakt@beispiel.ch"
                value={proposal.recipientEmail}
                onChange={(event) => update('recipientEmail', event.target.value)}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="step">03</span>
              <div>
                <h2>Gewünschter Standort</h2>
                <p>Fläche, Zeitraum und geplante Betriebszeiten</p>
              </div>
            </div>
            <div className="fields-grid">
              <Field
                label="Name des Standorts"
                placeholder="z. B. Firmenareal / Parkplatz"
                value={proposal.locationName}
                onChange={(event) => update('locationName', event.target.value)}
              />
              <Field
                label="Adresse der Fläche"
                placeholder="Strasse, PLZ Ort"
                value={proposal.locationAddress}
                onChange={(event) => update('locationAddress', event.target.value)}
              />
              <Field
                label="Gewünschter Start"
                type="date"
                value={proposal.desiredStart}
                onChange={(event) => update('desiredStart', event.target.value)}
              />
              <Field
                label="Betriebstage"
                placeholder="z. B. Montag bis Freitag"
                value={proposal.operatingDays}
                onChange={(event) => update('operatingDays', event.target.value)}
              />
              <Field
                label="Betriebszeiten"
                placeholder="z. B. 11:00–14:00 Uhr"
                value={proposal.operatingHours}
                onChange={(event) => update('operatingHours', event.target.value)}
              />
              <Field
                label="Dauer der Zusammenarbeit"
                value={proposal.duration}
                onChange={(event) => update('duration', event.target.value)}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="step">04</span>
              <div>
                <h2>Konzept & Mehrwert</h2>
                <p>So wird STEKI dem Standort präsentiert</p>
              </div>
            </div>
            <div className="textarea-stack">
              <TextArea
                label="Unser Konzept"
                rows="5"
                value={proposal.concept}
                onChange={(event) => update('concept', event.target.value)}
              />
              <TextArea
                label="Mehrwert für den Standort"
                rows="4"
                value={proposal.benefits}
                onChange={(event) => update('benefits', event.target.value)}
              />
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <span className="step">05</span>
              <div>
                <h2>Rahmenbedingungen</h2>
                <p>Zufahrt, Platzierung und mögliche Zusammenarbeit</p>
              </div>
            </div>
            <div className="textarea-stack">
              <TextArea
                label="Zufahrt / Hinweise zur Fläche"
                rows="3"
                placeholder="Optional: bekannte Zufahrt, Untergrund, Abstand zum Stromanschluss …"
                value={proposal.siteAccess}
                onChange={(event) => update('siteAccess', event.target.value)}
              />
              <TextArea
                label="Konditionen der Zusammenarbeit"
                rows="3"
                value={proposal.cooperationTerms}
                onChange={(event) => update('cooperationTerms', event.target.value)}
              />
              <TextArea
                label="Weitere Bemerkungen"
                rows="4"
                value={proposal.notes}
                onChange={(event) => update('notes', event.target.value)}
              />
            </div>
          </section>
        </main>

        <aside className="summary-column">
          <section className="summary-card placement-card">
            <span className="summary-eyebrow">ZIEL DER ANFRAGE</span>
            <h3>Foodtruck auf einer neuen Fläche platzieren</h3>
            <p>
              Das PDF bittet den Empfänger um die Möglichkeit, STEKI am angegebenen Standort
              aufzustellen und regelmässig zu betreiben.
            </p>
          </section>

          <section className="summary-card">
            <div className="summary-title">
              <Icon name="truck" size={21} />
              <h3>Foodtruck-Daten</h3>
            </div>
            <div className="truck-facts">
              {truckDetails.map((detail) => (
                <div key={detail.label}>
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              ))}
            </div>
            <p className="flex-note">{truckNote}</p>
            <span className="pdf-note">
              <Icon name="check" size={15} /> Technische Pläne werden automatisch angehängt.
            </span>
          </section>
        </aside>
      </div>
    </div>
  )
}
