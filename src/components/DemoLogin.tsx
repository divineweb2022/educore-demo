import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  LockKeyhole,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react';
import './demo-login.css';

export type InstitutionProfile = { id: string; label: string; description: string };
export type DemoAccount = { id: string; name: string; role: string; email: string; password: string; initials: string; description: string; institutionProfiles: string[] };
export type DemoLoginProps = { profiles: InstitutionProfile[]; accounts: DemoAccount[]; onLogin: (account: DemoAccount, profile: InstitutionProfile) => void };

const palettes = [
  { accent: '#397968', deep: '#244f49', wash: '#e7f0e9' },
  { accent: '#b5764e', deep: '#754a38', wash: '#f5e9df' },
  { accent: '#597a91', deep: '#345567', wash: '#e6eef2' },
  { accent: '#8b6a84', deep: '#5d465c', wash: '#f0e8ef' },
  { accent: '#a17a37', deep: '#6d542b', wash: '#f4eedc' },
  { accent: '#557b72', deep: '#36584f', wash: '#e8f0e9' },
  { accent: '#787b4c', deep: '#515437', wash: '#eff0df' },
];

function profilePalette(profile: InstitutionProfile | undefined) {
  if (!profile) return palettes[0];
  const id = profile.id.toLocaleLowerCase('fr');
  const label = `${id} ${profile.label}`.toLocaleLowerCase('fr');
  if (label.includes('matern') || label.includes('nurser')) return palettes[1];
  if (label.includes('primaire') || label.includes('primary')) return palettes[6];
  if (label.includes('collège') || label.includes('college')) return palettes[2];
  if (label.includes('lycée') || label.includes('secondary')) return palettes[3];
  if (label.includes('univers') || label.includes('university')) return palettes[4];
  if (label.includes('groupe') || label.includes('group') || label.includes('multi')) return palettes[5];
  return palettes[parseInt(id.replace(/\D/g, '').slice(-1), 10) % palettes.length || 0];
}

