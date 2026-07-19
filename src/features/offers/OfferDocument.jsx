import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import logo from '../../assets/logo.jpeg'
import backView from '../../assets/plans/foodtruck-back-view.png'
import floorPlan from '../../assets/plans/foodtruck-floor-plan.png'
import { company, truckDetails, truckNote } from '../../data/company'

const colors = {
  navy: '#071d38',
  blue: '#103965',
  gold: '#e4a527',
  cream: '#f7f3e9',
  muted: '#647184',
  line: '#ded8c9',
  white: '#ffffff',
}

const formatDate = (value) => {
  if (!value) return 'Nach Absprache'
  return new Intl.DateTimeFormat('de-CH').format(new Date(`${value}T12:00:00`))
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingHorizontal: 42,
    paddingBottom: 45,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.navy,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 15,
    marginBottom: 24,
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 52, height: 52, objectFit: 'cover', borderRadius: 26 },
  brandText: { marginLeft: 11 },
  brandName: { fontSize: 19, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  brandTagline: { marginTop: 3, color: colors.gold, fontSize: 7, letterSpacing: 1.5 },
  company: { alignItems: 'flex-end', color: colors.muted, lineHeight: 1.45 },
  topGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 },
  recipient: { width: '54%', lineHeight: 1.5 },
  recipientLabel: {
    color: colors.gold,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  recipientStrong: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  meta: { width: '35%' },
  metaLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  metaLabel: { color: colors.muted },
  metaValue: { fontFamily: 'Helvetica-Bold' },
  eyebrow: {
    color: colors.gold,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    marginBottom: 7,
  },
  title: {
    maxWidth: 470,
    fontSize: 25,
    lineHeight: 1.14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 18,
  },
  letter: { color: colors.muted, lineHeight: 1.6, marginBottom: 10 },
  salutation: { fontFamily: 'Helvetica-Bold', color: colors.navy, marginBottom: 9 },
  cardGrid: { flexDirection: 'row', marginTop: 15, marginBottom: 17 },
  card: {
    width: '49%',
    padding: 13,
    backgroundColor: colors.cream,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  cardGap: { marginRight: '2%' },
  cardTitle: {
    color: colors.gold,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    marginBottom: 7,
  },
  cardStrong: { fontFamily: 'Helvetica-Bold', fontSize: 10, marginBottom: 4 },
  cardText: { color: colors.muted, lineHeight: 1.5 },
  contentBlock: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  blockTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, marginBottom: 5 },
  blockText: { color: colors.muted, lineHeight: 1.55 },
  requirements: {
    padding: 13,
    color: colors.white,
    backgroundColor: colors.navy,
    marginTop: 3,
  },
  requirementsTitle: {
    color: colors.gold,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  requirementGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  requirement: { width: '33%', marginBottom: 6 },
  requirementLabel: { color: '#aebdca', fontSize: 7 },
  requirementValue: { marginTop: 2, fontFamily: 'Helvetica-Bold' },
  closing: { marginTop: 16, color: colors.muted, lineHeight: 1.55 },
  signature: { marginTop: 13, color: colors.navy, lineHeight: 1.45 },
  signatureName: { fontFamily: 'Helvetica-Bold' },
  sectionTitle: {
    fontSize: 23,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 7,
  },
  sectionIntro: { color: colors.muted, lineHeight: 1.55, marginBottom: 18, maxWidth: 440 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  fact: {
    width: '31.7%',
    marginRight: '1.6%',
    marginBottom: 8,
    padding: 10,
    backgroundColor: colors.cream,
  },
  factLabel: { color: colors.muted, fontSize: 7, marginBottom: 3 },
  factValue: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  flexibility: {
    padding: 13,
    backgroundColor: colors.navy,
    color: colors.white,
    marginBottom: 17,
    lineHeight: 1.5,
  },
  flexibilityTitle: {
    color: colors.gold,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  plans: { flexDirection: 'row', justifyContent: 'space-between' },
  planCard: { width: '49%', borderWidth: 1, borderColor: colors.line, padding: 7 },
  planImage: { width: '100%', height: 170, objectFit: 'contain' },
  planLabel: {
    marginTop: 6,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: colors.blue,
  },
  placementNote: {
    marginTop: 17,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.line,
  },
  placementTitle: { fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  placementText: { color: colors.muted, lineHeight: 1.55 },
  footer: {
    position: 'absolute',
    left: 42,
    right: 42,
    bottom: 19,
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: colors.muted,
    fontSize: 7,
  },
})

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <Image src={logo} style={styles.logo} />
        <View style={styles.brandText}>
          <Text style={styles.brandName}>STEKI</Text>
          <Text style={styles.brandTagline}>GREEK TASTE</Text>
        </View>
      </View>
      <View style={styles.company}>
        <Text>{company.name}</Text>
        <Text>{company.address} · {company.city}</Text>
        <Text>{company.email} · {company.website}</Text>
      </View>
    </View>
  )
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>{company.brand} · {company.email}</Text>
      <Text render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`} />
    </View>
  )
}

export default function OfferDocument({ proposal }) {
  const recipient = proposal.recipientName || proposal.recipientCompany
  const salutation = proposal.recipientName
    ? `Guten Tag ${proposal.recipientName}`
    : 'Sehr geehrte Damen und Herren'

  return (
    <Document
      title={`Standortanfrage ${proposal.proposalNumber || 'STEKI'}`}
      author={company.name}
      subject="Anfrage zur Platzierung des STEKI Foodtrucks"
    >
      <Page size="A4" style={styles.page}>
        <Header />

        <View style={styles.topGrid}>
          <View style={styles.recipient}>
            <Text style={styles.recipientLabel}>EMPFÄNGER</Text>
            <Text style={styles.recipientStrong}>{recipient || 'Zuständige Kontaktperson'}</Text>
            {proposal.recipientName && proposal.recipientCompany ? (
              <Text>{proposal.recipientCompany}</Text>
            ) : null}
            <Text>{proposal.recipientAddress || 'Adresse'}</Text>
            <Text>{proposal.recipientEmail || ''}</Text>
          </View>
          <View style={styles.meta}>
            <View style={styles.metaLine}>
              <Text style={styles.metaLabel}>Referenz</Text>
              <Text style={styles.metaValue}>{proposal.proposalNumber || '–'}</Text>
            </View>
            <View style={styles.metaLine}>
              <Text style={styles.metaLabel}>Datum</Text>
              <Text style={styles.metaValue}>{formatDate(proposal.issueDate)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.eyebrow}>ANFRAGE FÜR EINEN FOODTRUCK-STANDORT</Text>
        <Text style={styles.title}>
          Platzierung des STEKI Foodtrucks auf Ihrer Fläche
        </Text>

        <Text style={styles.salutation}>{salutation}</Text>
        <Text style={styles.letter}>
          wir möchten gerne prüfen, ob die Möglichkeit besteht, unseren STEKI Foodtruck auf Ihrer
          Fläche zu platzieren und dort regelmässig zu betreiben.
        </Text>
        <Text style={styles.letter}>{proposal.concept}</Text>

        <View style={styles.cardGrid} wrap={false}>
          <View style={[styles.card, styles.cardGap]}>
            <Text style={styles.cardTitle}>GEWÜNSCHTER STANDORT</Text>
            <Text style={styles.cardStrong}>{proposal.locationName || 'Fläche / Standort'}</Text>
            <Text style={styles.cardText}>{proposal.locationAddress || 'Adresse nach Absprache'}</Text>
            <Text style={styles.cardText}>Start: {formatDate(proposal.desiredStart)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>GEPLANTER BETRIEB</Text>
            <Text style={styles.cardStrong}>{proposal.operatingDays || 'Betriebstage nach Absprache'}</Text>
            <Text style={styles.cardText}>{proposal.operatingHours || 'Betriebszeiten nach Absprache'}</Text>
            <Text style={styles.cardText}>{proposal.duration}</Text>
          </View>
        </View>

        <View style={styles.contentBlock} wrap={false}>
          <Text style={styles.blockTitle}>Mehrwert für den Standort</Text>
          <Text style={styles.blockText}>{proposal.benefits}</Text>
        </View>
        <View style={styles.contentBlock} wrap={false}>
          <Text style={styles.blockTitle}>Mögliche Zusammenarbeit</Text>
          <Text style={styles.blockText}>{proposal.cooperationTerms}</Text>
        </View>

        <View style={styles.requirements} wrap={false}>
          <Text style={styles.requirementsTitle}>TECHNISCHE VORAUSSETZUNGEN</Text>
          <View style={styles.requirementGrid}>
            {truckDetails.map((detail) => (
              <View style={styles.requirement} key={detail.label}>
                <Text style={styles.requirementLabel}>{detail.label.toUpperCase()}</Text>
                <Text style={styles.requirementValue}>{detail.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {proposal.siteAccess ? (
          <Text style={styles.closing}>Hinweis zur Fläche: {proposal.siteAccess}</Text>
        ) : null}
        <Text style={styles.closing}>{proposal.notes}</Text>
        <Text style={styles.closing}>
          Gerne besichtigen wir den möglichen Standort gemeinsam und klären alle technischen sowie
          organisatorischen Fragen persönlich. Wir freuen uns über Ihre Rückmeldung.
        </Text>
        <View style={styles.signature}>
          <Text>Freundliche Grüsse</Text>
          <Text style={styles.signatureName}>{company.name}</Text>
          <Text>{company.brand}</Text>
        </View>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Header />
        <Text style={styles.eyebrow}>TECHNISCHE DOKUMENTATION</Text>
        <Text style={styles.sectionTitle}>Foodtruck & Platzbedarf</Text>
        <Text style={styles.sectionIntro}>
          Für die Aufstellung benötigen wir eine geeignete, ebene Fläche mit sicherer Zufahrt.
          Der Betrieb erfolgt überwiegend mit Gas; zusätzlich wird ein 32-A-Stromanschluss benötigt.
        </Text>

        <View style={styles.facts}>
          {truckDetails.map((detail) => (
            <View style={styles.fact} key={detail.label}>
              <Text style={styles.factLabel}>{detail.label.toUpperCase()}</Text>
              <Text style={styles.factValue}>{detail.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.flexibility}>
          <Text style={styles.flexibilityTitle}>FLEXIBLES GASTRONOMISCHES ANGEBOT</Text>
          <Text>{truckNote}</Text>
        </View>

        <View style={styles.plans}>
          <View style={styles.planCard}>
            <Image src={backView} style={styles.planImage} />
            <Text style={styles.planLabel}>Seitenansicht / Abmessungen</Text>
          </View>
          <View style={styles.planCard}>
            <Image src={floorPlan} style={styles.planImage} />
            <Text style={styles.planLabel}>Grundriss / Arbeitsbereich</Text>
          </View>
        </View>

        <View style={styles.placementNote}>
          <Text style={styles.placementTitle}>Anforderungen an die Fläche</Text>
          <Text style={styles.placementText}>
            Die Zufahrt und der Stellplatz müssen für einen Foodtruck von 6,00 m Länge, 2,40 m
            Breite und 3,10 m Höhe geeignet sein. Der 32-A-Stromanschluss muss in erreichbarer Nähe
            liegen. Die konkrete Positionierung, Abstände, Entsorgung und Betriebszeiten werden
            vor der Aufstellung gemeinsam abgestimmt.
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  )
}
