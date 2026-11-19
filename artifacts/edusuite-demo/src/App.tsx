'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Activity, Archive, ArrowDownRight, ArrowUpRight, Banknote, BookOpen, Bus,
  CalendarDays, Check, ChevronRight, CircleHelp, Clock3, Cloud, Coins, CreditCard,
  Download, FileBarChart2, FileText, GraduationCap, House, Languages, Library,
  LockKeyhole, LogOut, Menu, MessageCircle, Package, Plus, Search, Send,
  ShieldCheck, Sparkles, Stethoscope, Users, Utensils, Wallet, WifiOff,
  BriefcaseBusiness, Bell, Settings2, Building2, UserRound, ChartNoAxesCombined,
  CalendarCheck, ShieldAlert, CircleDollarSign, type LucideIcon,
} from 'lucide-react';
import DemoLogin, { type DemoAccount, type InstitutionProfile } from './components/DemoLogin';
import { demoAccounts, demoProfiles } from './demo-config';

type EduType = 'Maternelle' | 'Primaire' | 'Collège' | 'Lycée' | 'Université' | 'Multi-cycles';
type ViewKey = 'overview' | 'learners' | 'attendance' | 'academics' | 'finance' | 'hr' | 'family' | 'learnerPortal' | 'services' | 'assistant' | 'settings' | 'saas' | 'saasOwner';
type Learner = { id: number; name: string; grade: string; guardian: string; attendanceState: 'Présent' | 'Absent' | 'En retard'; academicSummary: string; feeStatus: 'À jour' | 'En attente' | 'Impayé' };
type School = { id: string; name: string; educationType: EduType; country: string; currency: string; schoolYear: string; enabledModules: string[] };
type SyncOperation = { id: number; type: string; createdAt: string; status: string };
type DemoSession = { account: DemoAccount; profile: InstitutionProfile };