export default function DemoLogin({ profiles, accounts, onLogin }: DemoLoginProps) {
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [accountQuery, setAccountQuery] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<{ profile?: string; email?: string; password?: string; form?: string }>({});
  const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const matchingAccounts = accounts
    .filter((account) => !selectedProfile || account.institutionProfiles.includes(selectedProfile.id))
    .filter((account) => `${account.role} ${account.description}`.toLocaleLowerCase('fr').includes(accountQuery.toLocaleLowerCase('fr')));
  const palette = useMemo(() => profilePalette(selectedProfile), [selectedProfile]);
  const style = {
    '--login-accent': palette.accent,
    '--login-accent-deep': palette.deep,
    '--login-wash': palette.wash,
  } as CSSProperties;

  const chooseProfile = (profile: InstitutionProfile) => {
    setSelectedProfileId(profile.id);
    setSelectedAccountId('');
    setAccountQuery('');
    setEmail('');
    setPassword('');
    setErrors({});
  };

  const chooseAccount = (account: DemoAccount) => {
    setSelectedAccountId(account.id);
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!selectedProfile) nextErrors.profile = 'Choisissez d’abord un type d’établissement.';
    if (!email.trim()) nextErrors.email = 'Saisissez l’adresse de démonstration.';
    if (!password) nextErrors.password = 'Saisissez le mot de passe de démonstration.';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Cette adresse e-mail ne semble pas valide.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const match = accounts.find((account) => account.email.toLocaleLowerCase('fr') === email.trim().toLocaleLowerCase('fr') && account.password === password);
    if (!match) {
      setErrors({ form: 'Ces identifiants ne correspondent à aucun compte de démonstration fourni.' });
      return;
    }
    if (!selectedProfile || !match.institutionProfiles.includes(selectedProfile.id)) {
      setErrors({ form: 'Ce rôle n’est pas disponible pour le type d’établissement sélectionné.' });
      return;
    }
    setErrors({});
    onLogin(match, selectedProfile!);
  };

  const profileIcon = (label: string) => {
    const normalized = label.toLocaleLowerCase('fr');
    if (normalized.includes('univers')) return GraduationCap;
    if (normalized.includes('groupe') || normalized.includes('multi')) return UsersRound;
    if (normalized.includes('matern')) return Sparkles;
    if (normalized.includes('second') || normalized.includes('lycée') || normalized.includes('collège')) return BookOpen;
    return Building2;
  };

  return (
    <main className="demo-login" style={style} data-testid="demo-login">
      <div className="login-frame">
        <header className="login-topline">
          <div className="login-brand" aria-label="EduCore">
            <div className="login-brand-mark"><GraduationCap size={20} strokeWidth={1.8} /></div>
            <div>
              <div className="login-wordmark">edu<span>core</span></div>
              <span className="login-brand-caption">La vie scolaire, en accord</span>
            </div>
          </div>
          <div className="login-demo-tag"><Sparkles size={13} /> Environnement démo</div>
        </header>

        <div className="login-layout">
          <section className="login-intro" aria-labelledby="login-welcome-title">
            <div>
              <p className="login-kicker">Un espace pour chaque parcours</p>
              <h1 className="login-title" id="login-welcome-title">L’école avance.<br /><em>Ensemble.</em></h1>
              <p className="login-intro-copy">Une plateforme adaptable à chaque réalité éducative — de la petite section aux amphithéâtres, d’un établissement à tout un réseau.</p>

              <div className="login-orbit" aria-hidden="true">
                <div className="orbit-core"><GraduationCap size={39} strokeWidth={1.4} /></div>
                <span className="orbit-node node-one"><BookOpen size={17} /></span>
                <span className="orbit-node node-two"><UsersRound size={17} /></span>
                <span className="orbit-node node-three"><Building2 size={17} /></span>
                <span className="orbit-node node-four"><UserRound size={17} /></span>
                <span className="login-orbit-label">Une même vision · des espaces distincts</span>
              </div>
            </div>
            <div className="login-trust-line"><ShieldCheck size={16} /> Une démonstration guidée, sans données scolaires réelles.</div>
          </section>

          <section className="login-panel" aria-labelledby="login-panel-title">
            <div className="login-panel-heading">
              <div>
                <h2 id="login-panel-title">Accéder à la démo</h2>
                <p>Choisissez un établissement et un rôle métier pour parcourir les espaces correspondants.</p>
              </div>
              <span className="login-step">Accès démo</span>
            </div>

            <div className="login-section-label" id="profile-label">01 <span>Type d’établissement</span></div>
            {profiles.length ? (
              <div className="login-profile-list" role="group" aria-labelledby="profile-label" data-testid="profile-list">
                {profiles.map((profile) => {
                  const Icon = profileIcon(profile.label);
                  return (
                    <button
                      className="login-profile-option"
                      type="button"
                      key={profile.id}
                      aria-pressed={selectedProfileId === profile.id}
                      aria-label={`Choisir ${profile.label} : ${profile.description}`}
                      onClick={() => chooseProfile(profile)}
                      data-testid={`profile-${profile.id}`}
                    >
                      <span className="profile-symbol"><Icon size={15} /></span>
                      <span className="profile-copy"><strong>{profile.label}</strong><small>{profile.description}</small></span>
                    </button>
                  );
                })}
              </div>
            ) : <div className="login-empty" role="status">Aucun type d’établissement n’est disponible pour le moment.</div>}
            {errors.profile && <p className="login-error" role="alert" data-testid="profile-error">{errors.profile}</p>}

            <div className="login-account-block">
              <div className="login-section-label" id="account-label">02 <span>Rôle et compte de démonstration</span></div>
              {!selectedProfile ? (
                <div className="login-empty">Sélectionnez un établissement pour afficher les comptes de démonstration.</div>
              ) : accounts.length ? (
                <>
                <label className="login-account-search"><Search size={14} /><span className="sr-only">Rechercher un rôle</span><input aria-label="Rechercher un rôle ou un compte" value={accountQuery} onChange={(event) => setAccountQuery(event.target.value)} placeholder="Rechercher un rôle ou un compte…" /></label>
                <div className="login-account-list" role="group" aria-labelledby="account-label" data-testid="account-list">
                  {matchingAccounts.map((account) => (
                    <button
                      className="login-account-option"
                      type="button"
                      key={account.id}
                      aria-pressed={selectedAccountId === account.id}
                      aria-label={`Choisir le rôle ${account.role}`}
                      onClick={() => chooseAccount(account)}
                      data-testid={`account-${account.id}`}
                    >
                      <span className="account-top">
                        <span className="account-avatar" aria-hidden="true"><UserRound size={15} /></span>
                        <span className="account-person"><strong>{account.role}</strong><small>{account.description}</small></span>
                        {selectedAccountId === account.id && <ShieldCheck className="account-picked" size={16} aria-label="Compte sélectionné" />}
                      </span>
                      <span className="account-credentials">
                        <span className="credential-line"><span>E-mail démo</span><code>{account.email}</code></span>
                        <span className="credential-line"><span>Mot de passe démo</span><code>{account.password}</code></span>
                      </span>
                    </button>
                  ))}
                  {!matchingAccounts.length && <div className="login-empty">Aucun rôle ne correspond à cette recherche.</div>}
                </div>
                </>
              ) : (
                <div className="login-empty" role="status">Aucun compte fictif n’est disponible dans cette démonstration.</div>
              )}
            </div>

            <form onSubmit={submit} noValidate data-testid="login-form">
              <div className="login-fields">
                <div className="login-field">
                  <label htmlFor="demo-login-email">Adresse e-mail</label>
                  <div className="login-input-wrap">
                    <Mail className="login-input-icon" size={15} aria-hidden="true" />
                    <input
                      className="login-input"
                      id="demo-login-email"
                      type="email"
                      autoComplete="username"
                      placeholder="nom@edusuite.demo"
                      value={email}
                      onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined, form: undefined })); }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'demo-login-email-error' : undefined}
                      data-testid="login-email"
                    />
                  </div>
                  {errors.email && <p className="login-error" id="demo-login-email-error" role="alert" data-testid="email-error">{errors.email}</p>}
                </div>

                <div className="login-field">
                  <label htmlFor="demo-login-password">Mot de passe démo</label>
                  <div className="login-input-wrap">
                    <KeyRound className="login-input-icon" size={15} aria-hidden="true" />
                    <input
                      className="login-input login-password-input"
                      id="demo-login-password"
                      type={passwordVisible ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Mot de passe fictif"
                      value={password}
                      onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined, form: undefined })); }}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? 'demo-login-password-error' : undefined}
                      data-testid="login-password"
                    />
                    <button
                      className="login-visibility"
                      type="button"
                      onClick={() => setPasswordVisible((visible) => !visible)}
                      aria-label={passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      aria-pressed={passwordVisible}
                      data-testid="toggle-password-visibility"
                    >
                      {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="login-error" id="demo-login-password-error" role="alert" data-testid="password-error">{errors.password}</p>}
                </div>
              </div>

              {errors.form && <p className="login-form-error" role="alert" data-testid="login-error"><AlertCircle size={14} />{errors.form}</p>}
              <button className="login-submit" type="submit" disabled={!profiles.length || !accounts.length} data-testid="login-submit">
                Ouvrir mon espace démo <ArrowRight size={15} />
              </button>
            </form>

            <div className="login-disclaimer" role="note">
              <LockKeyhole size={14} />
              <span><strong>Démonstration uniquement.</strong> Les comptes et mots de passe affichés sont fictifs. Aucun service d’authentification ni donnée réelle n’est utilisé.</span>
            </div>
          </section>
        </div>

        <footer className="login-footer">
          <span><strong>EduCore Demo</strong> · Environnement de présentation</span>
          <span>Écoles · Groupes · Universités</span>
        </footer>
      </div>
    </main>
  );
}
