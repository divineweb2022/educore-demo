"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import { demoAccounts, demoProfiles } from "../../src/demo-config";

export default function LoginPage() {
  const [profileId, setProfileId] = useState("primaire");
  const [accountId, setAccountId] = useState("directeur");
  const [email, setEmail] = useState("directeur@edusuite.demo");
  const [password, setPassword] = useState("Directeur2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const selectedProfile = demoProfiles.find((profile) => profile.id === profileId) ?? demoProfiles[1];
  const accounts = useMemo(
    () => demoAccounts.filter((account) => account.institutionProfiles.includes(profileId)),
    [profileId],
  );

  const chooseAccount = (accountIdValue: string) => {
    const account = demoAccounts.find((item) => item.id === accountIdValue);
    if (!account) return;
    setAccountId(account.id);
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const account = demoAccounts.find((item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password &&
      item.institutionProfiles.includes(profileId),
    );
    if (!account) {
      setError("Vérifiez le type d’établissement, l’e-mail ou le mot de passe.");
      return;
    }
    localStorage.setItem("educore-demo-session", JSON.stringify({
      account,
      profile: selectedProfile,
    }));
    window.location.assign("/demo");
  };

  return (
    <main className="classic-login-page">
      <aside className="classic-login-aside">
        <Link href="/" className="classic-login-brand">
          <span className="classic-login-brand-mark"><GraduationCap size={21} /></span>
          <strong style={{ fontSize: 21 }}>edu<span style={{ color: "#e9b766" }}>core</span></strong>
        </Link>
        <div style={{ maxWidth: 430 }}>
          <p style={{ color: "#d6b66e", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 800, fontSize: 11 }}>Espace de démonstration</p>
          <h1 className="classic-login-title">Votre établissement,<br />chaque équipe.</h1>
          <p style={{ color: "#bfd0ca", lineHeight: 1.75 }}>Sélectionnez un profil fictif pour découvrir les fonctions adaptées à votre établissement.</p>
        </div>
        <small className="classic-login-footnote">Environnement de démonstration · aucune donnée réelle</small>
      </aside>
      <section className="classic-login-content">
        <form onSubmit={submit} className="classic-login-form">
          <p style={{ color: "#397968", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 800, fontSize: 10 }}>Connexion démo</p>
          <h2 style={{ fontSize: 28, margin: "8px 0 6px" }}>Accéder à EduCore</h2>
          <p style={{ color: "#7a8586", marginBottom: 24 }}>Choisissez un environnement puis un compte fictif.</p>

          <label style={{ display: "block", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Type d’établissement</label>
          <select value={profileId} onChange={(event) => { setProfileId(event.target.value); setAccountId(""); setEmail(""); setPassword(""); setError(""); }} style={{ width: "100%", height: 44, border: "1px solid #dfe5dc", borderRadius: 9, padding: "0 12px", marginBottom: 18, background: "white" }}>
            {demoProfiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.label}</option>)}
          </select>

          <label style={{ display: "block", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Compte de démonstration</label>
          <select value={accountId} onChange={(event) => chooseAccount(event.target.value)} style={{ width: "100%", height: 44, border: "1px solid #dfe5dc", borderRadius: 9, padding: "0 12px", marginBottom: 18, background: "white" }}>
            {!accounts.length && <option value="">Aucun compte disponible</option>}
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.role}</option>)}
          </select>

          <label htmlFor="login-email" style={{ display: "block", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Adresse e-mail</label>
          <div style={{ height: 44, border: "1px solid #dfe5dc", borderRadius: 9, display: "flex", alignItems: "center", padding: "0 12px", marginBottom: 16 }}>
            <Mail size={15} color="#71817b" />
            <input className="classic-login-input" id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={{ border: 0, outline: 0, flex: 1, height: 40, padding: "0 9px" }} />
          </div>

          <label htmlFor="login-password" style={{ display: "block", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Mot de passe démo</label>
          <div style={{ height: 44, border: "1px solid #dfe5dc", borderRadius: 9, display: "flex", alignItems: "center", padding: "0 12px", marginBottom: 8 }}>
            <LockKeyhole size={15} color="#71817b" />
            <input className="classic-login-input" id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} style={{ border: 0, outline: 0, flex: 1, height: 40, padding: "0 9px" }} />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} style={{ border: 0, background: "transparent", color: "#71817b", display: "grid", placeItems: "center" }}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {error && <p role="alert" style={{ color: "#b54a42", fontSize: 12, margin: "8px 0" }}>{error}</p>}

          <button type="submit" style={{ width: "100%", height: 46, marginTop: 14, border: 0, borderRadius: 9, background: "#1f6555", color: "white", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            Se connecter <ArrowRight size={16} />
          </button>
          <p style={{ color: "#89938f", fontSize: 11, marginTop: 14, textAlign: "center" }}>Compte fictif · aucune donnée scolaire réelle</p>
        </form>
      </section>
      <span style={{ display: "none" }}>{selectedProfile.label}</span>
    </main>
  );
}