const schools: School[] = [
  { id: 'arc', name: 'École Les Arcades', educationType: 'Primaire', country: 'Sénégal', currency: 'XOF', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Discipline', 'Activités', 'Équipement', 'Visiteurs', 'Événements'] },
  { id: 'petit', name: 'Les Petits Explorateurs', educationType: 'Maternelle', country: 'Côte d’Ivoire', currency: 'XOF', schoolYear: '2026–2027', enabledModules: ['Cantine', 'Santé', 'Activités', 'Visiteurs', 'Événements'] },
  { id: 'college', name: 'Collège Horizon', educationType: 'Collège', country: 'France', currency: 'EUR', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Discipline', 'Activités', 'Équipement', 'Visiteurs', 'Événements'] },
  { id: 'lycee', name: 'Lycée Horizon', educationType: 'Lycée', country: 'France', currency: 'EUR', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Discipline', 'Internat', 'Activités', 'Équipement', 'Visiteurs', 'Événements'] },
  { id: 'atlas', name: 'Université Atlas', educationType: 'Université', country: 'Maroc', currency: 'MAD', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Activités', 'Équipement', 'Visiteurs', 'Événements'] },
  { id: 'multi', name: 'Complexe scolaire Horizon', educationType: 'Multi-cycles', country: 'Sénégal', currency: 'XOF', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Discipline', 'Internat', 'Activités', 'Équipement', 'Visiteurs', 'Événements'] },
];

const initialLearners: Learner[] = [
  { id: 101, name: 'Aïssatou Ndiaye', grade: 'CM2 · A', guardian: 'M. & Mme Ndiaye', attendanceState: 'Présent', academicSummary: 'Très bien', feeStatus: 'À jour' },
  { id: 102, name: 'Moussa Diop', grade: 'CM1 · B', guardian: 'Mme Diop', attendanceState: 'Présent', academicSummary: 'Bien', feeStatus: 'En attente' },
  { id: 103, name: 'Inès Fall', grade: 'CE2 · A', guardian: 'M. Fall', attendanceState: 'Absent', academicSummary: 'Très bien', feeStatus: 'À jour' },
  { id: 104, name: 'Amadou Sarr', grade: 'CM2 · A', guardian: 'Mme Sarr', attendanceState: 'En retard', academicSummary: 'À accompagner', feeStatus: 'Impayé' },
  { id: 105, name: 'Léa Diouf', grade: 'CE1 · B', guardian: 'M. & Mme Diouf', attendanceState: 'Présent', academicSummary: 'Bien', feeStatus: 'À jour' },
  { id: 106, name: 'Yacine Ba', grade: 'CP · A', guardian: 'Mme Ba', attendanceState: 'Présent', academicSummary: 'En progrès', feeStatus: 'À jour' },
];
const initialLearnersBySchool: Record<string, Learner[]> = {
  arc: initialLearners,
  petit: [
    { id: 201, name: 'Lila Koné', grade: 'Petite section · A', guardian: 'Mme Koné', attendanceState: 'Présent', academicSummary: 'En progrès', feeStatus: 'À jour' },
    { id: 202, name: 'Éden Traoré', grade: 'Moyenne section · B', guardian: 'M. Traoré', attendanceState: 'Présent', academicSummary: 'Acquis', feeStatus: 'En attente' },
    { id: 203, name: 'Maya Coulibaly', grade: 'Grande section · A', guardian: 'Mme Coulibaly', attendanceState: 'En retard', academicSummary: 'À accompagner', feeStatus: 'À jour' },
  ],
  college: [
    { id: 301, name: 'Noa Martin', grade: '5e · A', guardian: 'Mme Martin', attendanceState: 'Présent', academicSummary: 'Bien', feeStatus: 'À jour' },
    { id: 302, name: 'Inès Bernard', grade: '4e · B', guardian: 'M. Bernard', attendanceState: 'Absent', academicSummary: 'Très bien', feeStatus: 'En attente' },
    { id: 303, name: 'Adam Laurent', grade: '3e · A', guardian: 'Mme Laurent', attendanceState: 'Présent', academicSummary: 'En progrès', feeStatus: 'À jour' },
  ],
  lycee: [
    { id: 401, name: 'Hana Diallo', grade: 'Terminale · A', guardian: 'M. Diallo', attendanceState: 'Présent', academicSummary: 'Très bien', feeStatus: 'À jour' },
    { id: 402, name: 'Louis Morel', grade: 'Première · B', guardian: 'Mme Morel', attendanceState: 'En retard', academicSummary: 'Bien', feeStatus: 'En attente' },
    { id: 403, name: 'Amel Benali', grade: 'Seconde · A', guardian: 'M. Benali', attendanceState: 'Présent', academicSummary: 'À accompagner', feeStatus: 'À jour' },
  ],
  atlas: [
    { id: 501, name: 'Salma El Idrissi', grade: 'Licence 3 · Droit', guardian: 'Contact étudiant', attendanceState: 'Présent', academicSummary: 'Très bien', feeStatus: 'À jour' },
    { id: 502, name: 'Mehdi Amrani', grade: 'Master 1 · Économie', guardian: 'Contact étudiant', attendanceState: 'Présent', academicSummary: 'Bien', feeStatus: 'En attente' },
    { id: 503, name: 'Yasmin Benali', grade: 'Licence 1 · Sciences', guardian: 'Contact étudiant', attendanceState: 'Absent', academicSummary: 'En progrès', feeStatus: 'À jour' },
  ],
  multi: [
    { id: 601, name: 'Lila Koné', grade: 'Grande section · A', guardian: 'Mme Koné', attendanceState: 'Présent', academicSummary: 'En progrès', feeStatus: 'À jour' },
    { id: 602, name: 'Moussa Diop', grade: 'CM2 · B', guardian: 'Mme Diop', attendanceState: 'Présent', academicSummary: 'Bien', feeStatus: 'À jour' },
    { id: 603, name: 'Inès Fall', grade: '4e · A', guardian: 'M. Fall', attendanceState: 'Absent', academicSummary: 'Très bien', feeStatus: 'En attente' },
    { id: 604, name: 'Amadou Sarr', grade: 'Terminale · C', guardian: 'Mme Sarr', attendanceState: 'En retard', academicSummary: 'À accompagner', feeStatus: 'À jour' },
  ],
};
const staff = [
  { name: 'Mariama Sène', role: 'Directrice', dept: 'Direction', presence: 'Présente' },
  { name: 'Ibrahima Kane', role: 'Enseignant', dept: 'Cycle 3', presence: 'Présent' },
  { name: 'Fatou Cissé', role: 'Enseignante', dept: 'Cycle 2', presence: 'En congé' },
  { name: 'Ousmane Diallo', role: 'Gestionnaire', dept: 'Administration', presence: 'Présent' },
];
const modules: { name: string; icon: LucideIcon; desc: string }[] = [
  { name: 'Transport', icon: Bus, desc: 'Circuits, véhicules et suivi des trajets' },
  { name: 'Cantine', icon: Utensils, desc: 'Menus, repas et régimes alimentaires' },
  { name: 'Bibliothèque', icon: Library, desc: 'Prêts, retours et fonds documentaire' },
  { name: 'Santé', icon: Stethoscope, desc: 'Infirmerie et informations de santé' },
  { name: 'Discipline', icon: ShieldAlert, desc: 'Suivi éducatif et accompagnement' },
  { name: 'Internat', icon: House, desc: 'Résidences et vie en internat' },
  { name: 'Activités', icon: Activity, desc: 'Clubs, sorties et activités scolaires' },
  { name: 'Équipement', icon: Package, desc: 'Inventaire du matériel pédagogique' },
  { name: 'Visiteurs', icon: ShieldCheck, desc: 'Registre des visites de démonstration' },
  { name: 'Événements', icon: CalendarDays, desc: 'Calendrier des temps forts' },
];
const navIcons: Record<string, LucideIcon> = {
  overview: ChartNoAxesCombined, learners: Users, attendance: CalendarCheck, academics: BookOpen,
  finance: Wallet, hr: BriefcaseBusiness, family: UserRound, learnerPortal: GraduationCap,
  services: House, assistant: Sparkles, settings: Settings2, saas: Building2, saasOwner: Building2,
};
const navLabels: Record<ViewKey, string> = {
  overview: 'Vue d’ensemble', learners: 'Élèves & dossiers', attendance: 'Présences', academics: 'Pédagogie & résultats',
  finance: 'Finances', hr: 'Ressources humaines', family: 'Espace familles', learnerPortal: 'Espace apprenant',
  services: 'Services scolaires', assistant: 'Assistant Édu', settings: 'Cadre international', saas: 'Centre de pilotage',
  saasOwner: 'Espace propriétaire',
};

function App() {
  const [view, setView] = useState<ViewKey>('overview');
  const [schoolId, setSchoolId] = useState('arc');
  const [groupMode, setGroupMode] = useState(false);
  const [role, setRole] = useState('Direction');
  const [session, setSession] = useState<DemoSession | null>(null);
  const [activeThemeId, setActiveThemeId] = useState('primaire');
  const [learnersBySchool, setLearnersBySchool] = useState<Record<string, Learner[]>>(initialLearnersBySchool);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [offline, setOffline] = useState(false);
  const [syncs, setSyncs] = useState<SyncOperation[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState({ digest: true, minorProtection: true, audit: true });
  const [language, setLanguage] = useState('Français');
  const [currency, setCurrency] = useState(schools[0].currency);
  const [assistantText, setAssistantText] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const school = schools.find((item) => item.id === schoolId) ?? schools[0];
  const learners = learnersBySchool[schoolId] ?? [];
  const isPortal = role === 'Parent' || role === 'Apprenant';
  const learnersForSchool = useMemo(() => learners.map((learner, index) => ({
    ...learner,
    grade: learner.id > 106 ? learner.grade : gradeForType(school.educationType, index),
  })), [learners, school.educationType]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('edusuite-demo-state');
      if (!saved) return;
      const state = JSON.parse(saved);
      if (state.learnersBySchool && typeof state.learnersBySchool === 'object') setLearnersBySchool(state.learnersBySchool);
      else if (Array.isArray(state.learners)) setLearnersBySchool((current) => ({ ...current, [state.schoolId ?? 'arc']: state.learners }));
      if (Array.isArray(state.syncs)) setSyncs(state.syncs);
      if (typeof state.schoolId === 'string' && schools.some((item) => item.id === state.schoolId)) setSchoolId(state.schoolId);
      if (typeof state.groupMode === 'boolean') setGroupMode(state.groupMode);
      if (typeof state.offline === 'boolean') setOffline(state.offline);
    } catch { /* A fresh demo session is used when saved browser data is unreadable. */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('edusuite-demo-state', JSON.stringify({ learnersBySchool, syncs, schoolId, groupMode, offline })); } catch { /* Local storage is optional. */ }
  }, [learnersBySchool, syncs, schoolId, groupMode, offline]);

  const addSync = (type: string) => {
    setSyncs((items) => [{ id: Date.now(), type, createdAt: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date()), status: offline ? 'En attente' : 'Démontré' }, ...items]);
  };
  const setAttendance = (id: number) => {
    setLearnersBySchool((current) => ({
      ...current,
      [schoolId]: (current[schoolId] ?? []).map((item) => item.id === id ? { ...item, attendanceState: item.attendanceState === 'Présent' ? 'Absent' : 'Présent' } : item),
    }));
    addSync('Mise à jour de présence');
  };
  const saveLearner = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newName.trim() || !newGrade.trim()) return;
    const learner: Learner = { id: Date.now(), name: newName.trim(), grade: newGrade.trim(), guardian: 'Famille à renseigner', attendanceState: 'Présent', academicSummary: 'Nouveau dossier', feeStatus: 'À jour' };
    setLearnersBySchool((current) => ({ ...current, [schoolId]: [learner, ...(current[schoolId] ?? [])] }));
    addSync('Création d’un dossier élève');
    setNewName(''); setNewGrade(''); setModalOpen(false); setView('learners');
  };
  const filteredLearners = useMemo(() => learnersForSchool.filter((item) => `${item.name} ${item.grade} ${item.guardian}`.toLowerCase().includes(query.toLowerCase())), [learnersForSchool, query]);
  const visibleNav = useMemo<ViewKey[]>(() => {
    if (role === 'Administrateur SaaS') return ['saas'];
    if (role === 'Propriétaire du SaaS') return ['saasOwner'];
    if (role === 'Parent') return ['family'] as ViewKey[];
    if (role === 'Apprenant') return ['learnerPortal', 'academics', 'services'] as ViewKey[];
    const base: ViewKey[] = ['overview', 'learners', 'attendance', 'academics', 'finance', 'hr', 'family', 'learnerPortal', 'services', 'assistant', 'settings'];
    if (role === 'Enseignant') return ['overview', 'learners', 'attendance', 'academics', 'services', 'assistant'];
    if (role === 'Gestionnaire') return ['overview', 'learners', 'attendance', 'finance', 'hr', 'services', 'settings'];
    return base;
  }, [role]);
  const relevantModules = modules.filter((module) => school.enabledModules.includes(module.name) && (module.name !== 'Internat' || school.educationType === 'Collège' || school.educationType === 'Lycée' || school.educationType === 'Université' || school.educationType === 'Multi-cycles'));
  const changeView = (next: ViewKey) => { setView(next); setMobileOpen(false); setQuery(''); };
  const handleLogin = (account: DemoAccount, profile: InstitutionProfile) => {
    const schoolForProfile: Record<string, string> = {
      maternelle: 'petit',
      primaire: 'arc',
      college: 'college',
      lycee: 'lycee',
      universite: 'atlas',
      'groupe-multi-etablissements': 'arc',
      'multi-cycles': 'multi',
    };
    const nextSchoolId = schoolForProfile[profile.id] ?? 'arc';
    const nextSchool = schools.find((item) => item.id === nextSchoolId) ?? schools[0];
    setSession({ account, profile });
    setRole(account.role);
    setSchoolId(nextSchool.id);
    setCurrency(nextSchool.currency);
    setActiveThemeId(profile.id);
    setGroupMode(profile.id === 'groupe-multi-etablissements' || account.role === 'Direction de groupe' || account.role === 'Administrateur SaaS' || account.role === 'Propriétaire du SaaS');
    setView(account.role === 'Administrateur SaaS' ? 'saas' : account.role === 'Propriétaire du SaaS' ? 'saasOwner' : account.role === 'Parent' ? 'family' : account.role === 'Apprenant' ? 'learnerPortal' : 'overview');
  };
  const logout = () => {
    setSession(null);
    setRole('Direction');
    setView('overview');
    setSchoolId('arc');
    setCurrency(schools[0].currency);
    setGroupMode(false);
    setActiveThemeId('primaire');
  };
  const selectSchool = (id: string) => {
    const nextSchool = schools.find((item) => item.id === id);
    if (!nextSchool) return;
    setSchoolId(id);
    setCurrency(nextSchool.currency);
    setActiveThemeId(themeForEducationType(nextSchool.educationType));
    addSync('Changement d’environnement');
  };

  if (!session) return <DemoLogin profiles={demoProfiles} accounts={demoAccounts} onLogin={handleLogin} />;

  return (
    <div className="app" data-edu-theme={activeThemeId}>
      <div className="shell">
        <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
          <div className="brand">
            <div className="brand-mark"><GraduationCap size={19} /></div>
            <div className="brand-name">édu<span>suite</span></div>
            <span className="demo-chip">Démo</span>
          </div>
          <div className="school-switch">
            <label>{groupMode ? 'Groupe scolaire · environnement' : 'Établissement'}</label>
            <select className="school-select" value={schoolId} onChange={(e) => selectSchool(e.target.value)} data-testid="select-institution">
              {schools.filter((item) => groupMode || role === 'Administrateur SaaS' || role === 'Propriétaire du SaaS' || item.id === school.id).map((item) => <option key={item.id} value={item.id}>{item.educationType} · {item.name}</option>)}
            </select>
          </div>
          <div className="nav-label">Espace établissement</div>
          <nav className="nav-list">
            {visibleNav.filter((item) => item !== 'saas').map((item) => {
              const Icon = navIcons[item];
              return <button key={item} className={`nav-item ${view === item ? 'active' : ''}`} onClick={() => changeView(item)} data-testid={`nav-${item}`}><Icon className="nav-icon" />{navLabels[item]}</button>;
            })}
          </nav>
          {role === 'Administrateur SaaS' && <>
            <div className="nav-separator" />
            <div className="nav-label">Administration plateforme</div>
            <button className={`nav-item ${view === 'saas' ? 'active' : ''}`} onClick={() => changeView('saas')} data-testid="nav-saas"><Building2 className="nav-icon" />Centre de pilotage SaaS</button>
          </>}
          <div className="sidebar-foot">
            <div className="demo-note">Données fictives · environnement de présentation<br />Aucune donnée scolaire réelle n’est enregistrée.</div>
            <div className="user-chip"><div className="avatar">{session.account.initials}</div><div className="user-identity"><div className="user-name">{session.account.name}</div><div className="user-role">{session.account.role} · espace démo</div><div className="user-email">{session.account.email}</div></div></div>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="icon-button mobile-menu" aria-label="Ouvrir le menu" onClick={() => setMobileOpen((open) => !open)}><Menu size={16} /></button>
              <div className="crumb"><span>Établissement</span><ChevronRight size={12} /><strong>{navLabels[view]}</strong></div>
            </div>
            <div className="top-actions">
              <span className="top-role-pill" data-testid="current-user-role">{session.account.role} · démo</span>
              <button className="icon-button" aria-label={offline ? 'Repasser en mode connecté de démonstration' : 'Démontrer le mode hors ligne'} title={offline ? 'Mode hors ligne activé' : 'Connecté (simulation)'} onClick={() => { const nextOffline = !offline; setOffline(nextOffline); setSyncs((items) => [{ id: Date.now(), type: nextOffline ? 'Passage en mode hors ligne' : 'Reconnexion simulée', createdAt: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date()), status: nextOffline ? 'En attente' : 'Démontré' }, ...items]); }} data-testid="toggle-offline"><Cloud size={15} />{offline && <span className="online-dot" style={{ background: '#d89c3f' }} />}</button>
              <button className="icon-button" aria-label="Notifications de démonstration" onClick={() => changeView('overview')}><Bell size={15} /><span className="online-dot" /></button>
              <button className="logout-button top-logout" onClick={logout} data-testid="button-logout"><LogOut size={14} /><span>Quitter</span></button>
            </div>
          </header>
          <div className="content fade-in" key={view}>
            <PageHeader view={view} school={school} onAdd={() => setModalOpen(true)} onSync={() => { setSyncs((items) => items.map((item) => ({ ...item, status: 'Démontré' }))); setOffline(false); }} pending={syncs.filter((item) => item.status === 'En attente').length} />
            <div className="demo-banner"><Sparkles size={14} /><span><strong>Mode démonstration.</strong> Les informations affichées sont fictives et servent à explorer les parcours. Les changements restent dans ce navigateur.</span></div>
            {offline && <div className="sync-bar"><WifiOff size={15} /><span><strong>Mode hors ligne simulé.</strong> Les changements sont gardés dans cette session et apparaissent dans la file locale.</span><button className="text-link" onClick={() => setView('settings')}>Voir le cadre</button></div>}
            {isPortal && <div className="role-note">Aperçu limité au profil <strong>{role.toLowerCase()}</strong> — les autres espaces ne sont pas accessibles dans cette expérience.</div>}
            {view === 'overview' && <Overview school={school} learners={learnersForSchool} syncs={syncs} onNavigate={changeView} />}
            {view === 'learners' && <LearnerView learners={filteredLearners} query={query} setQuery={setQuery} onAdd={() => setModalOpen(true)} />}
            {view === 'attendance' && <AttendanceView learners={learnersForSchool} onToggle={setAttendance} />}
            {view === 'academics' && <AcademicsView school={school} learners={learnersForSchool} />}
            {view === 'finance' && <FinanceView school={{ ...school, currency }} learners={learnersForSchool} onAction={addSync} />}
            {view === 'hr' && <HrView onAction={addSync} />}
            {view === 'family' && <FamilyView />}
            {view === 'learnerPortal' && <LearnerPortal school={school} />}
            {view === 'services' && <ServicesView modules={relevantModules} onAction={addSync} />}
            {view === 'assistant' && <AssistantView name={session.account.name.split(' ')[0]} value={assistantText} setValue={setAssistantText} reply={assistantReply} onAsk={() => { setAssistantReply(makeAssistantReply(assistantText, school)); addSync('Question à l’assistant démo'); }} />}
            {view === 'settings' && <SettingsView school={school} groupMode={groupMode} setGroupMode={setGroupMode} language={language} setLanguage={setLanguage} currency={currency} setCurrency={setCurrency} settings={settings} setSettings={setSettings} syncs={syncs} onSync={addSync} />}
            {(view === 'saas' || view === 'saasOwner') && <SaasView schools={schools} current={school} groupMode={groupMode} setGroupMode={setGroupMode} ownerMode={view === 'saasOwner'} onSelect={(id) => { selectSchool(id); addSync('Environnement groupe sélectionné'); }} />}
          </div>
        </main>
      </div>
      {mobileOpen && <button className="modal-backdrop" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} style={{ zIndex: 8, background: 'transparent', border: 0 }} />}
      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <form className="modal" onSubmit={saveLearner}>
          <h2>Ajouter un dossier démo</h2><p>Créez un profil fictif dans l’environnement {school.name}. Aucune donnée réelle n’est sollicitée.</p>
          <div className="field"><label htmlFor="learner-name">Nom de l’élève</label><input id="learner-name" autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex. Salma Diallo" required /></div>
          <div className="field"><label htmlFor="learner-grade">Classe / niveau</label><input id="learner-grade" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder={school.educationType === 'Université' ? 'Licence 1 · Économie' : 'CM2 · A'} required /></div>
          <div className="modal-actions"><button type="button" className="button secondary" onClick={() => setModalOpen(false)}>Annuler</button><button type="submit" className="button"><Plus size={14} />Créer le dossier</button></div>
        </form>
      </div>}
    </div>
  );
}

