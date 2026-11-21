import Link from "next/link";

export default function PublicPage() {
  const solutions = ["Maternelle", "Primaire", "Collège", "Lycée", "Université", "Groupes scolaires"];
  const modules = ["Inscriptions", "Apprenants", "Pédagogie", "Examens", "Présences", "Finances", "RH", "Familles", "Vie scolaire", "IA & statistiques"];

  return (
    <main className="marketing-page">
      <nav className="marketing-nav">
        <Link href="/" className="marketing-brand">edu<span>core</span></Link>
        <Link href="/login" className="marketing-nav-action">Se connecter</Link>
      </nav>

      <section className="marketing-hero">
        <div className="marketing-hero-copy">
          <p className="marketing-eyebrow">Plateforme éducative internationale</p>
          <h1 className="marketing-title">Une plateforme.<br />Chaque parcours éducatif.</h1>
          <p className="marketing-description">EduCore réunit administration, pédagogie, finances, familles, vie scolaire et pilotage dans un environnement configurable pour chaque établissement.</p>
          <div className="marketing-actions">
            <Link href="/" className="marketing-primary-link">Voir la démonstration</Link>
            <a href="#solutions" className="marketing-secondary-link">Découvrir les solutions</a>
          </div>
        </div>
        <aside className="marketing-summary">
          <p>Vue consolidée</p>
          <h2>Pilotez chaque établissement.</h2>
          {["Apprenants", "Présence", "Recettes", "Inscriptions"].map((label, index) => (
            <div className="marketing-summary-row" key={label}>
              <span>{label}</span>
              <strong>{["1 284", "94,2 %", "86,4 M", "+12 %"][index]}</strong>
            </div>
          ))}
        </aside>
      </section>

      <section className="marketing-solutions" id="solutions">
        <div className="marketing-section-inner">
          <p className="marketing-eyebrow">Solutions adaptées</p>
          <h2 className="marketing-section-title">Un même socle, une configuration propre à chaque réalité.</h2>
          <div className="marketing-solution-grid">
            {solutions.map((item) => (
              <article className="marketing-solution-card" key={item}>
                <strong>{item}</strong>
                <p>Structure, rôles, modules et tableaux de bord adaptés.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-domains">
        <div className="marketing-section-inner">
          <p className="marketing-eyebrow">18 domaines</p>
          <h2 className="marketing-section-title">Une vision complète de la vie éducative.</h2>
          <div className="marketing-domain-list">
            {modules.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>
    </main>
  );
}
