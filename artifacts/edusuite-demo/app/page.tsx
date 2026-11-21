import Link from "next/link";

export default function HomePage() {
  const solutions = ["Maternelle", "Primaire", "Collège", "Lycée", "Université", "Groupes scolaires"];
  const modules = ["Inscriptions", "Apprenants", "Pédagogie", "Examens", "Présences", "Finances", "RH", "Familles", "Vie scolaire", "IA & statistiques"];
  return (
    <main style={{ background: "#f7f8f6", color: "#263344", minHeight: "100vh", fontFamily: "DM Sans, sans-serif" }}>
      <nav style={{ maxWidth: 1180, margin: "0 auto", height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <strong style={{ fontSize: 20 }}>edu<span style={{ color: "#397968" }}>core</span></strong>
        <Link href="/login" style={{ textDecoration: "none", background: "#1f6555", color: "white", padding: "11px 16px", borderRadius: 9, fontWeight: 700, fontSize: 13 }}>Se connecter</Link>
      </nav>
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 24px", display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 60, alignItems: "center" }}>
        <div>
          <p style={{ color: "#397968", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", fontSize: 11 }}>Plateforme éducative internationale</p>
          <h1 style={{ fontSize: 54, lineHeight: 1.06, margin: "14px 0 22px", letterSpacing: "-3px" }}>Une plateforme.<br />Chaque parcours éducatif.</h1>
          <p style={{ maxWidth: 620, lineHeight: 1.7, color: "#68747a", fontSize: 17 }}>EduCore réunit administration, pédagogie, finances, familles, vie scolaire et pilotage dans un environnement configurable pour chaque établissement.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            <Link href="/login" style={{ textDecoration: "none", background: "#1f6555", color: "white", padding: "13px 18px", borderRadius: 9, fontWeight: 700 }}>Se connecter à la démo</Link>
            <a href="#solutions" style={{ textDecoration: "none", border: "1px solid #dfe5dc", background: "white", color: "#335c51", padding: "13px 18px", borderRadius: 9, fontWeight: 700 }}>Découvrir les solutions</a>
          </div>
        </div>
        <div style={{ background: "#173e39", borderRadius: 24, padding: 28, color: "white", boxShadow: "0 24px 60px rgba(23,62,57,.14)" }}>
          <p style={{ color: "#b9ccc5", fontSize: 12 }}>Vue consolidée</p>
          <h2 style={{ margin: "8px 0 24px" }}>Pilotez chaque établissement.</h2>
          {["Apprenants", "Présence", "Recettes", "Inscriptions"].map((label, index) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,.12)", padding: "14px 0" }}>
              <span>{label}</span><strong>{["1 284", "94,2 %", "86,4 M", "+12 %"][index]}</strong>
            </div>
          ))}
        </div>
      </section>
      <section id="solutions" style={{ background: "white", padding: "68px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <p style={{ color: "#397968", fontWeight: 800, textTransform: "uppercase", fontSize: 11 }}>Solutions adaptées</p>
          <h2 style={{ fontSize: 34, margin: "8px 0 28px" }}>Un même socle, une configuration propre à chaque réalité.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {solutions.map((item) => <article key={item} style={{ border: "1px solid #e7e9e3", borderRadius: 14, padding: 20 }}><strong>{item}</strong><p style={{ color: "#7a8586", lineHeight: 1.6 }}>Structure, rôles, modules et tableaux de bord adaptés.</p></article>)}
          </div>
        </div>
      </section>
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "68px 24px" }}>
        <p style={{ color: "#397968", fontWeight: 800, textTransform: "uppercase", fontSize: 11 }}>18 domaines</p>
        <h2 style={{ fontSize: 34 }}>Une vision complète de la vie éducative.</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
          {modules.map((item) => <span key={item} style={{ background: "white", border: "1px solid #e7e9e3", borderRadius: 999, padding: "9px 13px", fontSize: 12 }}>{item}</span>)}
        </div>
      </section>
    </main>
  );
}