function gradeForType(type: EduType, index: number) {
  const nursery = ['Petite section · A', 'Moyenne section · B', 'Grande section · A'];
  const primary = ['CM2 · A', 'CM1 · B', 'CE2 · A', 'CM2 · A', 'CE1 · B', 'CP · A'];
  const college = ['5e · A', '4e · B', '3e · A', '6e · B'];
  const lycee = ['Terminale · A', 'Première · B', 'Seconde · A', 'Terminale · B'];
  const university = ['Licence 3 · Droit', 'Licence 2 · Lettres', 'Licence 1 · Sciences', 'Master 1 · Éducation', 'Licence 2 · Économie', 'Licence 1 · Gestion'];
  const list = type === 'Maternelle' ? nursery : type === 'Collège' ? college : type === 'Lycée' ? lycee : type === 'Université' ? university : primary;
  return list[index % list.length];
}

function PageHeader({ view, school, onAdd, pending, onSync }: { view: ViewKey; school: School; onAdd: () => void; pending: number; onSync: () => void }) {
  const descriptions: Record<ViewKey, string> = {
    overview: 'Une vue claire des opérations de votre établissement.', learners: 'Retrouvez les profils et les informations scolaires essentielles.',
    attendance: 'Suivez les présences de la journée et les actions en attente.', academics: 'Parcours pédagogiques, évaluations et résultats.',
    finance: 'Suivi de démonstration des frais et encaissements scolaires.', hr: 'Présence des équipes et repères de gestion du personnel.',
    family: 'Une fenêtre sur les échanges entre l’école et les familles.', learnerPortal: 'Le quotidien scolaire vu depuis l’espace apprenant.',
    services: 'Les services qui accompagnent la vie de l’établissement.', assistant: 'Une aide contextualisée pour les tâches d’enseignement et de gestion.',
    settings: 'Des repères configurables pour des établissements internationaux.', saas: 'Vue de démonstration multi-établissements et pilotage de groupe.',
  };
  return <div className="page-head"><div><div className="eyebrow">{school.educationType} · {school.country} · année {school.schoolYear}</div><h1>{navLabels[view]}</h1><p className="subhead">{descriptions[view]}</p></div>
    <div className="toolbar">{pending > 0 && <button className="button secondary small" onClick={onSync}><Cloud size={13} />{pending} en attente · simuler sync</button>}
      {view === 'learners' && <button className="button" onClick={onAdd}><Plus size={14} />Ajouter un élève</button>}
      {view === 'overview' && <span className="status good">Environnement de démo</span>}
    </div>
  </div>;
}

function Overview({ school, learners, syncs, onNavigate }: { school: School; learners: Learner[]; syncs: SyncOperation[]; onNavigate: (view: ViewKey) => void }) {
  const present = learners.filter((learner) => learner.attendanceState === 'Présent').length;
  return <>
    <div className="metrics">
      <Metric icon={Users} label={school.educationType === 'Université' ? 'Étudiants inscrits' : 'Élèves inscrits'} value={school.educationType === 'Université' ? '2 480' : school.educationType === 'Maternelle' ? '186' : school.educationType === 'Lycée' ? '1 246' : school.educationType === 'Collège' ? '842' : '684'} change="+ 12 dossiers ce mois-ci" />
      <Metric icon={CalendarCheck} label="Présence aujourd’hui" value={`${Math.round(present / Math.max(learners.length, 1) * 100)}%`} change={`${present} présents sur ${learners.length} profils affichés`} />
      <Metric icon={CircleDollarSign} label="Frais à régulariser" value={`${school.currency === 'EUR' ? '€' : school.currency === 'MAD' ? 'د.م.' : ''}${school.currency === 'XOF' ? '1,24 M' : '8 450'}`} change="Aperçu fictif · période en cours" />
      <Metric icon={BriefcaseBusiness} label="Équipe présente" value="34 / 38" change="89% de l’effectif aujourd’hui" />
    </div>
    <div className="grid-main">
      <section className="panel">
        <div className="panel-head"><div><h2 className="panel-title">Activité de l’établissement</h2><div className="panel-caption">Présences hebdomadaires · données de démonstration</div></div><button className="text-link" onClick={() => onNavigate('attendance')}>Voir le registre <ChevronRight size={12} /></button></div>
        <div className="chart" aria-label="Graphique fictif des présences sur la semaine">{[72, 84, 77, 91, 82, 88, 68].map((height, index) => <div className="bar-group" key={index}><div className={`bar ${index === 4 ? 'current' : ''}`} style={{ height: `${height}%` }} /><span className="bar-label">{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Lun', 'Mar'][index]}</span></div>)}</div>
        <div className="chart-legend"><span><i className="legend-dot dark" />Cette semaine</span><span><i className="legend-dot" />Semaine précédente</span></div>
      </section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Repères de présence</h2><div className="panel-caption">Aujourd’hui · profils échantillon</div></div><button className="text-link" onClick={() => onNavigate('attendance')}>Détails</button></div>
        <div className="attendance-ring"><div className="ring-value">82%<small>présents</small></div></div><div className="ring-keys"><span><i className="legend-dot dark" />Présents</span><span><i className="legend-dot" style={{ background: '#e8b55e' }} />À suivre</span></div>
      </section>
    </div>
    <div className="grid-main wide-panel">
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Dossiers récemment consultés</h2><div className="panel-caption">Un échantillon représentatif · données fictives</div></div><button className="text-link" onClick={() => onNavigate('learners')}>Tous les élèves <ChevronRight size={12} /></button></div><LearnerTable learners={learners.slice(0, 4)} compact /></section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Fil de démonstration</h2><div className="panel-caption">Activité conservée dans ce navigateur</div></div><Clock3 size={15} color="#788983" /></div>
        {syncs.length ? <div className="activity-list">{syncs.slice(0, 4).map((item) => <div className="activity" key={item.id}><div className="activity-symbol"><Cloud size={14} /></div><div className="activity-copy"><strong>{item.type}</strong><span>{item.status === 'En attente' ? 'À synchroniser plus tard · simulation' : 'Action locale de démonstration'}</span></div><span className="activity-time">{item.createdAt}</span></div>)}</div> : <div className="empty-state"><strong>Le fil est prêt à explorer</strong>Les changements de démonstration apparaîtront ici.</div>}
      </section>
    </div>
  </>;
}

function Metric({ icon: Icon, label, value, change }: { icon: LucideIcon; label: string; value: string; change: string }) {
  return <div className="metric"><div className="metric-top"><span>{label}</span><Icon className="metric-icon" size={16} /></div><div className="metric-value">{value}</div><div className="metric-change">{change}</div></div>;
}

function LearnerTable({ learners, compact = false }: { learners: Learner[]; compact?: boolean }) {
  if (!learners.length) return <div className="empty-state"><strong>Aucun profil correspondant</strong>Essayez une autre recherche ou ajoutez un dossier démo.</div>;
  return <div className="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th>{!compact && <th>Responsable</th>}<th>Présence</th><th>Situation</th></tr></thead><tbody>{learners.map((learner) => <tr key={learner.id} data-testid={`row-learner-${learner.id}`}><td><div className="student-cell"><div className="avatar">{learner.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><strong>{learner.name}</strong><small>Dossier démo · #{learner.id}</small></div></div></td><td>{learner.grade}</td>{!compact && <td>{learner.guardian}</td>}<td><StatusBadge value={learner.attendanceState} /></td><td><StatusBadge value={learner.feeStatus} /></td></tr>)}</tbody></table></div>;
}
function StatusBadge({ value }: { value: string }) {
  const kind = value === 'Présent' || value === 'Présente' || value === 'À jour' || value === 'Très bien' || value === 'Démontré' ? 'good' : value === 'Absent' || value === 'Impayé' ? 'bad' : 'warn';
  return <span className={`status ${kind}`}>{value}</span>;
}

function LearnerView({ learners, query, setQuery, onAdd }: { learners: Learner[]; query: string; setQuery: (value: string) => void; onAdd: () => void }) {
  return <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Répertoire des élèves</h2><div className="panel-caption">{learners.length} profil(s) dans cet aperçu</div></div><div className="toolbar"><div className="search"><Search size={14} /><input aria-label="Rechercher un élève" placeholder="Nom, classe, responsable…" value={query} onChange={(event) => setQuery(event.target.value)} data-testid="input-search-learners" /></div><button className="button" onClick={onAdd}><Plus size={14} />Ajouter</button></div></div><LearnerTable learners={learners} /></section>;
}

function AttendanceView({ learners, onToggle }: { learners: Learner[]; onToggle: (id: number) => void }) {
  return <><div className="metrics"><Metric icon={Check} label="Présents" value={`${learners.filter((l) => l.attendanceState === 'Présent').length}`} change="Pointage saisi dans la démo" /><Metric icon={Clock3} label="Retards" value={`${learners.filter((l) => l.attendanceState === 'En retard').length}`} change="À vérifier avec l’équipe" /><Metric icon={UserRound} label="Absences" value={`${learners.filter((l) => l.attendanceState === 'Absent').length}`} change="Suivi de la journée" /><Metric icon={WifiOff} label="File locale" value="Disponible" change="Mode hors ligne simulable" /></div>
     <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Registre des présences · aujourd’hui</h2><div className="panel-caption">Touchez le statut pour le faire évoluer dans la session de démonstration.</div></div><span className="status good">Aujourd’hui · 08:15</span></div><div className="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th><th>Responsable</th><th>Pointage</th><th>Action rapide</th></tr></thead><tbody>{learners.map((learner) => <tr key={learner.id}><td><div className="student-cell"><div className="avatar">{learner.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><strong>{learner.name}</strong></div></td><td>{learner.grade}</td><td>{learner.guardian}</td><td><StatusBadge value={learner.attendanceState} /></td><td><button className={`state-toggle ${learner.attendanceState === 'Présent' ? 'on' : ''}`} onClick={() => onToggle(learner.id)} data-testid={`toggle-attendance-${learner.id}`}>{learner.attendanceState === 'Présent' ? 'Marquer absent' : 'Marquer présent'}</button></td></tr>)}</tbody></table></div></section>
    <div className="role-note" style={{ marginTop: 14 }}><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Démonstration de parcours hors ligne uniquement. Aucune synchronisation réseau ni garantie de sécurité réelle n’est configurée.</div>
  </>;
}

function AcademicsView({ school, learners }: { school: School; learners: Learner[] }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const university = school.educationType === 'Université';
  const nursery = school.educationType === 'Maternelle';
  const programs: [string, string][] = university
    ? [['Licence · Sciences humaines', 'L1 · 4 unités d’enseignement'], ['Licence · Économie', 'L2 · 6 unités d’enseignement'], ['Master · Éducation', 'M1 · 3 séminaires']]
    : nursery
      ? [['Découvrir le monde', 'Explorer, observer, questionner'], ['Langage & expression', 'Écouter, raconter, échanger'], ['Motricité & créativité', 'Bouger, créer, coopérer']]
      : school.educationType === 'Collège'
        ? [['Cycle 3 · Consolidation', '6e · Français, mathématiques, sciences'], ['Cycle 4 · Approfondissements', '5e · 4e · 3e'], ['Parcours d’orientation', 'Découverte des métiers et projets']]
        : school.educationType === 'Lycée'
          ? [['Seconde · Tronc commun', 'Exploration et choix des enseignements'], ['Première · Spécialités', 'Parcours et évaluations continues'], ['Terminale · Préparation', 'Examens et orientation post-bac']]
          : [['Cycle 2 · Apprentissages fondamentaux', 'CP · CE1 · CE2'], ['Cycle 3 · Consolidation', 'CM1 · CM2'], ['Langues & ouverture', 'Français · Anglais · projets']];
  return <><div className="two-col">
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">{university ? 'Programmes & unités' : nursery ? 'Parcours d’éveil' : 'Parcours pédagogiques'}</h2><div className="panel-caption">Progression annuelle · exemple de programme</div></div><BookOpen size={16} color="#34745e" /></div>
      {programs.map(([title, detail], index) => <div className="list-row" key={title}><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div className="activity-symbol">{index + 1}</div><div><strong>{title}</strong><small>{detail}</small></div></div><ChevronRight size={14} color="#93a09a" /></div>)}
      {university && <div className="university-extra"><div className="list-row"><div><strong>Inscriptions pédagogiques</strong><small>Choix des unités · crédits ECTS</small></div><span className="status good">30 crédits</span></div><div className="list-row"><div><strong>Stages & mémoires</strong><small>Suivi des étapes et des encadrants</small></div><span className="status warn">2 suivis</span></div><div className="list-row"><div><strong>Parcours & diplômes</strong><small>Historique académique de démonstration</small></div><FileText size={14} color="#34745e" /></div></div>}
    </section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">{nursery ? 'Observations de parcours' : 'Résultats & évaluations'}</h2><div className="panel-caption">Synthèse fictive · aperçu des élèves</div></div><FileBarChart2 size={16} color="#34745e" /></div>
      {learners.slice(0, 4).map((learner, index) => <div className="list-row" key={learner.id}><div className="student-cell"><div className="avatar">{learner.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</div><div><strong>{learner.name}</strong><small>{learner.grade}</small></div></div><StatusBadge value={nursery ? ['En progrès', 'Acquis', 'À accompagner', 'En progrès'][index] : learner.academicSummary} /></div>)}
    </section>
   </div><section className="panel wide-panel"><div className="panel-head"><div><h2 className="panel-title">Calendrier pédagogique</h2><div className="panel-caption">Jalons de l’année {school.schoolYear} · données de présentation</div></div><button className="button secondary small" onClick={() => setPreviewOpen((open) => !open)}><Download size={13} />Aperçu du bulletin</button></div><div className="two-col">{[['24 nov.', 'Évaluations de mi-trimestre'], ['04 déc.', 'Conseils de classe / échanges familles'], ['18 déc.', 'Fin du premier trimestre']].map(([date, label]) => <div className="list-row" key={date}><div><strong>{label}</strong><small>Calendrier de démonstration</small></div><span className="status warn">{date}</span></div>)}</div>{previewOpen && <div className="role-note" style={{ marginTop: 12 }}>Aperçu de bulletin fictif · les résultats sont des exemples et ne constituent pas un document scolaire.</div>}</section></>;
}

function FinanceView({ school, learners, onAction }: { school: School; learners: Learner[]; onAction: (type: string) => void }) {
  const amount = school.currency === 'EUR' ? '€ 8 450' : school.currency === 'MAD' ? 'د.م. 84 500' : '1 240 000 XOF';
  return <><div className="metrics"><Metric icon={Coins} label="Montant à recevoir" value={amount} change="Échéances fictives de la période" /><Metric icon={CreditCard} label="Encaissements simulés" value={school.currency === 'EUR' ? '€ 24 680' : '3 860 000'} change="Échantillon de données de démo" /><Metric icon={FileText} label="Factures ouvertes" value="18" change="Aucune transaction réelle" /><Metric icon={ArrowDownRight} label="Taux de suivi" value="76,4%" change="Indicateur illustratif" /></div>
     <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Suivi des frais scolaires</h2><div className="panel-caption">Montants et statuts fictifs · devise {school.currency}</div></div><button className="button secondary small" onClick={() => onAction('Export financier de démonstration')}><Download size={13} />Exporter l’aperçu</button></div><div className="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th><th>Échéance</th><th>Montant</th><th>Statut</th><th>Action</th></tr></thead><tbody>{learners.slice(0, 5).map((learner, index) => <tr key={learner.id}><td><div className="student-cell"><div className="avatar">{learner.name.slice(0, 1)}</div><strong>{learner.name}</strong></div></td><td>{learner.grade}</td><td>{['25 nov. 2026', '30 nov. 2026', '05 déc. 2026'][index % 3]}</td><td>{school.currency === 'EUR' ? '€ ' : ''}{(85000 + index * 12500).toLocaleString('fr-FR')} {school.currency !== 'EUR' ? school.currency : ''}</td><td><StatusBadge value={learner.feeStatus} /></td><td><button className="text-link" onClick={() => onAction('Rappel de paiement de démonstration')}><MessageCircle size={12} /> Rappel démo</button></td></tr>)}</tbody></table></div></section>
    <div className="role-note" style={{ marginTop: 14 }}><CircleHelp size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Aucun moyen de paiement réel n’est connecté. Les montants ne sont ni facturés ni encaissés.</div>
  </>;
}

function HrView({ onAction }: { onAction: (type: string) => void }) {
  return <><div className="metrics"><Metric icon={Users} label="Effectif présenté" value="38" change="Échantillon fictif" /><Metric icon={CalendarCheck} label="Présences équipe" value="34" change="Mise à jour du jour" /><Metric icon={Wallet} label="Paie à préparer" value="38 fiches" change="Simulation uniquement" /><Metric icon={FileBarChart2} label="Dossiers à relire" value="4" change="Aucune donnée RH réelle" /></div>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Équipe de l’établissement</h2><div className="panel-caption">Présence indicative · données fictives</div></div><button className="button secondary small" onClick={() => onAction('Export équipe de démonstration')}><Download size={13} />Exporter</button></div>{staff.map((member) => <div className="list-row" key={member.name}><div className="student-cell"><div className="avatar">{member.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</div><div><strong>{member.name}</strong><small>{member.role} · {member.dept}</small></div></div><StatusBadge value={member.presence} /></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Repères de paie</h2><div className="panel-caption">Cycle mensuel · parcours démonstratif</div></div><Banknote size={17} color="#34745e" /></div><div className="list-row"><div><strong>Éléments variables à valider</strong><small>Heures supplémentaires · exemple</small></div><span className="status warn">3 éléments</span></div><div className="list-row"><div><strong>Bulletins de paie</strong><small>Prévisualisation sans valeur légale</small></div><button className="text-link" onClick={() => onAction('Aperçu de bulletin de paie')}>Prévisualiser</button></div><div className="list-row"><div><strong>Exports de démonstration</strong><small>Aucun versement réel déclenché</small></div><button className="text-link" onClick={() => onAction('Export de paie de démonstration')}>Préparer</button></div></section></div>
  </>;
}

function FamilyView() {
  const [feedback, setFeedback] = useState('');
  const familyChildren = [
    { id: 'lina', name: 'Lina Ndiaye', grade: 'CM2 · A', school: 'École Les Arcades', attendance: 'Présente', currency: 'XOF' },
    { id: 'adam', name: 'Adam Ndiaye', grade: '5e · A', school: 'Collège Horizon', attendance: 'Présent', currency: 'EUR' },
    { id: 'noor', name: 'Noor Ndiaye', grade: 'Moyenne section · B', school: 'Les Petits Explorateurs', attendance: 'Présente', currency: 'XOF' },
  ];
  const [selectedChildId, setSelectedChildId] = useState(familyChildren[0].id);
  const child = familyChildren.find((item) => item.id === selectedChildId) ?? familyChildren[0];
  return <><div className="callout"><div><div className="eyebrow" style={{ color: '#e7ba6c' }}>Portail famille · profil démo</div><h2>Bonjour, famille Ndiaye.</h2><p>Un compte familial peut réunir plusieurs enfants, même lorsqu’ils fréquentent des établissements différents.</p></div><button className="button gold" onClick={() => setFeedback('Brouillon de message ouvert · aucun envoi réel dans cette démo.')}><MessageCircle size={14} />Écrire à l’établissement</button></div>
    <section className="panel family-switcher" aria-label="Enfants liés au compte familial"><div className="panel-head"><div><h2 className="panel-title">Un seul espace familial</h2><div className="panel-caption">Choisissez un profil fictif · trois établissements distincts</div></div><span className="status good">3 enfants</span></div><div className="family-child-list">{familyChildren.map((item) => <button key={item.id} className={`family-child ${selectedChildId === item.id ? 'selected' : ''}`} onClick={() => setSelectedChildId(item.id)}><span className="avatar">{item.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{item.name}</strong><small>{item.grade} · {item.school}</small></span></button>)}</div></section>
    <div className="two-col" style={{ marginTop: 14 }}><section className="panel"><div className="panel-head"><div><h2 className="panel-title">La semaine de {child.name.split(' ')[0]}</h2><div className="panel-caption">{child.grade} · {child.school} · données de démonstration</div></div><CalendarDays size={16} color="#34745e" /></div><div className="list-row"><div><strong>Présence aujourd’hui</strong><small>Statut partagé par l’établissement</small></div><StatusBadge value={child.attendance} /></div>{[['Aujourd’hui · 08:10', 'Arrivée enregistrée'], ['Aujourd’hui · 10:30', 'Atelier de classe'], ['Jeudi · 14:00', 'Activité scolaire'], ['Vendredi · 16:00', 'Fin des cours']].map(([time, detail]) => <div className="list-row" key={time}><div><strong>{detail}</strong><small>{time}</small></div><ChevronRight size={14} color="#94a19c" /></div>)}</section>
       <section className="panel"><div className="panel-head"><div><h2 className="panel-title">À retenir</h2><div className="panel-caption">Informations partagées par l’école</div></div><Bell size={16} color="#34745e" /></div><div className="list-row"><div><strong>Bulletin du trimestre</strong><small>Disponible en aperçu · 24 nov.</small></div><button className="text-link" onClick={() => setFeedback('Aperçu du bulletin fictif sélectionné.')}>Consulter</button></div><div className="list-row"><div><strong>Résultats & devoirs</strong><small>Notes et travail à faire · aperçu fictif</small></div><button className="text-link" onClick={() => setFeedback(`Résumé pédagogique fictif pour ${child.name} : résultats de période consultables, devoirs à venir et supports de révision.`)}>Voir le résumé</button></div><div className="list-row"><div><strong>Réunion parents–enseignants</strong><small>Choisissez un créneau de démonstration</small></div><button className="text-link" onClick={() => setFeedback('Créneaux de démonstration : jeudi 16:00 ou vendredi 08:30.')}>Voir les créneaux</button></div><div className="list-row"><div><strong>Facture de scolarité · aperçu</strong><small>Échéance · 30 novembre · {child.currency === 'EUR' ? '85 €' : `85 000 ${child.currency}`}</small></div><button className="text-link" onClick={() => setFeedback('Parcours de paiement simulé. Aucun prestataire n’est connecté et aucun paiement réel ne peut être effectué.')}>Voir / payer</button></div><div className="role-note" style={{ marginTop: 8 }}>Factures et paiements sont illustrés uniquement. Aucune transaction réelle ne sera déclenchée.</div></section></div>{feedback && <div className="role-note" style={{ marginTop: 14 }}>{feedback}</div>}
  </>;
}

function LearnerPortal({ school }: { school: School }) {
  const learnerName = school.educationType === 'Université' ? 'Mariam' : school.educationType === 'Maternelle' ? 'Inès' : 'Aïssatou';
  const learnerGrade = gradeForType(school.educationType, 0);
  return <><div className="callout"><div><div className="eyebrow" style={{ color: '#e7ba6c' }}>Espace apprenant · profil démo</div><h2>Bonjour, {learnerName}.</h2><p>Votre semaine, vos apprentissages et les prochains rendez-vous au même endroit.</p></div><div style={{ fontSize: 10, color: '#d6e2dc' }}>{learnerGrade}<br />{school.schoolYear}</div></div>
    <div className="two-col" style={{ marginTop: 14 }}><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Mes apprentissages</h2><div className="panel-caption">Repères de parcours fictifs</div></div><GraduationCap size={16} color="#34745e" /></div>{[['Français', 'Très bien · expression écrite'], ['Mathématiques', 'Bien · fractions'], ['Sciences', 'En progrès · vivant et matière']].map(([subject, result]) => <div className="list-row" key={subject}><div><strong>{subject}</strong><small>{result}</small></div><ArrowUpRight size={14} color="#45816a" /></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Mon prochain rendez-vous</h2><div className="panel-caption">Agenda personnel de démonstration</div></div><CalendarDays size={16} color="#34745e" /></div><div className="list-row"><div><strong>Atelier lecture</strong><small>Mercredi · 10:30 · Bibliothèque</small></div><span className="status good">À venir</span></div><div className="list-row"><div><strong>Club sciences</strong><small>Vendredi · 15:00 · Salle 4</small></div><span className="status warn">Cette semaine</span></div></section></div>
  </>;
}

function ServicesView({ modules: available, onAction }: { modules: typeof modules; onAction: (type: string) => void }) {
  return <><div className="panel" style={{ marginBottom: 14 }}><div className="panel-head" style={{ marginBottom: 0 }}><div><h2 className="panel-title">Un quotidien coordonné</h2><div className="panel-caption">Modules affichés selon le profil d’établissement sélectionné.</div></div><span className="status good">{available.length} services activés</span></div></div>
    {available.length ? <div className="service-grid">{available.map(({ name, icon: Icon, desc }) => <div className="service-card" key={name}><div className="service-card-top"><Icon size={17} /><ChevronRight size={14} /></div><div><h3>{name}</h3><p>{desc}</p></div><button onClick={() => onAction(`Ouverture du module ${name}`)}>Ouvrir l’aperçu</button></div>)}</div> : <div className="empty-state"><strong>Aucun service activé pour ce profil</strong>Choisissez un autre environnement de démonstration.</div>}
  </>;
}

function AssistantView({ value, setValue, reply, onAsk }: { value: string; setValue: (value: string) => void; reply: string; onAsk: () => void }) {
  return <div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Assistant Édu</h2><div className="panel-caption">Aide de démonstration · contenu généré localement</div></div><Sparkles size={17} color="#c48c35" /></div><div className="callout" style={{ minHeight: 120 }}><div><div className="eyebrow" style={{ color: '#e8bd71' }}>Bonjour, Mariama</div><p>Je peux vous aider à préparer une communication, structurer une séquence pédagogique ou résumer une tâche administrative — avec des exemples fictifs.</p></div></div><form onSubmit={(event) => { event.preventDefault(); if (value.trim()) onAsk(); }} style={{ marginTop: 14 }}><div className="field"><label htmlFor="assistant-prompt">Que souhaitez-vous préparer ?</label><textarea id="assistant-prompt" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Ex. Préparer un message aux familles sur la réunion de classe…" rows={4} style={{ width: '100%', border: '1px solid #e4e0d6', borderRadius: 8, padding: 11, font: '11px DM Sans', resize: 'vertical' }} /></div><button className="button" type="submit"><Send size={13} />Générer un exemple</button></form></section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Réponse de démonstration</h2><div className="panel-caption">Aucune IA externe ni donnée scolaire transmise</div></div><ShieldCheck size={16} color="#34745e" /></div>{reply ? <div className="role-note" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{reply}</div> : <div className="empty-state"><Sparkles size={22} style={{ marginBottom: 10, color: '#be9550' }} /><strong>Un exemple à la fois</strong>Posez une question pour voir une réponse fictive et contextualisée.</div>}<div className="role-note" style={{ marginTop: 14 }}><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />N’ajoutez pas d’information personnelle ou confidentielle. Ce composant ne traite pas de requête externe.</div></section></div>;
}
function makeAssistantReply(prompt: string, school: School) {
  const first = prompt.toLowerCase().includes('famille') || prompt.toLowerCase().includes('message');
  return first
    ? `Objet : Rencontre de la communauté scolaire\n\nChères familles,\n\nL’équipe de ${school.name} vous invite à un temps d’échange autour des apprentissages et de la vie de classe. Nous partagerons les projets du trimestre et répondrons à vos questions.\n\nAu plaisir de vous retrouver,\nL’équipe pédagogique\n\nExemple fictif à relire et adapter avant tout usage.`
    : `Piste de travail · ${school.name}\n\n1. Définir un objectif d’apprentissage observable.\n2. Ouvrir la séance par une question ou une situation concrète.\n3. Prévoir un temps d’exploration en petits groupes.\n4. Terminer par une trace courte et une question de retour.\n\nProposition illustrative uniquement — vérifiez le contenu et adaptez-le à votre cadre pédagogique.`;
}

function SettingsView({ school, groupMode, setGroupMode, language, setLanguage, currency, setCurrency, settings, setSettings, syncs, onSync }: { school: School; groupMode: boolean; setGroupMode: (value: boolean) => void; language: string; setLanguage: (value: string) => void; currency: string; setCurrency: (value: string) => void; settings: { digest: boolean; minorProtection: boolean; audit: boolean }; setSettings: (value: { digest: boolean; minorProtection: boolean; audit: boolean }) => void; syncs: SyncOperation[]; onSync: (type: string) => void }) {
  const changeSetting = (key: keyof typeof settings) => setSettings({ ...settings, [key]: !settings[key] });
  return <><div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Cadre de l’établissement</h2><div className="panel-caption">Préférences de démonstration modifiables</div></div><Languages size={16} color="#34745e" /></div>
    <div className="settings-row"><div className="settings-label"><strong>Expérience multi-établissements</strong><span>Afficher la sélection d’environnements du groupe</span></div><button className={`switch ${groupMode ? 'on' : ''}`} aria-label="Basculer le mode groupe" onClick={() => setGroupMode(!groupMode)} data-testid="toggle-group-mode" /></div>
    <div className="settings-row"><div className="settings-label"><strong>Langue d’affichage</strong><span>Préférence de l’espace de démonstration</span></div><select className="select-control" value={language} onChange={(e) => setLanguage(e.target.value)}><option>Français</option><option>English</option><option>العربية</option></select></div>
    <div className="settings-row"><div className="settings-label"><strong>Devise d’affichage</strong><span>Préférence de lecture, sans transaction</span></div><select className="select-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>{['XOF', 'EUR', 'MAD', 'USD'].map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="settings-row"><div className="settings-label"><strong>Année scolaire</strong><span>{school.country} · exemple de calendrier</span></div><select className="select-control" defaultValue={school.schoolYear}><option>2026–2027</option><option>2027–2028</option><option>Janvier–Décembre</option></select></div>
    <div className="settings-row"><div className="settings-label"><strong>Référentiel de notation</strong><span>Configuration indicative par niveau</span></div><select className="select-control" defaultValue={school.educationType === 'Université' ? 'ECTS · crédits' : 'Sur 20 · compétences'}><option>Sur 20 · compétences</option><option>ECTS · crédits</option><option>Acquis · en cours · à renforcer</option></select></div>
    </section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Principes de confiance</h2><div className="panel-caption">États et intentions de conception — pas une garantie backend</div></div><ShieldCheck size={16} color="#34745e" /></div>
      <div className="settings-row"><div className="settings-label"><strong>Protection des mineurs</strong><span>Étiquette de vigilance pour cet environnement démo</span></div><button className={`switch ${settings.minorProtection ? 'on' : ''}`} aria-label="Protection des mineurs démo" onClick={() => changeSetting('minorProtection')} /></div>
      <div className="settings-row"><div className="settings-label"><strong>Journal d’activité local</strong><span>{syncs.length} action(s) conservée(s) dans le navigateur</span></div><button className={`switch ${settings.audit ? 'on' : ''}`} aria-label="Journal d’activité local" onClick={() => changeSetting('audit')} /></div>
      <div className="settings-row"><div className="settings-label"><strong>Résumé quotidien</strong><span>Préférence d’affichage dans le prototype</span></div><button className={`switch ${settings.digest ? 'on' : ''}`} aria-label="Résumé quotidien" onClick={() => changeSetting('digest')} /></div>
      <div className="role-note"><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Séparation des espaces, permissions fines, auditabilité et protection des données mineurs sont des objectifs de produit. Aucun contrôle serveur n’est implémenté dans cette démo.</div>
    </section></div>
    <section className="panel wide-panel"><div className="panel-head"><div><h2 className="panel-title">File de synchronisation locale</h2><div className="panel-caption">Démonstration d’un parcours hors ligne — sans connexion ni sync réelle</div></div><button className="button secondary small" onClick={() => onSync('Opération de test hors ligne')}><Plus size={13} />Ajouter une opération de test</button></div>
      {syncs.length ? syncs.slice(0, 6).map((item) => <div className="list-row" key={item.id}><div><strong>{item.type}</strong><small>Opération #{item.id} · créée à {item.createdAt}</small></div><StatusBadge value={item.status} /></div>) : <div className="empty-state"><strong>Aucune opération locale</strong>Essayez le mode hors ligne puis modifiez une présence.</div>}
    </section>
  </>;
}

function SaasView({ schools: allSchools, current, groupMode, setGroupMode, onSelect }: { schools: School[]; current: School; groupMode: boolean; setGroupMode: (value: boolean) => void; onSelect: (id: string) => void }) {
  const plans = ['Starter', 'Professional', 'Enterprise', 'Network', 'Institutional'];
  return <><div className="demo-banner"><Building2 size={15} /><span><strong>Vue SaaS de démonstration.</strong> Cette console illustre un pilotage centralisé. Elle ne crée pas de véritables tenants ni de barrières de sécurité.</span></div>
    <div className="metrics"><Metric icon={Building2} label="Établissements exemple" value={String(allSchools.length).padStart(2, '0')} change="Maternelle à université" /><Metric icon={Users} label="Profils d’environnement" value="5 parcours" change="Données de démonstration" /><Metric icon={ShieldCheck} label="Espaces représentés" value="Isolés" change="Séparation visuelle seulement" /><Metric icon={Activity} label="État des services" value="Opérationnel" change="Indication de maquette" /></div>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Groupe scolaire · environnements</h2><div className="panel-caption">Passez d’une institution autonome à un groupe multi-niveaux.</div></div><button className={`switch ${groupMode ? 'on' : ''}`} aria-label="Basculer environnement groupe" onClick={() => setGroupMode(!groupMode)} /></div>
      <div className="institution-cards">{allSchools.map((item) => <button className={`institution-card ${current.id === item.id ? 'selected' : ''}`} key={item.id} onClick={() => onSelect(item.id)}><div className="activity-symbol"><GraduationCap size={15} /></div><strong>{item.name}</strong><span>{item.educationType} · {item.country}</span><div style={{ marginTop: 12 }}><span className={`status ${current.id === item.id ? 'good' : 'warn'}`}>{current.id === item.id ? 'Environnement actif' : 'Aperçu disponible'}</span></div></button>)}</div>
    </section>
    <div className="two-col" style={{ marginTop: 14 }}><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Capacités de plateforme présentées</h2><div className="panel-caption">Concepts de produit, non activés côté serveur</div></div><ShieldCheck size={16} color="#34745e" /></div>{[['Cloisonnement multi-tenant', 'Chaque institution dispose de son environnement de démonstration.'], ['Permissions par rôle', 'Direction, équipe, familles et apprenants voient des espaces distincts.'], ['Journal d’activité', 'Les opérations de cette session sont visibles localement.'], ['Protection des mineurs', 'Une intention produit affichée, sans garantie technique.']].map(([label, desc]) => <div className="list-row" key={label}><div><strong>{label}</strong><small>{desc}</small></div><StatusBadge value="Aperçu" /></div>)}</section>
       <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Modèle d’institution</h2><div className="panel-caption">Configuration actuelle : {current.name}</div></div><Archive size={16} color="#34745e" /></div><div className="list-row"><div><strong>Type d’éducation</strong><small>Niveau de l’établissement</small></div><span className="status good">{current.educationType}</span></div><div className="list-row"><div><strong>Année · devise</strong><small>Référentiel local de démonstration</small></div><strong>{current.schoolYear} · {current.currency}</strong></div><div className="list-row"><div><strong>Modules activés</strong><small>Visibles selon le profil</small></div><strong>{current.enabledModules.length}</strong></div></section></div>
    <section className="panel wide-panel"><div className="panel-head"><div><h2 className="panel-title">Offres, abonnements & licences</h2><div className="panel-caption">Exemples de plans commerciaux · sans prix ni facturation réelle</div></div><CreditCard size={16} color="#34745e" /></div>
      {allSchools.map((item, index) => <div className="list-row" key={item.id}><div><strong>{item.name}</strong><small>Offre {plans[index % plans.length]} · limite de licences configurable · renouvellement illustratif</small></div><div className="toolbar"><StatusBadge value={index === allSchools.length - 1 ? 'En essai' : 'Démontré'} /><button className="text-link" onClick={() => onSelect(item.id)}>Gérer l’aperçu</button></div></div>)}
      <div className="role-note" style={{ marginTop: 12 }}>La plateforme prévoit les essais gratuits, les souscriptions mensuelles ou annuelles, les renouvellements, la suspension et la réactivation, le support et le suivi des incidents. Ces actions sont illustratives seulement.</div>
    </section>
  </>;
}

export default App;
