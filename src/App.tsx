'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Activity, Archive, ArrowDownRight, ArrowUpRight, Banknote, BookOpen, Bus, Eye, Folder, FolderOpen,
  CalendarDays, Check, ChevronRight, CircleHelp, Clock3, Cloud, Coins, CreditCard,
  Download, FileBarChart2, FileText, GraduationCap, House, IdCard, Languages, Library, RotateCcw,
  LockKeyhole, LogOut, Menu, MessageCircle, Package, Plus, Search, Send,
  ShieldCheck, Sparkles, Stethoscope, Users, Utensils, Wallet, WifiOff,
  BriefcaseBusiness, Bell, Settings2, Building2, UserRound, ChartNoAxesCombined,
  CalendarCheck, ShieldAlert, CircleDollarSign, Heart, Printer, type LucideIcon,
} from 'lucide-react';
import DemoLogin, { type DemoAccount, type InstitutionProfile } from './components/DemoLogin';
import { demoAccounts, demoProfiles } from './demo-config';

type EduType = 'Maternelle' | 'Primaire' | 'Collège' | 'Lycée' | 'Université' | 'Multi-cycles';
type ViewKey = 'overview' | 'learners' | 'cards' | 'attendance' | 'academics' | 'operations' | 'team' | 'finance' | 'hr' | 'archive' | 'family' | 'learnerPortal' | 'services' | 'assistant' | 'settings';
type Learner = { id: number; name: string; grade: string; guardian: string; birthDate?: string; guardianPhone?: string; attendanceState: 'Présent' | 'Absent' | 'En retard'; academicSummary: string; feeStatus: 'À jour' | 'En attente' | 'Impayé' };
type School = { id: string; name: string; educationType: EduType; country: string; currency: string; schoolYear: string; enabledModules: string[] };
type SyncOperation = { id: number; type: string; createdAt: string; status: string };
type Capability = 'grade.write' | 'bulletin.draft' | 'bulletin.validate' | 'attendance.write' | 'conduct.write' | 'conduct.view' | 'staff.leave.manage' | 'staff.illness.manage' | 'staff.resignation.manage' | 'roles.manage';
type CustomRole = { name: string; level: EduType; responsibility: string; capabilities: Capability[]; memberNames: string[] };
type OperationRecord = { id: string; schoolId: string; learnerName: string; grade: string; subject: string; type: string; detail: string; actor: string; status: string; createdAt: string; attendanceState?: Learner['attendanceState'] };
type ArchivedDocument = { id: string; schoolId: string; title: string; category: string; folderName: string; folderOwner: string; academicYear: string; owner: string; createdAt: string; summary: string; format: 'PDF' | 'DOCX' | 'XLSX'; visibleTo: string[] };
type DemoSession = { account: DemoAccount; profile: InstitutionProfile };

const schools: School[] = [
  { id: 'arc', name: 'École Les Arcades', educationType: 'Primaire', country: 'Sénégal', currency: 'XOF', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Discipline', 'Activités', 'Équipement', 'Visiteurs', 'Communication', 'Événements'] },
  { id: 'petit', name: 'Les Petits Explorateurs', educationType: 'Maternelle', country: 'Côte d’Ivoire', currency: 'XOF', schoolYear: '2026–2027', enabledModules: ['Cantine', 'Santé', 'Activités', 'Visiteurs', 'Communication', 'Événements'] },
  { id: 'college', name: 'Collège Horizon', educationType: 'Collège', country: 'Côte d’Ivoire', currency: 'XOF', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Discipline', 'Activités', 'Équipement', 'Visiteurs', 'Communication', 'Événements'] },
  { id: 'lycee', name: 'Lycée Horizon', educationType: 'Lycée', country: 'Sénégal', currency: 'XOF', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Discipline', 'Internat', 'Activités', 'Équipement', 'Visiteurs', 'Communication', 'Événements'] },
  { id: 'atlas', name: 'Université Atlas', educationType: 'Université', country: 'Maroc', currency: 'MAD', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Activités', 'Équipement', 'Visiteurs', 'Communication', 'Événements'] },
  { id: 'multi', name: 'Complexe scolaire Horizon', educationType: 'Multi-cycles', country: 'Sénégal', currency: 'XOF', schoolYear: '2026–2027', enabledModules: ['Transport', 'Cantine', 'Bibliothèque', 'Santé', 'Discipline', 'Internat', 'Activités', 'Équipement', 'Visiteurs', 'Communication', 'Événements'] },
];

const archiveTemplates = [
  { category: 'Bulletins & relevés', title: 'Bulletin de période · {learner}', summary: 'Résultats, appréciations et synthèse du parcours apprenant.', format: 'PDF' as const, roles: ['Enseignant', 'Parent / responsable légal', 'Élève / étudiant', 'Responsable pédagogique', 'Directeur', 'Administrateur d’établissement', 'Secrétaire', 'Proviseur / Proviseure', 'Principal / Principale de collège', 'Promoteur / PDG · décideur acheteur', 'Recteur / Directeur général d’université'] },
  { category: 'Résultats & examens', title: 'Résultats de fin de période · {level}', summary: 'Résultats de la période, validation et historique de publication.', format: 'XLSX' as const, roles: ['Enseignant', 'Responsable pédagogique', 'Responsable de département universitaire', 'Directeur', 'Administrateur d’établissement', 'Doyen / Doyenne de faculté', 'Proviseur / Proviseure', 'Proviseur adjoint', 'Principal / Principale de collège', 'Censeur', 'Promoteur / PDG · décideur acheteur', 'Recteur / Directeur général d’université'] },
  { category: 'Emplois du temps', title: 'Emploi du temps · {level}', summary: 'Cours, salles, enseignants et créneaux de l’année académique.', format: 'PDF' as const, roles: ['Enseignant', 'Parent / responsable légal', 'Élève / étudiant', 'Responsable pédagogique', 'Surveillant', 'Directeur', 'Administrateur d’établissement', 'Proviseur / Proviseure', 'Proviseur adjoint', 'Principal / Principale de collège', 'Censeur'] },
  { category: 'Diplômes & certifications', title: 'Registre des diplômes · {year}', summary: 'Diplômes et certifications délivrés pendant l’année universitaire.', format: 'XLSX' as const, roles: ['Responsable de département universitaire', 'Directeur', 'Administrateur d’établissement', 'Secrétaire', 'Élève / étudiant', 'Doyen / Doyenne de faculté', 'Recteur / Directeur général d’université'] },
  { category: 'Paie & ressources humaines', title: 'Bulletins de salaire · novembre {payYear}', summary: 'Lot de bulletins de paie fictifs, avec accès réservé aux RH et à la direction.', format: 'PDF' as const, roles: ['Responsable RH', 'Directeur', 'Administrateur d’établissement', 'Promoteur / PDG · décideur acheteur', 'Recteur / Directeur général d’université', 'Proviseur / Proviseure'] },
  { category: 'Paie & ressources humaines', title: 'Registre du personnel · {year}', summary: 'Dossiers professionnels, affectations et échéances contractuelles.', format: 'XLSX' as const, roles: ['Responsable RH', 'Directeur', 'Administrateur d’établissement'] },
  { category: 'Admissions & dossiers', title: 'Inscriptions et réinscriptions · {year}', summary: 'Dossiers administratifs, pièces attendues et décisions d’admission.', format: 'XLSX' as const, roles: ['Secrétaire', 'Directeur', 'Administrateur d’établissement'] },
  { category: 'Finance & comptabilité', title: 'Journal des paiements · {year}', summary: 'Échéances, paiements et rapprochements de démonstration.', format: 'XLSX' as const, roles: ['Comptable', 'Caissier', 'Directeur', 'Administrateur d’établissement', 'Économe', 'Promoteur / PDG · décideur acheteur', 'Recteur / Directeur général d’université'] },
  { category: 'Finance & comptabilité', title: 'Reçus de caisse · période 1 · {year}', summary: 'Reçus et opérations de caisse fictifs.', format: 'PDF' as const, roles: ['Caissier', 'Comptable', 'Directeur', 'Administrateur d’établissement'] },
  { category: 'Cours & ressources pédagogiques', title: 'Progression des cours · {year}', summary: 'Cours publiés, séquences, ressources et progression pédagogique.', format: 'DOCX' as const, roles: ['Enseignant', 'Responsable pédagogique', 'Responsable de département universitaire', 'Directeur'] },
  { category: 'Examens & délibérations', title: 'Procès-verbal de délibération · {year}', summary: 'Décisions de jury, validations et historique de publication.', format: 'PDF' as const, roles: ['Responsable pédagogique', 'Responsable de département universitaire', 'Directeur', 'Administrateur d’établissement', 'Doyen / Doyenne de faculté', 'Censeur', 'Proviseur / Proviseure', 'Proviseur adjoint', 'Principal / Principale de collège', 'Responsable scolarité & examens'] },
  { category: 'Services scolaires', title: 'Registre des prêts bibliothèque · {year}', summary: 'Catalogue, prêts, retours et réservations en cours.', format: 'XLSX' as const, roles: ['Bibliothécaire', 'Directeur', 'Administrateur d’établissement'] },
  { category: 'Services scolaires', title: 'Registre de cantine · période 1 · {year}', summary: 'Menus, réservations, approvisionnements et suivi des repas.', format: 'XLSX' as const, roles: ['Responsable de cantine', 'Directeur', 'Administrateur d’établissement'] },
  { category: 'Services scolaires', title: 'Circuits de transport · {year}', summary: 'Circuits, arrêts, véhicules et affectations de démonstration.', format: 'PDF' as const, roles: ['Responsable transport', 'Surveillant', 'Directeur', 'Administrateur d’établissement'] },
  { category: 'Services scolaires', title: 'Inventaire des équipements · {year}', summary: 'Équipements, prêts, affectations et maintenances.', format: 'XLSX' as const, roles: ['Gestionnaire de ressources', 'Directeur', 'Administrateur d’établissement'] },
  { category: 'Services scolaires', title: 'Registre de l’internat · {year}', summary: 'Occupation, affectations et mouvements de l’internat.', format: 'XLSX' as const, roles: ['Responsable d’internat', 'Directeur', 'Administrateur d’établissement'] },
  { category: 'Santé & vie scolaire', title: 'Registre santé · accès restreint · {year}', summary: 'Exemple non nominatif de suivi du service médical. Données sensibles masquées.', format: 'PDF' as const, roles: ['Personnel médical habilité'] },
  { category: 'Communication & vie scolaire', title: 'Annonces et communications · {year}', summary: 'Communications, événements et informations partagées.', format: 'PDF' as const, roles: ['Directeur', 'Administrateur d’établissement', 'Secrétaire', 'Enseignant', 'Parent / responsable légal'] },
];

function archiveFolderForCategory(category: string) {
  if (category.includes('Bulletins') || category.includes('Documents apprenants') || category.includes('Admissions')) return 'Scolarité & dossiers apprenants';
  if (category.includes('Résultats') || category.includes('Examens') || category.includes('Diplômes')) return 'Examens, résultats & diplômes';
  if (category.includes('Cours') || category.includes('pédagogiques')) return 'Pédagogie & ressources';
  if (category.includes('Paie') || category.includes('RH')) return 'Personnel & paie';
  if (category.includes('Finance')) return 'Finances & caisse';
  if (category.includes('bibliothèque')) return 'Bibliothèque & prêts';
  if (category.includes('Services')) return 'Services & vie scolaire';
  if (category.includes('Configuration') || category.includes('Pilotage')) return 'Direction & configuration';
  if (category.includes('Communication')) return 'Communication & familles';
  return category || 'Documents divers';
}

function createInitialArchives(): Record<string, ArchivedDocument[]> {
  const years = ['2023–2024', '2024–2025', '2025–2026', '2026–2027'];
  return Object.fromEntries(schools.map((school) => {
    const level = school.educationType === 'Université' ? 'Licence 3 · Droit' : school.educationType === 'Maternelle' ? 'Grande section · A' : 'CM2 · A';
    const learner = initialLearnersBySchool[school.id]?.[0]?.name ?? 'dossier apprenant';
    const documents = archiveTemplates
      .filter((template) => school.educationType === 'Université' || !template.title.startsWith('Registre des diplômes'))
      .filter((template) => !template.title.includes('bibliothèque') || school.enabledModules.includes('Bibliothèque'))
      .filter((template) => !template.title.includes('cantine') || school.enabledModules.includes('Cantine'))
      .filter((template) => !template.title.includes('transport') || school.enabledModules.includes('Transport'))
      .filter((template) => !template.title.includes('équipements') || school.enabledModules.includes('Équipement'))
      .filter((template) => !template.title.includes('internat') || school.enabledModules.includes('Internat'))
      .filter((template) => !template.category.includes('Santé') || school.enabledModules.includes('Santé'))
      .map((template, index): ArchivedDocument => {
        const academicYear = years[index % years.length];
        const payYear = academicYear.split('–')[1];
        return {
          id: `${school.id}-archive-${index + 1}`,
          schoolId: school.id,
          title: template.title.replace('{learner}', learner).replace('{level}', level).replace('{year}', academicYear).replace('{payYear}', payYear),
          category: template.category,
          folderName: archiveFolderForCategory(template.category),
          folderOwner: template.roles[0],
          academicYear,
          owner: template.roles[0],
          createdAt: `${String(8 + (index % 9)).padStart(2, '0')}/${String(1 + (index % 12)).padStart(2, '0')}/${payYear}`,
          summary: template.summary,
          format: template.format,
          visibleTo: template.roles,
        };
      });
    return [school.id, documents];
  }));
}

const firstNames = ['Aïssatou','Moussa','Inès','Amadou','Léa','Yacine','Mamadou','Fatou','Ibrahima','Ndeye','Khadija','Seydou','Awa','Ousmane','Mariama','Cheikh','Ramatou','Jean','Claire','Paul','Salma','Mehdi','Yasmin','Adam','Hana','Louis','Amel','Maya','Éden','Lila','Noa','Inès','Léna','Nora','Malick','Sophie','David','Amina','Rayane','Nathalie','Mariam','Issa','Bintou','Daouda','Noura','Moustapha','Sira','Thierno','Nafissatou','Pape','Khadim','Baba','Mame','Astou','Serigne','Diarra','Khady','Alioune','Samba','Fanta','Boubacar','Bineta','Abdou','Rokhaya','Mouhamed','Safiatou','Ivy','Kenzo','Anita','Dieynaba','Babacar','Mame','Ndèye','Saliou','Zeyna','Kadiatou'];
const lastNames = ['Ndiaye','Diop','Fall','Sarr','Diouf','Ba','Ndiaye','Cissé','Kane','Sarr','Traoré','Ba','Diouf','Diallo','Sène','Sy','Konaté','Morel','Martin','Bernard','El Idrissi','Amrani','Benali','Laurent','Diallo','Morel','Benali','Coulibaly','Traoré','Koné','Martin','Bernard','Petit','Diallo','Fall','Gomis','Camara','Sow','Ndour','Mbaye','Touré','Koffi','Dia','Thiam','Mendy','Demba','Seck','Wade','Faye','Barry','Gueye','Niang','Mbengue','Samb','Lô','Ciss','Boye','Doucouré','Camar','Kane','Diagne','Sagna','Badji','Dieng','Coly','Mané','Sadio','Toure','Tall','Ndao','Sow','Sene','Ndoye','Gaye','Camara','Sy'];
const primaryClasses = ['CP · A','CE1 · A','CE1 · B','CE2 · A','CE2 · B','CM1 · A','CM1 · B','CM2 · A','CM2 · B'];
const initialLearners: Learner[] = firstNames.map((name, index) => ({
  id: 101 + index,
  name: `${name} ${lastNames[index]}`,
  grade: primaryClasses[Math.floor(index / 8)],
  guardian: index % 3 === 0 ? `M. & Mme ${lastNames[index]}` : index % 2 === 0 ? `Mme ${lastNames[index]}` : `M. ${lastNames[index]}`,
  attendanceState: index % 13 === 0 ? 'Absent' : index % 9 === 0 ? 'En retard' : 'Présent',
  academicSummary: index % 10 === 0 ? 'À accompagner' : index % 4 === 0 ? 'Très bien' : index % 3 === 0 ? 'En progrès' : 'Bien',
  feeStatus: index % 11 === 0 ? 'Impayé' : index % 5 === 0 ? 'En attente' : 'À jour',
}));
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
  { name: 'Ousmane Diallo', role: 'Comptable', dept: 'Administration financière', presence: 'Présent' },
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
  { name: 'Communication', icon: MessageCircle, desc: 'Annonces, échanges, rendez-vous et notifications' },
  { name: 'Visiteurs', icon: ShieldCheck, desc: 'Registre des visites de démonstration' },
  { name: 'Événements', icon: CalendarDays, desc: 'Calendrier des temps forts' },
];
const navIcons: Record<string, LucideIcon> = {
  overview: ChartNoAxesCombined, learners: Users, cards: IdCard, attendance: CalendarCheck, academics: BookOpen, operations: Activity, team: Users, archive: Archive,
  finance: Wallet, hr: BriefcaseBusiness, family: UserRound, learnerPortal: GraduationCap,
  services: House, assistant: Sparkles, settings: Settings2,
};
const navLabels: Record<ViewKey, string> = {
  overview: 'Vue d’ensemble', learners: 'Élèves & dossiers', attendance: 'Présences', academics: 'Pédagogie & résultats', archive: 'Archives',
  operations: 'Registres & validations', team: 'Équipe & habilitations',
  cards: 'Cartes scolaires',
  finance: 'Finances', hr: 'Ressources humaines', family: 'Espace familles', learnerPortal: 'Espace apprenant',
  services: 'Services scolaires', assistant: 'Assistant Édu', settings: 'Configuration',
};
const roleNavigation: Record<string, ViewKey[]> = {
  'Administrateur d’établissement': ['overview', 'learners', 'cards', 'attendance', 'academics', 'operations', 'team', 'finance', 'hr', 'archive', 'services', 'assistant', 'settings'],
  Directeur: ['overview', 'learners', 'cards', 'attendance', 'academics', 'operations', 'team', 'finance', 'hr', 'archive', 'services', 'assistant', 'settings'],
  'Directeur de groupe scolaire': ['overview', 'learners', 'cards', 'attendance', 'academics', 'operations', 'team', 'finance', 'hr', 'archive', 'services', 'assistant', 'settings'],
  'Responsable pédagogique': ['overview', 'learners', 'attendance', 'academics', 'operations', 'archive', 'assistant'],
  Secrétaire: ['overview', 'learners', 'cards', 'archive', 'services'],
  Comptable: ['overview', 'finance', 'archive'],
  Caissier: ['finance', 'archive'],
  'Responsable RH': ['overview', 'hr', 'operations', 'archive'],
  Enseignant: ['overview', 'learners', 'attendance', 'academics', 'operations', 'services', 'assistant'],
  'Parent / responsable légal': ['family'],
  'Élève / étudiant': ['learnerPortal'],
  Bibliothécaire: ['services'],
  'Responsable de cantine': ['services'],
  'Responsable transport': ['services'],
  Surveillant: ['overview', 'attendance', 'operations', 'services'],
  'Responsable d’internat': ['services'],
  'Personnel médical habilité': ['services'],
  'Gestionnaire de ressources': ['services'],
  'Responsable de département universitaire': ['overview', 'academics', 'attendance', 'archive'],
  'Promoteur / PDG · décideur acheteur': ['overview', 'learners', 'academics', 'finance', 'hr', 'archive', 'settings'],
  'Recteur / Directeur général d’université': ['overview', 'learners', 'academics', 'operations', 'team', 'finance', 'hr', 'archive', 'settings'],
  'Doyen / Doyenne de faculté': ['overview', 'academics', 'attendance', 'operations', 'archive'],
  'Proviseur / Proviseure': ['overview', 'learners', 'cards', 'attendance', 'academics', 'operations', 'team', 'finance', 'hr', 'archive', 'services'],
  'Proviseur adjoint': ['overview', 'learners', 'attendance', 'academics', 'operations', 'archive', 'services'],
  'Principal / Principale de collège': ['overview', 'learners', 'cards', 'attendance', 'academics', 'operations', 'team', 'finance', 'hr', 'archive', 'services'],
  Censeur: ['overview', 'learners', 'attendance', 'academics', 'operations', 'archive', 'services'],
  'Surveillant général': ['overview', 'attendance', 'operations', 'services'],
  'Conseiller / Conseillère d’orientation': ['overview', 'learners', 'academics'],
  Économe: ['overview', 'finance', 'services', 'archive'],
  'Chef de travaux': ['overview', 'services', 'academics'],
  'Responsable scolarité & examens': ['overview', 'learners', 'attendance', 'academics', 'operations', 'archive'],
};
const capabilityLabels: Record<Capability, string> = {
  'grade.write': 'Saisir et modifier les notes',
  'bulletin.draft': 'Préparer un bulletin',
  'bulletin.validate': 'Valider et publier les bulletins',
  'attendance.write': 'Saisir présences et absences',
  'conduct.write': 'Consigner les faits de conduite',
  'conduct.view': 'Consulter les suivis de conduite',
  'staff.leave.manage': 'Traiter permissions et congés',
  'staff.illness.manage': 'Enregistrer les absences maladie',
  'staff.resignation.manage': 'Traiter les démissions et départs',
  'roles.manage': 'Créer des comptes, rôles et délégations',
};
const roleCapabilities: Record<string, Capability[]> = {
  'Administrateur d’établissement': ['grade.write', 'bulletin.draft', 'bulletin.validate', 'attendance.write', 'conduct.write', 'conduct.view', 'staff.leave.manage', 'staff.illness.manage', 'staff.resignation.manage', 'roles.manage'],
  Directeur: ['grade.write', 'bulletin.draft', 'bulletin.validate', 'attendance.write', 'conduct.write', 'conduct.view', 'staff.leave.manage', 'staff.illness.manage', 'staff.resignation.manage', 'roles.manage'],
  'Directeur de groupe scolaire': ['bulletin.validate', 'conduct.view', 'staff.leave.manage', 'staff.illness.manage', 'staff.resignation.manage', 'roles.manage'],
  'Recteur / Directeur général d’université': ['bulletin.validate', 'conduct.view', 'staff.leave.manage', 'staff.illness.manage', 'staff.resignation.manage', 'roles.manage'],
  'Proviseur / Proviseure': ['bulletin.validate', 'attendance.write', 'conduct.write', 'conduct.view', 'staff.leave.manage', 'staff.illness.manage', 'staff.resignation.manage', 'roles.manage'],
  'Principal / Principale de collège': ['bulletin.validate', 'attendance.write', 'conduct.write', 'conduct.view', 'staff.leave.manage', 'staff.illness.manage', 'staff.resignation.manage', 'roles.manage'],
  'Promoteur / PDG · décideur acheteur': [],
  'Responsable pédagogique': ['grade.write', 'bulletin.draft', 'bulletin.validate', 'conduct.view'],
  'Doyen / Doyenne de faculté': ['grade.write', 'bulletin.draft', 'bulletin.validate', 'conduct.view'],
  'Proviseur adjoint': ['grade.write', 'bulletin.draft', 'attendance.write', 'conduct.view'],
  Censeur: ['grade.write', 'bulletin.draft', 'attendance.write', 'conduct.write', 'conduct.view'],
  'Surveillant général': ['attendance.write', 'conduct.write', 'conduct.view'],
  Surveillant: ['attendance.write', 'conduct.write'],
  Enseignant: ['grade.write', 'bulletin.draft', 'attendance.write'],
  'Responsable de département universitaire': ['grade.write', 'bulletin.draft', 'bulletin.validate'],
  'Responsable scolarité & examens': ['bulletin.draft', 'bulletin.validate', 'attendance.write'],
  'Responsable RH': ['staff.leave.manage', 'staff.illness.manage', 'staff.resignation.manage'],
};
const serviceByRole: Record<string, string[]> = {
  Bibliothécaire: ['Bibliothèque'],
  'Responsable de cantine': ['Cantine'],
  'Responsable transport': ['Transport'],
  'Responsable d’internat': ['Internat'],
  'Personnel médical habilité': ['Santé'],
  'Gestionnaire de ressources': ['Équipement'],
  Surveillant: ['Discipline', 'Transport', 'Visiteurs', 'Communication', 'Événements'],
  'Surveillant général': ['Discipline', 'Transport', 'Visiteurs', 'Communication', 'Événements'],
  'Proviseur adjoint': ['Discipline', 'Transport', 'Cantine', 'Internat', 'Activités', 'Équipement', 'Communication', 'Événements'],
  Censeur: ['Discipline', 'Communication', 'Événements'],
  'Conseiller / Conseillère d’orientation': ['Activités', 'Communication', 'Événements'],
  Économe: ['Équipement', 'Transport', 'Cantine'],
  'Chef de travaux': ['Équipement'],
};

function App() {
  const [view, setView] = useState<ViewKey>('overview');
  const [schoolId, setSchoolId] = useState('arc');
  const [groupMode, setGroupMode] = useState(false);
  const [role, setRole] = useState('Directeur');
  const [rolePermissions, setRolePermissions] = useState<Record<string, ViewKey[]>>(roleNavigation);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [operationRecords, setOperationRecords] = useState<OperationRecord[]>([]);
  const [session, setSession] = useState<DemoSession | null>(null);
  const [activeThemeId, setActiveThemeId] = useState('primaire');
  const [learnersBySchool, setLearnersBySchool] = useState<Record<string, Learner[]>>(initialLearnersBySchool);
  const [archivesBySchool, setArchivesBySchool] = useState<Record<string, ArchivedDocument[]>>(createInitialArchives);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newGuardian, setNewGuardian] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [selectedCardLearnerId, setSelectedCardLearnerId] = useState(101);
  const [printLearnerIds, setPrintLearnerIds] = useState<number[]>([]);
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
  const learnersForSchool = useMemo(() => learners.map((learner, index) => ({
    ...learner,
    grade: learner.id > 106 ? learner.grade : gradeForType(school.educationType, index),
  })), [learners, school.educationType]);
  const visibleLearners = useMemo(() => {
    if (role === 'Parent / responsable légal' || role === 'Élève / étudiant') return learnersForSchool.slice(0, 1);
    if (role === 'Enseignant') return learnersForSchool;
    if (role === 'Responsable pédagogique') return learnersForSchool.filter((learner) => /^(CM1|CM2|CE2)\b/.test(learner.grade));
    return learnersForSchool;
  }, [learnersForSchool, role]);
  const portalLearner = visibleLearners[0] ?? learnersForSchool[0];
  const isPortal = role === 'Parent / responsable légal' || role === 'Élève / étudiant';
  const canManageCards = ['Administrateur d’établissement', 'Directeur', 'Directeur de groupe scolaire', 'Secrétaire', 'Proviseur / Proviseure', 'Principal / Principale de collège'].includes(role);
  const selectedCardLearner = learnersForSchool.find((learner) => learner.id === selectedCardLearnerId) ?? learnersForSchool[0];
  const capabilities = customRoles.find((item) => item.name === role)?.capabilities ?? roleCapabilities[role] ?? [];

  useEffect(() => {
    if (session) return;
    const stored = window.localStorage.getItem('educore-demo-session');
    if (!stored) return;
    try {
      const saved = JSON.parse(stored) as DemoSession;
      const account = demoAccounts.find((item) => item.id === saved.account.id);
      const profile = demoProfiles.find((item) => item.id === saved.profile.id);
      if (!account || !profile) {
        window.localStorage.removeItem('educore-demo-session');
        return;
      }
      const schoolForProfile: Record<string, string> = {
        maternelle: 'petit',
        primaire: 'arc',
        college: 'college',
        lycee: 'lycee',
        universite: 'atlas',
        'groupe-multi-etablissements': 'multi',
        'multi-cycles': 'multi',
      };
      const nextSchoolId = account.role === 'Responsable de département universitaire' ? 'atlas' : schoolForProfile[profile.id] ?? 'arc';
      const nextSchool = schools.find((item) => item.id === nextSchoolId) ?? schools[0];
      setSession({ account, profile });
      setRole(account.role);
      setSchoolId(nextSchool.id);
      setCurrency(nextSchool.currency);
      setActiveThemeId(themeForEducationType(nextSchool.educationType));
      setView(account.role === 'Parent / responsable légal' ? 'family' : account.role === 'Élève / étudiant' ? 'learnerPortal' : roleNavigation[account.role]?.[0] ?? 'overview');
    } catch {
      window.localStorage.removeItem('educore-demo-session');
    }
  }, [session]);

  useEffect(() => {
    if (!printLearnerIds.length) return;
    const printTimer = window.setTimeout(() => window.print(), 150);
    const finishPrint = () => setPrintLearnerIds([]);
    window.addEventListener('afterprint', finishPrint, { once: true });
    return () => {
      window.clearTimeout(printTimer);
      window.removeEventListener('afterprint', finishPrint);
    };
  }, [printLearnerIds]);

  const addSync = (type: string) => {
    setSyncs((items) => [{ id: Date.now(), type, createdAt: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date()), status: offline ? 'En attente' : 'Démontré' }, ...items]);
  };
  const archiveDocument = (category: string, title: string, summary: string, format: ArchivedDocument['format'] = 'PDF', requestedFolder?: string) => {
    const now = new Date();
    const folderName = requestedFolder?.trim() || archiveFolderForCategory(category);
    const folderOwner = archivesBySchool[schoolId]?.find((item) => item.folderName === folderName)?.folderOwner ?? role;
    const document: ArchivedDocument = {
      id: `${schoolId}-${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
      schoolId,
      title,
      category,
      folderName,
      folderOwner,
      academicYear: school.schoolYear,
      owner: role,
      createdAt: new Intl.DateTimeFormat('fr-FR').format(now),
      summary,
      format,
      visibleTo: [...new Set([
        role,
        'Directeur',
        'Administrateur d’établissement',
        ...(archiveTemplates.filter((item) => item.category === category).flatMap((item) => item.roles)),
      ])],
    };
    setArchivesBySchool((current) => ({ ...current, [schoolId]: [document, ...(current[schoolId] ?? [])] }));
    addSync(`Archivage · ${title}`);
  };
  const completeRoleTask = (task: { title: string; category: string; summary: string; format: ArchivedDocument['format'] }) => {
    if (roleNavigation[role]?.includes('archive')) archiveDocument(task.category, task.title, task.summary, task.format);
    else addSync(`Tâche terminée · ${task.title}`);
  };
  const recordOperation = (operation: Omit<OperationRecord, 'id' | 'schoolId' | 'actor' | 'createdAt'>) => {
    const now = new Date();
    const entry: OperationRecord = {
      ...operation,
      id: `${schoolId}-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
      schoolId,
      actor: role,
      createdAt: new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(now),
    };
    setOperationRecords((current) => [entry, ...current]);
    const attendanceState = operation.attendanceState;
    if (attendanceState) {
      const target = learnersForSchool.find((item) => item.name === operation.learnerName);
      if (target) {
        setLearnersBySchool((current) => ({
          ...current,
          [schoolId]: (current[schoolId] ?? []).map((item) => item.id === target.id ? { ...item, attendanceState } : item),
        }));
      }
    }
    const archiveCategory = operation.type.includes('Bulletin') || operation.type.includes('Note')
      ? 'Bulletins & relevés'
      : operation.type.includes('Présence') || operation.type.includes('Conduite')
        ? 'Présences & vie scolaire'
        : 'Paie & ressources humaines';
    archiveDocument(archiveCategory, `${operation.type} · ${operation.learnerName}`, operation.detail, 'PDF');
  };
  const approveOperation = (id: string) => {
    const record = operationRecords.find((item) => item.id === id && item.schoolId === schoolId);
    if (!record || !capabilities.includes('bulletin.validate') || record.status !== 'À valider') return;
    setOperationRecords((current) => current.map((item) => item.id === id ? { ...item, status: 'Validé · démo', detail: `${item.detail} · Validé par ${role}` } : item));
    archiveDocument('Bulletins & relevés', `Validation · ${record.learnerName} · ${school.schoolYear}`, `Validation de démonstration par ${role}. Justification initiale : ${record.detail}. Toute modification réelle nécessiterait un motif et une piste d’audit.`, 'PDF');
  };
  const createCustomRole = (customRole: CustomRole) => {
    const derivedViews: ViewKey[] = ['overview'];
    if (customRole.capabilities.some((item) => ['grade.write', 'bulletin.draft', 'bulletin.validate'].includes(item))) derivedViews.push('academics', 'operations');
    if (customRole.capabilities.some((item) => ['attendance.write', 'conduct.write', 'conduct.view'].includes(item))) derivedViews.push('attendance', 'operations');
    if (customRole.capabilities.some((item) => item.startsWith('staff.'))) derivedViews.push('hr', 'operations');
    setCustomRoles((current) => [...current.filter((item) => item.name !== customRole.name), customRole]);
    setRolePermissions((current) => ({ ...current, [customRole.name]: [...new Set(derivedViews)] }));
    addSync(`Rôle et délégation créés · ${customRole.name}`);
  };
  const setAttendance = (id: number) => {
    const learner = learnersForSchool.find((item) => item.id === id);
    setLearnersBySchool((current) => ({
      ...current,
      [schoolId]: (current[schoolId] ?? []).map((item) => item.id === id ? { ...item, attendanceState: item.attendanceState === 'Présent' ? 'Absent' : 'Présent' } : item),
    }));
    if (learner && roleNavigation[role]?.includes('archive')) archiveDocument('Présences & vie scolaire', `Pointage de ${learner.name} · ${school.schoolYear}`, `Statut mis à jour depuis l’espace ${role}. Nouveau pointage de démonstration.`, 'XLSX');
  };
  const saveLearner = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newName.trim() || !newGrade.trim()) return;
    const learner: Learner = {
      id: Math.max(0, ...(learnersBySchool[schoolId] ?? []).map((item) => item.id)) + 1,
      name: newName.trim(),
      grade: newGrade.trim(),
      guardian: newGuardian.trim() || 'Non renseigné',
      birthDate: newBirthDate || undefined,
      guardianPhone: newGuardianPhone.trim() || undefined,
      attendanceState: 'Présent',
      academicSummary: 'Nouveau dossier',
      feeStatus: 'À jour',
    };
    setLearnersBySchool((current) => ({ ...current, [schoolId]: [learner, ...(current[schoolId] ?? [])] }));
    archiveDocument('Admissions & dossiers', `Création du dossier · ${learner.name}`, `Nouveau dossier d’admission fictif en ${learner.grade}. Les coordonnées de responsable ne sont pas incluses dans cette fiche.`, 'PDF');
    setNewName('');
    setNewGrade('');
    setNewBirthDate('');
    setNewGuardian('');
    setNewGuardianPhone('');
    setModalOpen(false);
    setView('learners');
  };
  const filteredLearners = useMemo(() => visibleLearners.filter((item) => `${item.name} ${item.grade} ${item.guardian}`.toLowerCase().includes(query.toLowerCase())), [visibleLearners, query]);
  const visibleNav = rolePermissions[role] ?? roleNavigation[role] ?? ['overview'];
  useEffect(() => {
    if (session && !visibleNav.includes(view)) setView(visibleNav[0] ?? 'overview');
  }, [role, rolePermissions, session, view, visibleNav]);
  const relevantModules = modules.filter((module) =>
    school.enabledModules.includes(module.name) &&
    (module.name !== 'Internat' || school.educationType === 'Collège' || school.educationType === 'Lycée' || school.educationType === 'Université' || school.educationType === 'Multi-cycles') &&
    (!serviceByRole[role] || serviceByRole[role].includes(module.name)),
  );
  const changeView = (next: ViewKey) => {
    if (!visibleNav.includes(next)) return;
    setView(next);
    setMobileOpen(false);
    setQuery('');
  };
  const handleLogin = (account: DemoAccount, profile: InstitutionProfile) => {
    const schoolForProfile: Record<string, string> = {
      maternelle: 'petit',
      primaire: 'arc',
      college: 'college',
      lycee: 'lycee',
      universite: 'atlas',
      'groupe-multi-etablissements': 'multi',
      'multi-cycles': 'multi',
    };
    const fixedSchoolId = account.role === 'Responsable de département universitaire' ? 'atlas' : undefined;
    const nextSchoolId = fixedSchoolId ?? schoolForProfile[profile.id] ?? 'arc';
    const nextSchool = schools.find((item) => item.id === nextSchoolId) ?? schools[0];
    setLearnersBySchool(initialLearnersBySchool);
    setArchivesBySchool(createInitialArchives());
    setOperationRecords([]);
    setCustomRoles([]);
    setRolePermissions(roleNavigation);
    setSyncs([]);
    setOffline(false);
    setAssistantText('');
    setAssistantReply('');
    setQuery('');
    setModalOpen(false);
    setNewName('');
    setNewGrade('');
    setNewBirthDate('');
    setNewGuardian('');
    setNewGuardianPhone('');
    setSelectedCardLearnerId(101);
    setPrintLearnerIds([]);
    setSettings({ digest: true, minorProtection: true, audit: true });
    setLanguage('Français');
    setSession({ account, profile });
    setRole(account.role);
    setSchoolId(nextSchool.id);
    setCurrency(nextSchool.currency);
    setActiveThemeId(themeForEducationType(nextSchool.educationType));
    setGroupMode(account.role === 'Directeur de groupe scolaire');
    setView(account.role === 'Parent / responsable légal' ? 'family' : account.role === 'Élève / étudiant' ? 'learnerPortal' : account.role === 'Caissier' ? 'finance' : roleNavigation[account.role]?.[0] ?? 'overview');
    window.localStorage.setItem('educore-demo-session', JSON.stringify({ account, profile }));
  };
  const logout = () => {
    window.localStorage.removeItem('educore-demo-session');
    setSession(null);
    setLearnersBySchool(initialLearnersBySchool);
    setArchivesBySchool(createInitialArchives());
    setOperationRecords([]);
    setCustomRoles([]);
    setRolePermissions(roleNavigation);
    setSyncs([]);
    setOffline(false);
    setAssistantText('');
    setAssistantReply('');
    setMobileOpen(false);
    setModalOpen(false);
    setNewName('');
    setNewGrade('');
    setNewBirthDate('');
    setNewGuardian('');
    setNewGuardianPhone('');
    setSelectedCardLearnerId(101);
    setPrintLearnerIds([]);
    setRole('Directeur');
    setView('overview');
    setSchoolId('arc');
    setCurrency(schools[0].currency);
    setGroupMode(false);
    setActiveThemeId('primaire');
  };
  const selectSchool = (id: string) => {
    if (role === 'Parent / responsable légal' || role === 'Élève / étudiant' || role === 'Enseignant') return;
    const nextSchool = schools.find((item) => item.id === id);
    if (!nextSchool) return;
    setSchoolId(id);
    setCurrency(nextSchool.currency);
    setActiveThemeId(themeForEducationType(nextSchool.educationType));
    setSelectedCardLearnerId((learnersBySchool[id] ?? [])[0]?.id ?? 0);
    addSync('Changement d’environnement');
  };
  const openLearnerCard = (id: number) => {
    if (!canManageCards) return;
    setSelectedCardLearnerId(id);
    changeView('cards');
  };
  const printCards = (ids: number[]) => {
    if (!ids.length) return;
    setPrintLearnerIds(ids);
  };
  const resetDemo = () => {
    if (!window.confirm('Réinitialiser toutes les données de démonstration ? Les modifications locales de cette session seront perdues.')) return;
    logout();
  };

  if (!session) return <DemoLogin profiles={demoProfiles} accounts={demoAccounts} onLogin={handleLogin} />;

  return (
    <div className={`app${printLearnerIds.length ? ' printing' : ''}`} data-edu-theme={activeThemeId}>
      <div className="shell">
        <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
          <div className="brand">
            <div className="brand-mark"><GraduationCap size={19} /></div>
            <div className="brand-name">edu<span>core</span></div>
            <span className="demo-chip">Démo</span>
          </div>
          {(role === 'Administrateur d’établissement' || role === 'Directeur' || role === 'Directeur de groupe scolaire') && <div className="school-switch">
            <label>{groupMode ? 'Groupe scolaire · environnement' : 'Établissement'}</label>
            <select className="school-select" value={schoolId} onChange={(e) => selectSchool(e.target.value)} data-testid="select-institution">
              {schools.filter((item) => role === 'Directeur de groupe scolaire' || item.id === school.id).map((item) => <option key={item.id} value={item.id}>{item.educationType} · {item.name}</option>)}
            </select>
          </div>}
          <div className="nav-label">{isPortal ? `Espace ${role.toLowerCase()}` : role === 'Enseignant' ? 'Espace pédagogique' : 'Espace établissement'}</div>
          <nav className="nav-list">
            {visibleNav.map((item) => {
              const Icon = navIcons[item];
              return <button key={item} className={`nav-item ${view === item ? 'active' : ''}`} onClick={() => changeView(item)} data-testid={`nav-${item}`}><Icon className="nav-icon" />{navLabels[item]}</button>;
            })}
          </nav>
          <div className="sidebar-foot">
            <div className="demo-note">Données fictives · environnement de présentation<br />Aucune donnée scolaire réelle n’est enregistrée.</div>
            <div className="user-chip"><div className="avatar">{session.account.initials}</div><div className="user-identity"><div className="user-name">{session.account.name}</div><div className="user-role">{session.account.role} · espace démo</div><div className="user-email">{session.account.email}</div></div></div>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="icon-button mobile-menu" aria-label="Ouvrir le menu" onClick={() => setMobileOpen((open) => !open)}><Menu size={16} /></button>
              <div className="crumb"><span>{school.name}</span><ChevronRight size={12} /><strong>{navLabels[view]}</strong></div>
            </div>
            <div className="top-actions">
              <span className="top-role-pill" data-testid="current-user-role">{role} · démo</span>
              {!isPortal && <button className="icon-button" aria-label={offline ? 'Repasser en mode connecté de démonstration' : 'Démontrer le mode hors ligne'} title={offline ? 'Mode hors ligne activé' : 'Connecté (simulation)'} onClick={() => { const nextOffline = !offline; setOffline(nextOffline); setSyncs((items) => [{ id: Date.now(), type: nextOffline ? 'Passage en mode hors ligne' : 'Reconnexion simulée', createdAt: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date()), status: nextOffline ? 'En attente' : 'Démontré' }, ...items]); }} data-testid="toggle-offline"><Cloud size={15} />{offline && <span className="online-dot" style={{ background: '#d89c3f' }} />}</button>}
              {!isPortal && <button className="icon-button" aria-label="Notifications de démonstration" onClick={() => changeView('overview')}><Bell size={15} /><span className="online-dot" /></button>}
              <button className="logout-button top-logout" onClick={resetDemo} data-testid="button-reset-demo" title="Réinitialiser les données de démonstration" aria-label="Réinitialiser la démo"><RotateCcw size={14} /><span>Réinitialiser</span></button>
              <button className="logout-button top-logout" onClick={logout} data-testid="button-logout" aria-label="Quitter la démo"><LogOut size={14} /><span>Quitter</span></button>
            </div>
          </header>
          <div className="content fade-in" key={view}>
            <PageHeader view={view} school={school} role={role} onAdd={canManageCards ? () => setModalOpen(true) : undefined} onSync={() => { setSyncs((items) => items.map((item) => ({ ...item, status: 'Démontré' }))); setOffline(false); }} pending={isPortal ? 0 : syncs.filter((item) => item.status === 'En attente').length} />
            {!isPortal && <div className="demo-banner"><Sparkles size={14} /><span><strong>Prototype de démonstration.</strong> Les rôles limitent les écrans visibles, mais cette application sans serveur ne protège pas de vraies données privées.</span></div>}
            {offline && !isPortal && <div className="sync-bar"><WifiOff size={15} /><span><strong>Mode hors ligne simulé.</strong> Les changements sont gardés dans cette session et apparaissent dans la file locale.</span><button className="text-link" onClick={() => changeView('settings')}>Voir le cadre</button></div>}
            {view === 'overview' && <Overview school={school} learners={visibleLearners} syncs={syncs} role={role} onNavigate={changeView} onCompleteTask={completeRoleTask} onAction={addSync} />}
                  {view === 'learners' && <LearnerView learners={filteredLearners} query={query} setQuery={setQuery} onAdd={canManageCards ? () => setModalOpen(true) : undefined} onCreateCard={canManageCards ? openLearnerCard : undefined} onExport={() => downloadLearnerCsv(filteredLearners, school)} teacherMode={role === 'Enseignant'} />}
            {view === 'cards' && canManageCards && selectedCardLearner && <CardStudio learners={learnersForSchool} selectedLearnerId={selectedCardLearner.id} onSelect={setSelectedCardLearnerId} school={school} onPrintOne={(id) => printCards([id])} onPrintAll={() => printCards(learnersForSchool.map((learner) => learner.id))} />}
            {view === 'attendance' && <AttendanceView learners={visibleLearners} onToggle={setAttendance} onExport={() => downloadAttendanceCsv(visibleLearners, school)} teacherMode={role === 'Enseignant'} />}
            {view === 'academics' && <AcademicsView school={school} learners={role === 'Enseignant' || role === 'Élève / étudiant' || role === 'Responsable pédagogique' || role === 'Responsable de département universitaire' ? visibleLearners : learnersForSchool} />}
            {view === 'operations' && <OperationsView school={school} role={role} capabilities={capabilities} learners={visibleLearners} records={operationRecords.filter((item) => item.schoolId === schoolId)} onRecord={recordOperation} onApprove={approveOperation} />}
            {view === 'team' && <TeamManagementView school={school} role={role} customRoles={customRoles} onCreateRole={createCustomRole} onPreviewRole={(name) => { setRole(name); setView('overview'); }} />}
            {view === 'finance' && (role === 'Caissier'
              ? <CashierView school={{ ...school, currency }} learners={learnersForSchool} onArchive={archiveDocument} />
              : <FinanceView school={{ ...school, currency }} learners={learnersForSchool} onArchive={archiveDocument} />)}
            {view === 'hr' && <HrView onArchive={archiveDocument} />}
            {view === 'archive' && <ArchiveView documents={archivesBySchool[schoolId] ?? []} school={school} role={role} onArchive={archiveDocument} />}
            {view === 'family' && <FamilyView children={learnersForSchool.filter((learner) => learner.guardian === portalLearner.guardian)} school={school} guardianName={session.account.name} onAction={addSync} />}
            {view === 'learnerPortal' && <LearnerPortal school={school} learner={portalLearner} onAction={addSync} />}
            {view === 'services' && <ServicesView modules={relevantModules} onAction={addSync} onArchive={archiveDocument} canArchive={roleNavigation[role]?.includes('archive') ?? false} />}
            {view === 'assistant' && <AssistantView value={assistantText} setValue={setAssistantText} reply={assistantReply} onAsk={() => { setAssistantReply(makeAssistantReply(assistantText, school)); addSync('Question à l’assistant démo'); }} />}
            {view === 'settings' && <SettingsView school={school} groupMode={groupMode} setGroupMode={setGroupMode} language={language} setLanguage={setLanguage} currency={currency} setCurrency={setCurrency} settings={settings} setSettings={setSettings} syncs={syncs} onSync={addSync} rolePermissions={rolePermissions} onRolePermissionsChange={(name, views) => setRolePermissions((current) => ({ ...current, [name]: views }))} onCreateRole={(name) => setRolePermissions((current) => ({ ...current, [name]: [] }))} onPreviewRole={setRole} />}
          </div>
        </main>
      </div>
      {view === 'cards' && canManageCards && <div className="id-card-print-root" aria-hidden="true">
        {learnersForSchool.filter((learner) => printLearnerIds.includes(learner.id)).map((learner) => <StudentIdentityCard key={learner.id} learner={learner} school={school} printCard />)}
      </div>}
      {mobileOpen && <button className="modal-backdrop" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} style={{ zIndex: 8, background: 'transparent', border: 0 }} />}
      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <form className="modal" onSubmit={saveLearner}>
          <h2>Ajouter un dossier démo</h2><p>Créez un profil fictif dans l’environnement {school.name}. Aucune donnée réelle n’est sollicitée.</p>
          <div className="field"><label htmlFor="learner-name">Prénom et nom</label><input id="learner-name" autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex. Salma Diallo" autoComplete="name" required /></div>
          <div className="field"><label htmlFor="learner-grade">Classe / niveau</label><input id="learner-grade" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} placeholder={school.educationType === 'Université' ? 'Licence 1 · Économie' : 'CM2 · A'} required /></div>
          <div className="two-col learner-form-grid">
            <div className="field"><label htmlFor="learner-birth-date">Date de naissance · facultative</label><input id="learner-birth-date" type="date" value={newBirthDate} onChange={(e) => setNewBirthDate(e.target.value)} /></div>
            <div className="field"><label htmlFor="learner-guardian">Responsable légal · facultatif</label><input id="learner-guardian" value={newGuardian} onChange={(e) => setNewGuardian(e.target.value)} placeholder="Ex. Mme Diallo" /></div>
          </div>
          <div className="field"><label htmlFor="learner-guardian-phone">Téléphone du responsable · facultatif</label><input id="learner-guardian-phone" type="tel" autoComplete="tel" value={newGuardianPhone} onChange={(e) => setNewGuardianPhone(e.target.value)} placeholder="+221 77 000 00 00" /></div>
          <div className="role-note">L’identifiant scolaire de démonstration sera créé automatiquement. Les coordonnées restent sur cette fiche et ne figurent pas sur la carte imprimée.</div>
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

function themeForEducationType(type: EduType) {
  if (type === 'Maternelle') return 'maternelle';
  if (type === 'Primaire') return 'primaire';
  if (type === 'Collège') return 'college';
  if (type === 'Lycée') return 'lycee';
  if (type === 'Université') return 'universite';
  return 'multi-cycles';
}

function PageHeader({ view, school, role, onAdd, pending, onSync }: { view: ViewKey; school: School; role: string; onAdd?: () => void; pending: number; onSync: () => void }) {
  const descriptions: Record<ViewKey, string> = {
    overview: role === 'Promoteur / PDG · décideur acheteur' ? 'Évaluez les parcours, les hypothèses de valeur et les conditions d’un pilote.' : 'Une vue claire des opérations de votre établissement.', learners: 'Retrouvez les profils et les informations scolaires essentielles.',
    cards: 'Créez des cartes nominatives à partir des dossiers et imprimez-les en série.',
    archive: 'Retrouvez les pièces administratives, pédagogiques et financières par catégorie et année.',
    attendance: 'Suivez les présences de la journée et les actions en attente.', academics: 'Parcours pédagogiques, évaluations et résultats.',
    finance: 'Suivi de démonstration des frais et encaissements scolaires.', hr: 'Présence des équipes et repères de gestion du personnel.',
    family: 'Une fenêtre sur les échanges entre l’école et les familles.', learnerPortal: 'Le quotidien scolaire vu depuis l’espace apprenant.',
    services: 'Les services qui accompagnent la vie de l’établissement.', assistant: 'Une aide contextualisée pour les tâches d’enseignement et de gestion.',
    settings: 'Établissement, organisation éducative, année académique et accès par rôle.',
    operations: 'Saisie, justification et validation des actes scolaires et RH selon les responsabilités déléguées.',
    team: 'Organigramme, titulaires et règles de délégation configurés pour cet établissement.',
  };
  const title = view === 'overview' && role === 'Promoteur / PDG · décideur acheteur' ? 'Espace décideur · projet d’adoption' : navLabels[view];
  return <div className="page-head"><div><div className="eyebrow">{school.educationType} · {school.country} · année {school.schoolYear}</div><h1>{title}</h1><p className="subhead">{descriptions[view]}</p></div>
    <div className="toolbar">{pending > 0 && <button className="button secondary small" onClick={onSync}><Cloud size={13} />{pending} en attente · simuler sync</button>}
      {view === 'learners' && onAdd && <button className="button" onClick={onAdd}><Plus size={14} />Ajouter un élève</button>}
      {view === 'overview' && <span className="status good">Environnement de démo</span>}
    </div>
  </div>;
}

function Overview({ school, learners, syncs, role, onNavigate, onCompleteTask, onAction }: { school: School; learners: Learner[]; syncs: SyncOperation[]; role: string; onNavigate: (view: ViewKey) => void; onCompleteTask: (task: { title: string; category: string; summary: string; format: ArchivedDocument['format'] }) => void; onAction: (action: string) => void }) {
  const taskPanel = role === 'Promoteur / PDG · décideur acheteur' ? null : <RoleTaskPanel role={role} school={school} canArchive={roleNavigation[role]?.includes('archive') ?? false} onComplete={onCompleteTask} />;
  const dashboard = role === 'Promoteur / PDG · décideur acheteur'
    ? <BuyerDashboard school={school} onNavigate={onNavigate} onAction={onAction} />
    : role === 'Enseignant' || role === 'Responsable pédagogique' || role === 'Responsable de département universitaire' || role === 'Doyen / Doyenne de faculté' || role === 'Censeur' || role === 'Proviseur adjoint' || role === 'Surveillant général' || role === 'Responsable scolarité & examens'
    ? <TeacherDashboard school={school} learners={learners} onNavigate={onNavigate} />
    : role === 'Comptable' || role === 'Caissier' || role === 'Économe'
      ? <FinanceDashboard school={school} onNavigate={onNavigate} />
      : role === 'Responsable RH'
        ? <HrDashboard school={school} onNavigate={onNavigate} />
        : role === 'Secrétaire'
          ? <ReceptionDashboard school={school} learners={learners} onNavigate={onNavigate} />
          : role === 'Surveillant'
            ? <TeacherDashboard school={school} learners={learners} onNavigate={onNavigate} />
            : school.educationType === 'Maternelle'
              ? <MaternelleDashboard school={school} learners={learners} onNavigate={onNavigate} />
              : school.educationType === 'Collège'
                ? <CollegeDashboard school={school} learners={learners} onNavigate={onNavigate} />
                : school.educationType === 'Lycée'
                  ? <LyceeDashboard school={school} learners={learners} onNavigate={onNavigate} />
                  : school.educationType === 'Université'
                    ? <UniversityDashboard school={school} onNavigate={onNavigate} />
                    : school.educationType === 'Multi-cycles'
                      ? <MultiCycleDashboard school={school} onNavigate={onNavigate} />
                      : <PrimaryDashboard school={school} learners={learners} syncs={syncs} onNavigate={onNavigate} />;
  return <div className="role-dashboard">{taskPanel}{dashboard}</div>;
}

function tasksForRole(role: string, school: School) {
  const tasks: Record<string, { title: string; category: string; summary: string; format: ArchivedDocument['format'] }[]> = {
    'Administrateur d’établissement': [
      { title: 'Publier le calendrier académique', category: 'Configuration & calendriers', summary: `Calendrier ${school.schoolYear} partagé avec les équipes.`, format: 'PDF' },
      { title: 'Archiver la configuration de l’établissement', category: 'Configuration & calendriers', summary: `Référentiel de ${school.name}, ses cycles et modules activés.`, format: 'DOCX' },
    ],
    Directeur: [
      { title: 'Valider les résultats de la période', category: 'Examens & délibérations', summary: 'Validation de démonstration ; toute modification ultérieure doit être motivée et auditée.', format: 'PDF' },
      { title: 'Approuver une demande administrative', category: 'Admissions & dossiers', summary: 'Décision de direction illustrée pour un dossier de démonstration.', format: 'PDF' },
    ],
    'Directeur de groupe scolaire': [
      { title: 'Publier le rapport consolidé du groupe', category: 'Pilotage de groupe', summary: 'Synthèse fictive des établissements et de leurs cycles.', format: 'PDF' },
      { title: 'Valider le calendrier commun', category: 'Configuration & calendriers', summary: `Calendrier consolidé de l’année ${school.schoolYear}.`, format: 'PDF' },
    ],
    'Responsable pédagogique': [
      { title: 'Publier une progression pédagogique', category: 'Cours & ressources pédagogiques', summary: 'Progression et objectifs d’apprentissage publiés pour les équipes.', format: 'DOCX' },
      { title: 'Planifier une évaluation', category: 'Examens & délibérations', summary: 'Évaluation planifiée avec barème et période de correction.', format: 'PDF' },
    ],
    Secrétaire: [
      { title: 'Valider une inscription', category: 'Admissions & dossiers', summary: 'Pièces vérifiées, décision documentée et affectation à confirmer.', format: 'PDF' },
      { title: 'Préparer un certificat de scolarité', category: 'Documents apprenants', summary: 'Brouillon de certificat fictif, à vérifier avant toute remise.', format: 'PDF' },
    ],
    Comptable: [
      { title: 'Clôturer le rapprochement de période', category: 'Finance & comptabilité', summary: 'Contrôle des paiements, journaux et pièces justificatives fictifs.', format: 'XLSX' },
      { title: 'Préparer le rapport budgétaire', category: 'Finance & comptabilité', summary: 'Comparatif budget prévisionnel et réalisé par service.', format: 'PDF' },
    ],
    'Responsable RH': [
      { title: 'Préparer le cycle de paie', category: 'Paie & ressources humaines', summary: 'Variables et absences revues avant validation de paie fictive.', format: 'XLSX' },
      { title: 'Archiver les échéances contractuelles', category: 'Paie & ressources humaines', summary: 'Suivi des contrats et affectations du personnel.', format: 'PDF' },
    ],
    Enseignant: [
      { title: 'Publier un devoir pour ma classe', category: 'Cours & ressources pédagogiques', summary: 'Consigne, échéance et ressources publiées dans le parcours LMS.', format: 'PDF' },
      { title: 'Archiver le suivi des résultats de ma classe', category: 'Résultats & examens', summary: 'Synthèse de classe et suivi des compétences.', format: 'XLSX' },
    ],
    'Responsable de département universitaire': [
      { title: 'Valider les unités d’enseignement', category: 'Cours & ressources pédagogiques', summary: 'Programme, unités, crédits et objectifs de la faculté.', format: 'DOCX' },
      { title: 'Publier le procès-verbal du jury', category: 'Examens & délibérations', summary: 'Délibération et résultats universitaires après validation.', format: 'PDF' },
    ],
    'Promoteur / PDG · décideur acheteur': [
      { title: 'Évaluer l’adéquation avec mon établissement', category: 'Étude de déploiement', summary: 'Périmètre, rôles prioritaires, outils à remplacer et critères de réussite.', format: 'PDF' },
      { title: 'Préparer un pilote de 30 jours', category: 'Étude de déploiement', summary: 'Établissement pilote, équipe référente, données de test et indicateurs de décision.', format: 'XLSX' },
    ],
    'Recteur / Directeur général d’université': [
      { title: 'Valider le calendrier universitaire', category: 'Configuration & calendriers', summary: `Calendrier des semestres, examens, jurys et délibérations ${school.schoolYear}.`, format: 'PDF' },
      { title: 'Suivre les accréditations et la qualité', category: 'Pilotage académique', summary: 'Échéances de programmes, évaluations de qualité et plans d’amélioration.', format: 'XLSX' },
    ],
    'Doyen / Doyenne de faculté': [
      { title: 'Organiser les jurys de semestre', category: 'Examens & délibérations', summary: 'Planification des jurys, délibérations et validations de crédits.', format: 'PDF' },
      { title: 'Suivre les départements et programmes', category: 'Cours & ressources pédagogiques', summary: 'Progression des unités d’enseignement et besoins pédagogiques de la faculté.', format: 'XLSX' },
    ],
    'Proviseur / Proviseure': [
      { title: 'Présider le conseil de classe', category: 'Examens & délibérations', summary: 'Préparer les décisions pédagogiques, orientations et actions de suivi.', format: 'PDF' },
      { title: 'Valider les mesures de vie scolaire', category: 'Vie scolaire & discipline', summary: 'Suivi éducatif et décisions validées par la direction du lycée.', format: 'PDF' },
    ],
    'Proviseur adjoint': [
      { title: 'Organiser les emplois du temps', category: 'Emplois du temps', summary: 'Affectations de classes, salles, enseignants et remplacements.', format: 'XLSX' },
      { title: 'Suivre les absences des équipes', category: 'Présences & vie scolaire', summary: 'Point de situation des absences et continuité des cours.', format: 'PDF' },
    ],
    'Principal / Principale de collège': [
      { title: 'Préparer le conseil pédagogique', category: 'Cours & ressources pédagogiques', summary: 'Suivi des cycles, besoins des classes et coordination des équipes.', format: 'PDF' },
      { title: 'Valider les décisions de fin de période', category: 'Examens & délibérations', summary: 'Synthèse de résultats avant publication aux familles.', format: 'PDF' },
    ],
    Censeur: [
      { title: 'Valider la progression des classes', category: 'Cours & ressources pédagogiques', summary: 'Progression des programmes et couverture des enseignements.', format: 'XLSX' },
      { title: 'Préparer les compositions', category: 'Examens & délibérations', summary: 'Calendrier, salles, surveillants et listes de candidats.', format: 'PDF' },
    ],
    'Surveillant général': [
      { title: 'Clôturer le registre des retards', category: 'Présences & vie scolaire', summary: 'Pointage journalier, retards et suivi de présence.', format: 'XLSX' },
      { title: 'Préparer le rapport de vie scolaire', category: 'Vie scolaire & discipline', summary: 'Événements de la journée et mesures éducatives à suivre.', format: 'PDF' },
    ],
    'Conseiller / Conseillère d’orientation': [
      { title: 'Préparer les entretiens d’orientation', category: 'Accompagnement des apprenants', summary: 'Rendez-vous et parcours à examiner avec les apprenants concernés.', format: 'XLSX' },
      { title: 'Publier les repères de filières', category: 'Orientation & parcours', summary: 'Voies, séries, filières et échéances de candidature.', format: 'PDF' },
    ],
    Économe: [
      { title: 'Valider les demandes d’achat', category: 'Finance & comptabilité', summary: 'Contrôle des demandes, fournisseurs et pièces justificatives.', format: 'XLSX' },
      { title: 'Suivre le budget de fonctionnement', category: 'Finance & comptabilité', summary: 'Dépenses par service, engagements et écarts budgétaires.', format: 'PDF' },
    ],
    'Chef de travaux': [
      { title: 'Planifier les travaux pratiques', category: 'Ateliers & travaux pratiques', summary: 'Ateliers, salles spécialisées, encadrement et sécurité des activités.', format: 'XLSX' },
      { title: 'Signaler un équipement à maintenir', category: 'Services scolaires', summary: 'État du matériel technique et intervention à programmer.', format: 'PDF' },
    ],
    'Responsable scolarité & examens': [
      { title: 'Préparer les inscriptions et réinscriptions', category: 'Admissions & dossiers', summary: 'Dossiers, pièces requises et affectations de classes ou de filières.', format: 'XLSX' },
      { title: 'Publier le calendrier des examens', category: 'Examens & délibérations', summary: 'Convocations, salles, surveillants et calendrier de publication des résultats.', format: 'PDF' },
    ],
  };
  return tasks[role] ?? [];
}

function RoleTaskPanel({ role, school, canArchive, onComplete }: { role: string; school: School; canArchive: boolean; onComplete: (task: { title: string; category: string; summary: string; format: ArchivedDocument['format'] }) => void }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const tasks = tasksForRole(role, school);
  if (!tasks.length) return null;
  return <section className="panel task-workbench"><div className="panel-head"><div><h2 className="panel-title">Mes tâches prioritaires</h2><div className="panel-caption">{role} · actions correspondant à votre fonction</div></div><span className="status good">{tasks.length - completed.length} à traiter</span></div>
    <div className="task-workbench-list">{tasks.map((task) => <div className="task-workbench-row" key={task.title}><div><strong>{task.title}</strong><small>{task.summary}</small></div><button className={`button small ${completed.includes(task.title) ? 'secondary' : ''}`} disabled={completed.includes(task.title)} onClick={() => { setCompleted((items) => [...items, task.title]); onComplete(task); }}>{completed.includes(task.title) ? <><Check size={13} />Terminé</> : canArchive ? <><Archive size={13} />Terminer & classer</> : <><Check size={13} />Effectuer</>}</button></div>)}</div>
  </section>;
}

function ReceptionDashboard({ school, learners, onNavigate }: { school: School; learners: Learner[]; onNavigate: (view: ViewKey) => void }) {
  const [notice, setNotice] = useState('');
  const [admissions, setAdmissions] = useState(12);
  const [candidates, setCandidates] = useState(8);
  return <div className="role-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Accueil & administration scolaire</span><h2>Les dossiers, au bon endroit.</h2><p>{school.name} · suivi administratif de démonstration</p></div><button className="button" onClick={() => onNavigate('learners')}>Ouvrir les inscriptions <Users size={14} /></button></section>
    <div className="metrics"><Metric icon={Users} label="Dossiers suivis" value={String(learners.length)} change="Profils fictifs dans l’établissement" /><Metric icon={FileText} label="Candidatures" value={String(candidates)} change="Étude de dossiers" /><Metric icon={Clock3} label="Demandes en attente" value={String(admissions)} change="Inscriptions et réinscriptions" /><Metric icon={Archive} label="Documents classés" value="94%" change="Indicateur illustratif" /></div>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Admissions & dossiers</h2><div className="panel-caption">Actions temporaires enregistrées dans cette session</div></div><Plus size={16} /></div>
      <div className="task-workbench-list">
        {[
          ['Préinscription', 'Créer une demande fictive', 'Admissions'],
          ['Étudier le dossier', 'Vérifier les pièces justificatives', 'Étude'],
          ['Réinscription', 'Préparer un dossier de rentrée', 'Réinscription'],
          ['Affecter en classe', 'Attribuer une classe fictive', 'Affectation'],
          ['Transfert entrant', 'Importer un historique scolaire fictif', 'Transfert'],
          ['Certificat de scolarité', 'Préparer un document pour validation', 'Documents'],
        ].map(([title, detail, action]) => <div className="task-workbench-row" key={title}><div><strong>{title}</strong><small>{detail}</small></div><button className="button secondary small" onClick={() => { setNotice(`${title} enregistré(e) dans la session de démonstration.`); if (action === 'Admissions') setCandidates((value) => value + 1); if (action === 'Réinscription') setAdmissions((value) => Math.max(0, value - 1)); }}><Check size={13} />Simuler</button></div>)}
      </div>
      {notice && <div className="service-action-notice" role="status"><Check size={13} />{notice}</div>}
    </section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">À traiter aujourd’hui</h2><div className="panel-caption">Parcours d’admission, mise à jour et transfert · données de présentation</div></div><span className="status warn">3 dossiers à vérifier</span></div>{[['08:30', 'Vérifier une nouvelle candidature', 'Dossier incomplet · pièce d’identité à recevoir'], ['10:00', 'Préparer les réinscriptions', 'Classe de CM2 · année 2027–2028'], ['14:00', 'Classer un transfert entrant', 'Historique scolaire et documents requis']].map(([time, title, detail]) => <div className="day-step" key={title}><span>{time}</span><div><strong>{title}</strong><small>{detail}</small></div><ChevronRight size={14} /></div>)}</section>
  </div>;
}

function HrDashboard({ school, onNavigate }: { school: School; onNavigate: (view: ViewKey) => void }) {
  return <div className="role-dashboard finance-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Espace ressources humaines</span><h2>Une équipe bien accompagnée.</h2><p>{school.name} · données RH fictives</p></div><button className="button" onClick={() => onNavigate('hr')}>Ouvrir les dossiers RH <BriefcaseBusiness size={14} /></button></section>
    <div className="metrics"><Metric icon={Users} label="Personnel actif" value="38" change="Échantillon fictif" /><Metric icon={CalendarCheck} label="Présences du jour" value="34 / 38" change="Mise à jour de démonstration" /><Metric icon={FileText} label="Contrats à revoir" value="4" change="Échéances illustratives" /><Metric icon={Wallet} label="Cycle de paie" value="Préparation" change="Aucun salaire calculé ni versé" /></div>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Priorités RH</h2><div className="panel-caption">Recrutement · contrats · absences · formation</div></div><Clock3 size={17} /></div>{[['Cette semaine', 'Valider les demandes de congé', '3 demandes · validation hiérarchique simulée'], ['30 nov.', 'Mettre à jour les dossiers professionnels', 'Qualifications, affectations et disponibilités'], ['05 déc.', 'Préparer les variables de paie', 'Heures supplémentaires · contrôle avant clôture']].map(([date, title, detail]) => <div className="day-step" key={title}><span>{date}</span><div><strong>{title}</strong><small>{detail}</small></div><ChevronRight size={14} /></div>)}</section>
  </div>;
}

function MaternelleDashboard({ school, learners, onNavigate }: { school: School; learners: Learner[]; onNavigate: (view: ViewKey) => void }) {
  const present = learners.filter((learner) => learner.attendanceState === 'Présent').length;
  return <div className="institution-dashboard nursery-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">La journée des petits explorateurs</span><h2>Grandir, jouer, découvrir.</h2><p>{school.name} · observations et moments de la journée</p></div><div className="hero-sticker"><Sparkles size={24} /><span>Petits pas,<br />grands progrès</span></div></section>
    <div className="metrics"><Metric icon={Users} label="Petits explorateurs" value="186" change="Groupes petite, moyenne et grande section" /><Metric icon={Heart} label="Présents ce matin" value={`${present} / ${learners.length}`} change="Pointage de démonstration" /><Metric icon={Sparkles} label="Observations à partager" value="6" change="Repères pédagogiques fictifs" /></div>
    <div className="nursery-tiles"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Les temps forts du jour</h2><div className="panel-caption">Un rythme doux, des activités adaptées</div></div><Clock3 size={17} /></div>{[['08:30', 'Accueil & jeux libres', 'Les enfants s’installent à leur rythme'], ['10:00', 'Atelier couleurs', 'Explorer, nommer, créer'], ['11:30', 'Repas & repos', 'Un moment calme en groupe']].map(([time, title, detail]) => <div className="day-step" key={time}><span>{time}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</section>
      <section className="panel nursery-observations"><div className="panel-head"><div><h2 className="panel-title">Petites réussites</h2><div className="panel-caption">Suivis bienveillants · données fictives</div></div><GraduationCap size={17} /></div>{learners.slice(0, 3).map((learner) => <div className="list-row" key={learner.id}><div><strong>{learner.name}</strong><small>{learner.grade} · découverte et autonomie</small></div><span className="status good">{learner.academicSummary}</span></div>)}<button className="text-link" onClick={() => onNavigate('academics')}>Voir le parcours pédagogique <ChevronRight size={12} /></button></section>
    </div>
  </div>;
}

function PrimaryDashboard({ school, learners, syncs, onNavigate }: { school: School; learners: Learner[]; syncs: SyncOperation[]; onNavigate: (view: ViewKey) => void }) {
  const present = learners.filter((learner) => learner.attendanceState === 'Présent').length;
  return <div className="institution-dashboard primary-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Vue d’ensemble · cycle 2 & cycle 3</span><h2>Les apprentissages avancent.</h2><p>{school.name} · année {school.schoolYear}</p></div><button className="button" onClick={() => onNavigate('attendance')}>Faire l’appel <CalendarCheck size={14} /></button></section>
    <div className="metrics">
      <Metric icon={Users} label="Élèves inscrits" value="684" change="+ 12 dossiers ce mois-ci" />
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
  </div>;
}

function CollegeDashboard({ school, learners, onNavigate }: { school: School; learners: Learner[]; onNavigate: (view: ViewKey) => void }) {
  return <div className="institution-dashboard college-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Campus · cycle 4</span><h2>Le collège en mouvement.</h2><p>{school.name} · cours, projets et vie scolaire</p></div><button className="button secondary" onClick={() => onNavigate('academics')}>Voir les parcours <BookOpen size={14} /></button></section>
    <div className="metrics"><Metric icon={Users} label="Collégiens" value="842" change="4 niveaux · 18 classes" /><Metric icon={BookOpen} label="Cours aujourd’hui" value="26" change="Emploi du temps fictif" /><Metric icon={ShieldAlert} label="À accompagner" value="8" change="Repères de suivi pédagogique" /><Metric icon={CalendarCheck} label="Présence du jour" value="94%" change="Pointage de démonstration" /></div>
    <div className="college-grid"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Prochains cours</h2><div className="panel-caption">Aujourd’hui · planning indicatif</div></div><CalendarDays size={17} /></div>{[['09:00', 'Français', '5e A · Salle 12'], ['10:30', 'Sciences', '4e B · Laboratoire'], ['14:00', 'Histoire-géographie', '3e A · Salle 8']].map(([time, subject, detail]) => <div className="day-step" key={time}><span>{time}</span><div><strong>{subject}</strong><small>{detail}</small></div><ChevronRight size={14} /></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Suivi des classes</h2><div className="panel-caption">Quelques profils fictifs</div></div><button className="text-link" onClick={() => onNavigate('learners')}>Répertoire</button></div>{learners.slice(0, 4).map((learner) => <div className="list-row" key={learner.id}><div><strong>{learner.grade}</strong><small>{learner.name} · progrès du trimestre</small></div><StatusBadge value={learner.academicSummary} /></div>)}</section>
    </div>
  </div>;
}

function LyceeDashboard({ school, learners, onNavigate }: { school: School; learners: Learner[]; onNavigate: (view: ViewKey) => void }) {
  return <div className="institution-dashboard lycee-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Lycée · parcours & orientation</span><h2>Construire la suite.</h2><p>{school.name} · accompagnement vers les examens et l’après-bac</p></div><div className="exam-countdown"><span>Prochaine étape</span><strong>J − 24</strong><small>Évaluations du trimestre</small></div></section>
    <div className="metrics"><Metric icon={Users} label="Lycéens" value="1 246" change="Seconde, première, terminale" /><Metric icon={FileBarChart2} label="Évaluations à venir" value="12" change="Calendrier de démonstration" /><Metric icon={GraduationCap} label="Parcours d’orientation" value="86%" change="Étapes complétées · exemple" /><Metric icon={CalendarCheck} label="Présence du jour" value="96%" change="Données indicatives" /></div>
    <div className="lycee-grid"><section className="panel exam-panel"><div className="panel-head"><div><h2 className="panel-title">Échéances du trimestre</h2><div className="panel-caption">Se préparer, étape par étape</div></div><CalendarDays size={17} /></div>{[['24 nov.', 'Évaluations de mi-trimestre', 'Toutes classes'], ['04 déc.', 'Conseils de classe', 'Première & terminale'], ['18 déc.', 'Clôture du trimestre', 'Bulletins de démonstration']].map(([date, title, detail]) => <div className="day-step" key={date}><span>{date}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Repères de parcours</h2><div className="panel-caption">Suivi fictif · pas de classement individuel</div></div><button className="text-link" onClick={() => onNavigate('academics')}>Programmes</button></div>{learners.slice(0, 3).map((learner) => <div className="list-row" key={learner.id}><div><strong>{learner.grade}</strong><small>Évaluations & projet d’orientation</small></div><StatusBadge value={learner.academicSummary} /></div>)}<div className="role-note">Les résultats de cette maquette sont fictifs.</div></section>
    </div>
  </div>;
}

function UniversityDashboard({ school, onNavigate }: { school: School; onNavigate: (view: ViewKey) => void }) {
  return <div className="institution-dashboard university-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Université · année académique {school.schoolYear}</span><h2>Un campus, mille trajectoires.</h2><p>{school.name} · programmes, unités d’enseignement et vie de campus</p></div><button className="button" onClick={() => onNavigate('academics')}>Explorer les programmes <BookOpen size={14} /></button></section>
    <div className="university-summary"><div className="university-stat"><span>Étudiants inscrits</span><strong>2 480</strong><small>Profils de démonstration</small></div><div className="university-stat"><span>Crédits suivis</span><strong>30 <i>ECTS</i></strong><small>Semestre en cours</small></div><div className="university-stat"><span>Unités d’enseignement</span><strong>64</strong><small>Licence & master</small></div><div className="university-stat"><span>Stages à suivre</span><strong>12</strong><small>Jalons illustratifs</small></div></div>
    <div className="campus-grid"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Facultés & programmes</h2><div className="panel-caption">Catalogue académique de démonstration</div></div><Library size={17} /></div>{[['Sciences humaines', 'Licence · 3 années'], ['Économie & gestion', 'Licence · Master'], ['Sciences de l’éducation', 'Master · parcours professionnel']].map(([name, detail], index) => <div className="faculty-card" key={name}><span>0{index + 1}</span><div><strong>{name}</strong><small>{detail}</small></div><ChevronRight size={14} /></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Vie de campus</h2><div className="panel-caption">Rendez-vous à venir</div></div><CalendarDays size={17} /></div>{[['Aujourd’hui · 14:00', 'Séminaire de recherche'], ['Demain · 10:30', 'Inscriptions pédagogiques'], ['Jeudi · 16:00', 'Atelier stages & carrières']].map(([time, title]) => <div className="day-step" key={title}><span>{time}</span><div><strong>{title}</strong><small>Agenda universitaire · exemple</small></div></div>)}</section>
    </div>
  </div>;
}

function BuyerDashboard({ school, onNavigate, onAction }: { school: School; onNavigate: (view: ViewKey) => void; onAction: (action: string) => void }) {
  const defaultHourlyCost = school.currency === 'EUR' ? 18 : school.currency === 'MAD' ? 75 : 4000;
  const defaultMonthlyLicense = school.currency === 'EUR' ? 900 : school.currency === 'MAD' ? 9000 : 180000;
  const [hoursSavedWeekly, setHoursSavedWeekly] = useState(32);
  const [hourlyCost, setHourlyCost] = useState(defaultHourlyCost);
  const [monthlyLicense, setMonthlyLicense] = useState(defaultMonthlyLicense);
  const [pilotStarted, setPilotStarted] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const currencyFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: school.currency, maximumFractionDigits: 0 });
  const annualTimeValue = Math.round(hoursSavedWeekly * hourlyCost * 4.33 * 12);
  const annualLicenseCost = monthlyLicense * 12;
  const estimatedNetValue = annualTimeValue - annualLicenseCost;
  const adopt = (action: string) => {
    onAction(`Étude d’adoption · ${action}`);
  };
  const toggleChecklistItem = (item: string) => {
    setCheckedItems((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  };
  return <div className="buyer-dashboard">
    <section className="buyer-hero">
      <div className="buyer-hero-copy"><span>PARCOURS DÉCIDEUR · ÉVALUATION D’ACHAT</span><h2>Une décision éclairée, avant tout engagement.</h2><p>{school.name} · explorez la valeur, le périmètre et les conditions d’un pilote EduCore.</p></div>
      <div className="buyer-hero-actions"><button className="button buyer-primary" onClick={() => { setPilotStarted(true); adopt('pilote de démonstration préparé'); }}><Check size={14} />{pilotStarted ? 'Pilote préparé' : 'Préparer un pilote de 30 jours'}</button><small>Aucune souscription ni prise de contact réelle n’est déclenchée.</small></div>
    </section>
    {pilotStarted && <div className="buyer-confirmation" role="status"><ShieldCheck size={16} /><span><strong>Cadre de pilote créé dans cette session.</strong> Choisissez les équipes, les données fictives et les indicateurs à évaluer avec votre établissement.</span><button className="text-link" onClick={() => setChecklistOpen(true)}>Voir la checklist</button></div>}
    <section className="buyer-proof-strip"><div><strong>Un seul environnement</strong><span>Administration, pédagogie et vie scolaire</span></div><div><strong>Des accès par fonction</strong><span>Chaque équipe retrouve son espace métier</span></div><div><strong>Un pilote mesurable</strong><span>Critères de succès définis avec vos équipes</span></div></section>
    <div className="buyer-section-heading"><div><span>01 · DÉMONSTRATION MÉTIER</span><h3>Vérifiez les parcours qui comptent pour vous</h3></div><p>Ouvrez les vues réelles de la maquette. Les données restent fictives.</p></div>
    <div className="buyer-tour-grid">
      {[{ title: 'Admissions & dossiers', detail: 'Inscription, dossier apprenant et carte scolaire.', view: 'learners' as ViewKey, icon: Users, color: 'green' }, { title: 'Pédagogie & résultats', detail: 'Cours, évaluations, examens et parcours.', view: 'academics' as ViewKey, icon: GraduationCap, color: 'blue' }, { title: 'Finances & caisse', detail: 'Frais, échéances et suivi des encaissements.', view: 'finance' as ViewKey, icon: Wallet, color: 'gold' }, { title: 'Personnel & organisation', detail: 'Équipe, rôles, ressources et configuration.', view: 'hr' as ViewKey, icon: BriefcaseBusiness, color: 'purple' }].map(({ title, detail, view, icon: Icon, color }) => <button className="buyer-tour-card" key={title} onClick={() => onNavigate(view)}><span className={`buyer-tour-icon ${color}`}><Icon size={18} /></span><span className="buyer-tour-copy"><strong>{title}</strong><small>{detail}</small></span><ChevronRight size={15} /></button>)}
    </div>
    <div className="buyer-decision-grid">
      <section className="panel buyer-roi-panel"><div className="panel-head"><div><span className="buyer-section-kicker">02 · ESTIMATION PERSONNALISABLE</span><h3 className="panel-title">Quel potentiel pour mon établissement ?</h3><div className="panel-caption">Remplacez les hypothèses par vos propres chiffres avant toute décision.</div></div><ChartNoAxesCombined size={18} /></div>
        <div className="buyer-input-grid">
          <label className="buyer-input"><span>Heures administratives potentiellement récupérées / semaine</span><div><input type="range" min="0" max="120" step="4" value={hoursSavedWeekly} onChange={(event) => setHoursSavedWeekly(Number(event.target.value))} /><strong>{hoursSavedWeekly} h</strong></div></label>
          <label className="buyer-input"><span>Coût horaire chargé estimé ({school.currency})</span><input type="number" min="0" step="100" value={hourlyCost} onChange={(event) => setHourlyCost(Math.max(0, Number(event.target.value) || 0))} /></label>
          <label className="buyer-input"><span>Budget mensuel logiciel à tester ({school.currency})</span><input type="number" min="0" step="1000" value={monthlyLicense} onChange={(event) => setMonthlyLicense(Math.max(0, Number(event.target.value) || 0))} /></label>
        </div>
        <div className="buyer-roi-results"><div><span>Valeur annuelle du temps estimée</span><strong>{currencyFormat.format(annualTimeValue)}</strong></div><div><span>Coût annuel saisi</span><strong>{currencyFormat.format(annualLicenseCost)}</strong></div><div className={estimatedNetValue >= 0 ? 'positive' : 'negative'}><span>Écart indicatif avant coûts de déploiement</span><strong>{currencyFormat.format(estimatedNetValue)}</strong></div></div>
        <p className="buyer-roi-disclaimer">Simulation d’hypothèses, pas une promesse d’économie ni un devis. Le temps réellement récupéré doit être mesuré en pilote ; formation, migration, support et coûts d’intégration ne sont pas inclus.</p>
        <button className="text-link" onClick={() => { adopt('hypothèses de valeur enregistrées'); }}>Enregistrer ces hypothèses dans le fil de démonstration <ChevronRight size={13} /></button>
      </section>
      <section className="panel buyer-checklist-panel"><div className="panel-head"><div><span className="buyer-section-kicker">03 · DÉPLOIEMENT RESPONSABLE</span><h3 className="panel-title">Ce qu’un acheteur doit vérifier</h3><div className="panel-caption">Une checklist honnête, pas un faux badge de conformité.</div></div><ShieldCheck size={18} /></div>
        <div className="buyer-checklist">{[['fit', 'Adéquation métier', 'Cycles, langues, calendriers et règles nationales'], ['data', 'Données & propriété', 'Hébergement, sauvegardes, export et suppression'], ['security', 'Sécurité & accès', 'Authentification, rôles, audit et protection des mineurs'], ['support', 'Exploitation', 'Formation, assistance, disponibilité et reprise'], ['cost', 'Coût complet', 'Tarification, migration, matériel et connectivité']].map(([id, title, detail]) => <label className="buyer-check-row" key={id}><input type="checkbox" checked={checkedItems.includes(id)} onChange={() => toggleChecklistItem(id)} /><span><strong>{title}</strong><small>{detail}</small></span></label>)}</div>
        <button className="button secondary small buyer-checklist-toggle" onClick={() => { setChecklistOpen((open) => !open); adopt('revue de déploiement ouverte'); }}>{checklistOpen ? 'Masquer la préparation du pilote' : 'Préparer les questions du pilote'} <ChevronRight size={13} /></button>
        {checklistOpen && <div className="buyer-pilot-note"><strong>À valider avant tout déploiement réel</strong><p>Définir un établissement pilote, un responsable de chaque équipe, des données de test, une durée, des objectifs mesurables et les conditions de réversibilité.</p><span>{checkedItems.length} / 5 points examinés · progression locale à la session</span></div>}
      </section>
    </div>
    <section className="buyer-next-step"><div><span>PROCHAINE ÉTAPE</span><h3>Évaluez EduCore sur un périmètre limité.</h3><p>Commencez par un établissement et quelques équipes volontaires. Comparez les indicateurs avant/après et décidez ensuite.</p></div><button className="button" onClick={() => { setPilotStarted(true); setChecklistOpen(true); adopt('plan de pilote consulté'); }}>Construire mon plan de pilote <ArrowUpRight size={14} /></button></section>
    <div className="buyer-trust-note"><LockKeyhole size={14} /><span>Cette démo ne collecte aucune demande d’achat, ne crée pas de contrat et ne prouve pas la conformité juridique ou technique du futur service.</span></div>
  </div>;
}

function MultiCycleDashboard({ school, onNavigate }: { school: School; onNavigate: (view: ViewKey) => void }) {
  return <div className="institution-dashboard multi-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Pilotage multi-cycles · tous les parcours</span><h2>Une vision pour chaque cycle.</h2><p>{school.name} · indicateurs consolidés de démonstration</p></div><button className="button secondary" onClick={() => onNavigate('learners')}>Voir les dossiers <Users size={14} /></button></section>
    <div className="cycle-grid">{[['Maternelle', '186', 'Découverte & autonomie', 'cycle-nursery'], ['Primaire', '684', 'Cycles 2 & 3', 'cycle-primary'], ['Collège', '842', 'Cycles 3 & 4', 'cycle-college'], ['Lycée', '1 246', 'Examens & orientation', 'cycle-lycee']].map(([name, count, detail, theme]) => <button className={`cycle-card ${theme}`} key={name} onClick={() => onNavigate('academics')}><span>{name}</span><strong>{count}</strong><small>{detail}</small><ChevronRight size={15} /></button>)}</div>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Priorités de coordination</h2><div className="panel-caption">Repères entre les équipes pédagogiques</div></div><Activity size={17} /></div>{[['Passage de cycle', 'Accompagnement des changements de niveau'], ['Calendrier commun', 'Temps forts et périodes de l’année'], ['Suivi des familles', 'Continuité de communication entre cycles']].map(([title, detail], index) => <div className="list-row" key={title}><div className="activity-symbol">{index + 1}</div><div><strong>{title}</strong><small>{detail}</small></div><StatusBadge value="À suivre" /></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Vue consolidée</h2><div className="panel-caption">Données de présentation uniquement</div></div><ChartNoAxesCombined size={17} /></div><Metric icon={Users} label="Profils fictifs suivis" value="2 958" change="Répartis par cycle · valeurs indicatives" /><button className="text-link" onClick={() => onNavigate('settings')}>Configurer les repères <ChevronRight size={12} /></button></section></div>
  </div>;
}

function TeacherDashboard({ school, learners, onNavigate }: { school: School; learners: Learner[]; onNavigate: (view: ViewKey) => void }) {
  const present = learners.filter((learner) => learner.attendanceState === 'Présent').length;
  return <div className="role-dashboard teacher-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Espace enseignant · Cycle 3</span><h2>Bonjour, Ibrahima.</h2><p>{school.name} · votre classe et vos apprentissages du jour</p></div><button className="button" onClick={() => onNavigate('attendance')}>Faire l’appel <CalendarCheck size={14} /></button></section>
    <div className="metrics"><Metric icon={Users} label="Élèves de votre classe" value={String(learners.length)} change="Accès limité à votre groupe" /><Metric icon={Check} label="Présents aujourd’hui" value={`${present} / ${learners.length}`} change="Pointage de votre classe" /><Metric icon={BookOpen} label="Séquences actives" value="3" change="Contenus pédagogiques fictifs" /></div>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Ma classe · Cycle 3</h2><div className="panel-caption">Pas d’accès aux finances ou aux autres classes</div></div><button className="text-link" onClick={() => onNavigate('learners')}>Ma liste</button></div><LearnerTable learners={learners.slice(0, 5)} compact teacherMode /></section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Mon programme du jour</h2><div className="panel-caption">Planning pédagogique fictif</div></div><CalendarDays size={17} /></div>{[['08:30', 'Accueil & présence'], ['10:00', 'Français · compréhension'], ['14:00', 'Sciences · observer le vivant']].map(([time, title]) => <div className="day-step" key={time}><span>{time}</span><div><strong>{title}</strong><small>Cycle 3 · salle de classe</small></div></div>)}</section></div>
  </div>;
}

function FinanceDashboard({ school, onNavigate }: { school: School; onNavigate: (view: ViewKey) => void }) {
  return <div className="role-dashboard finance-dashboard">
    <section className="school-hero"><div><span className="school-hero-kicker">Espace gestion · suivi administratif</span><h2>Les chiffres de votre établissement.</h2><p>{school.name} · synthèse financière fictive</p></div><button className="button" onClick={() => onNavigate('finance')}>Ouvrir les finances <Wallet size={14} /></button></section>
    <div className="metrics"><Metric icon={Coins} label="Montant à recevoir" value={school.currency === 'EUR' ? '€ 8 450' : school.currency === 'MAD' ? 'د.م. 84 500' : '1 240 000 XOF'} change="Échéances fictives de la période" /><Metric icon={CreditCard} label="Encaissements simulés" value={school.currency === 'EUR' ? '€ 24 680' : '3 860 000'} change="Aucune transaction réelle" /><Metric icon={FileText} label="Factures ouvertes" value="18" change="Exemples de dossiers" /><Metric icon={BriefcaseBusiness} label="Équipe à suivre" value="4" change="Accès limité à cet établissement" /></div>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">À traiter</h2><div className="panel-caption">Actions administratives de démonstration</div></div><Clock3 size={17} /></div>{[['25 nov.', 'Échéances de frais scolaires', 'À vérifier'], ['30 nov.', 'Pièces justificatives', '3 dossiers'], ['05 déc.', 'Rapport de période', 'Brouillon']].map(([date, title, status]) => <div className="day-step" key={title}><span>{date}</span><div><strong>{title}</strong><small>{status}</small></div></div>)}</section>
      <section className="panel finance-shortcuts"><div className="panel-head"><div><h2 className="panel-title">Mes outils</h2><div className="panel-caption">Raccourcis selon votre rôle</div></div><Settings2 size={17} /></div><button className="shortcut-card" onClick={() => onNavigate('finance')}><CreditCard size={17} /><span><strong>Suivi des frais</strong><small>Factures et échéances</small></span><ChevronRight size={14} /></button><button className="shortcut-card" onClick={() => onNavigate('hr')}><BriefcaseBusiness size={17} /><span><strong>Ressources humaines</strong><small>Présences et dossiers équipe</small></span><ChevronRight size={14} /></button></section></div>
  </div>;
}

function Metric({ icon: Icon, label, value, change }: { icon: LucideIcon; label: string; value: string; change: string }) {
  return <div className="metric"><div className="metric-top"><span>{label}</span><Icon className="metric-icon" size={16} /></div><div className="metric-value">{value}</div><div className="metric-change">{change}</div></div>;
}

function LearnerTable({ learners, compact = false, teacherMode = false, onCreateCard }: { learners: Learner[]; compact?: boolean; teacherMode?: boolean; onCreateCard?: (id: number) => void }) {
  if (!learners.length) return <div className="empty-state"><strong>Aucun profil correspondant</strong>Essayez une autre recherche ou ajoutez un dossier démo.</div>;
  return <div className="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th>{!compact && !teacherMode && <th>Responsable</th>}<th>Présence</th>{!teacherMode && <th>Situation</th>}{!compact && onCreateCard && <th>Action</th>}</tr></thead><tbody>{learners.map((learner) => <tr key={learner.id} data-testid={`row-learner-${learner.id}`}><td><div className="student-cell"><div className="avatar">{learner.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><strong>{learner.name}</strong><small>{teacherMode ? 'Votre classe · profil démo' : `Dossier démo · #${learner.id}`}</small></div></div></td><td>{learner.grade}</td>{!compact && !teacherMode && <td>{learner.guardian}</td>}<td><StatusBadge value={learner.attendanceState} /></td>{!teacherMode && <td><StatusBadge value={learner.feeStatus} /></td>}{!compact && onCreateCard && <td><button className="button secondary small" onClick={() => onCreateCard(learner.id)}><IdCard size={13} />Prévisualiser la carte</button></td>}</tr>)}</tbody></table></div>;
}
function StatusBadge({ value }: { value: string }) {
  const kind = value === 'Présent' || value === 'Présente' || value === 'À jour' || value === 'Très bien' || value === 'Démontré' ? 'good' : value === 'Absent' || value === 'Impayé' ? 'bad' : 'warn';
  return <span className={`status ${kind}`}>{value}</span>;
}

function LearnerView({ learners, query, setQuery, onAdd, onCreateCard, onExport, teacherMode = false }: { learners: Learner[]; query: string; setQuery: (value: string) => void; onAdd?: () => void; onCreateCard?: (id: number) => void; onExport: () => void; teacherMode?: boolean }) {
  const [selectedClass, setSelectedClass] = useState('Toutes les classes');
  const [page, setPage] = useState(1);
  const classes = ['Toutes les classes', ...Array.from(new Set(learners.map((learner) => learner.grade)))];
  const filtered = learners.filter((learner) => selectedClass === 'Toutes les classes' || learner.grade === selectedClass);
  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <section className="panel"><div className="panel-head"><div><h2 className="panel-title">{teacherMode ? 'Mes classes · Cycle 2 & Cycle 3' : 'Répertoire des élèves'}</h2><div className="panel-caption">{filtered.length} profil(s) · {teacherMode ? '5 classes et 3 matières sous ma responsabilité' : 'dans cet établissement'}</div></div><div className="toolbar"><select className="select-control" value={selectedClass} onChange={(event) => { setSelectedClass(event.target.value); setPage(1); }} aria-label="Filtrer par classe">{classes.map((grade) => <option key={grade}>{grade}</option>)}</select><div className="search"><Search size={14} /><input aria-label="Rechercher un élève" placeholder="Nom, classe…" value={query} onChange={(event) => setQuery(event.target.value)} data-testid="input-search-learners" /></div><button className="button secondary" onClick={onExport}><Download size={14} />Exporter CSV</button>{onAdd && <button className="button" onClick={onAdd}><Plus size={14} />Ajouter</button>}</div></div>
    {teacherMode && <div className="metrics"><Metric icon={Users} label="Mes élèves" value={String(learners.length)} change="Sur l’ensemble de mes classes" /><Metric icon={BookOpen} label="Mes matières" value="3" change="Mathématiques · Français · Sciences" /><Metric icon={CalendarCheck} label="Classes chargées" value="5" change="CM1 A/B · CM2 A/B · CE2 A" /><Metric icon={Clock3} label="Saisie du jour" value="À faire" change="Présences et appréciations" /></div>}
    <LearnerTable learners={paginated} teacherMode={teacherMode} onCreateCard={onCreateCard} />
    {filtered.length > pageSize && <div className="toolbar" style={{ justifyContent: 'flex-end', marginTop: 12 }}><button className="button secondary small" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Précédent</button><span className="status good">Page {currentPage} / {pageCount}</span><button className="button secondary small" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Suivant</button></div>}
  </section>;
}

function AttendanceView({ learners, onToggle, onExport, teacherMode = false }: { learners: Learner[]; onToggle: (id: number) => void; onExport: () => void; teacherMode?: boolean }) {
  const [selectedClass, setSelectedClass] = useState('Toutes les classes');
  const classes = ['Toutes les classes', ...Array.from(new Set(learners.map((learner) => learner.grade)))];
  const filtered = learners.filter((learner) => selectedClass === 'Toutes les classes' || learner.grade === selectedClass);
  return <><div className="metrics"><Metric icon={Check} label="Présents" value={`${learners.filter((l) => l.attendanceState === 'Présent').length}`} change="Pointage saisi dans la démo" /><Metric icon={Clock3} label="Retards" value={`${learners.filter((l) => l.attendanceState === 'En retard').length}`} change="À vérifier avec l’équipe" /><Metric icon={UserRound} label="Absences" value={`${learners.filter((l) => l.attendanceState === 'Absent').length}`} change="Suivi de la journée" /><Metric icon={WifiOff} label="File locale" value="Disponible" change="Mode hors ligne simulable" /></div>
     <section className="panel"><div className="panel-head"><div><h2 className="panel-title">{teacherMode ? 'Présences de mes classes' : 'Registre des présences · aujourd’hui'}</h2><div className="panel-caption">{filtered.length} élèves affichés · touchez le statut pour mettre à jour la session.</div></div><div className="toolbar">{teacherMode && <select className="select-control" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} aria-label="Sélectionner une classe">{classes.map((grade) => <option key={grade}>{grade}</option>)}</select>}<button className="button secondary small" onClick={onExport}><Download size={13} />Exporter le pointage</button><span className="status good">Aujourd’hui · 08:15</span></div></div><div className="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th>{!teacherMode && <th>Responsable</th>}<th>Pointage</th><th>Action rapide</th></tr></thead><tbody>{filtered.map((learner) => <tr key={learner.id}><td><div className="student-cell"><div className="avatar">{learner.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><strong>{learner.name}</strong></div></td><td>{learner.grade}</td>{!teacherMode && <td>{learner.guardian}</td>}<td><StatusBadge value={learner.attendanceState} /></td><td><button className={`state-toggle ${learner.attendanceState === 'Présent' ? 'on' : ''}`} onClick={() => onToggle(learner.id)} data-testid={`toggle-attendance-${learner.id}`}>{learner.attendanceState === 'Présent' ? 'Marquer absent' : 'Marquer présent'}</button></td></tr>)}</tbody></table></div></section>
    <div className="role-note" style={{ marginTop: 14 }}><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Démonstration de parcours hors ligne uniquement. Aucune synchronisation réseau ni garantie de sécurité réelle n’est configurée.</div>
  </>;
}

function ArchiveView({ documents, school, role, onArchive }: { documents: ArchivedDocument[]; school: School; role: string; onArchive: (category: string, title: string, summary: string, format: ArchivedDocument['format'], folderName?: string) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Toutes les catégories');
  const [academicYear, setAcademicYear] = useState('Toutes les années');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [previewId, setPreviewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFormat, setNewFormat] = useState<ArchivedDocument['format']>('PDF');
  const [feedback, setFeedback] = useState('');
  const canManageArchive = roleNavigation[role]?.includes('archive') ?? false;
  const roleDocuments = documents.filter((document) => document.visibleTo.includes(role));
  const folders = [...new Set(roleDocuments.map((document) => document.folderName))].sort((a, b) => a.localeCompare(b, 'fr'));
  const categories = [...new Set(roleDocuments.map((document) => document.category))].sort((a, b) => a.localeCompare(b, 'fr'));
  const archivableCategories = [...new Set(archiveTemplates.filter((item) => item.roles.includes(role) || ['Administrateur d’établissement', 'Directeur', 'Directeur de groupe scolaire'].includes(role)).map((item) => item.category))].sort((a, b) => a.localeCompare(b, 'fr'));
  const years = [...new Set(roleDocuments.map((document) => document.academicYear))].sort((a, b) => b.localeCompare(a));
  const filteredDocuments = roleDocuments.filter((document) =>
    (category === 'Toutes les catégories' || document.category === category) &&
    (academicYear === 'Toutes les années' || document.academicYear === academicYear) &&
    (!selectedFolder || document.folderName === selectedFolder) &&
    `${document.title} ${document.category} ${document.summary} ${document.owner}`.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')),
  );
  const createArchiveRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle.trim() || !newCategory) return;
    const folderName = newFolderName.trim() || archiveFolderForCategory(newCategory);
    onArchive(newCategory, newTitle.trim(), `Pièce classée depuis l’espace ${role} de ${school.name}.`, newFormat, folderName);
    setSelectedFolder(folderName);
    setFeedback(`« ${newTitle.trim()} » a été classé dans « ${folderName} ».`);
    setNewTitle('');
    setNewFolderName('');
  };
  const downloadDocumentSheet = (archivedDocument: ArchivedDocument) => {
    const body = [
      'FICHE DOCUMENTAIRE · ARCHIVES ÉDUSUITE',
      `Établissement : ${school.name}`,
      `Document : ${archivedDocument.title}`,
      `Dossier : ${archivedDocument.folderName}`,
      `Dossier créé par : ${archivedDocument.folderOwner}`,
      `Catégorie : ${archivedDocument.category}`,
      `Année académique : ${archivedDocument.academicYear}`,
      `Format de référence : ${archivedDocument.format}`,
      `Déposé le : ${archivedDocument.createdAt}`,
      `Déposé par : ${archivedDocument.owner}`,
      '',
      archivedDocument.summary,
      '',
      'Aperçu de démonstration. Ce fichier décrit la pièce archivée ; il ne remplace pas le document officiel.',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${body}`], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${archivedDocument.title.toLocaleLowerCase('fr').replace(/[^a-z0-9]+/g, '-')}-fiche-demo.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const preview = filteredDocuments.find((item) => item.id === previewId);

  return <div className="archive-workspace">
    <div className="metrics"><Metric icon={Archive} label="Documents accessibles" value={String(roleDocuments.length)} change={`Périmètre ${role} · ${school.name}`} /><Metric icon={Folder} label="Dossiers métiers" value={String(folders.length)} change="Classement organisé par service" /><Metric icon={CalendarDays} label="Années classées" value={String(years.length)} change="Historique académique de l’établissement" /><Metric icon={Building2} label="Établissement" value={school.educationType} change="Espace de démonstration dédié" /></div>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Retrouver un document</h2><div className="panel-caption">{filteredDocuments.length} résultat(s) · archives de {school.name} uniquement</div></div><Archive size={17} /></div>
      <div className="archive-folder-grid">
        <button className={`archive-folder-card ${selectedFolder === '' ? 'selected' : ''}`} onClick={() => setSelectedFolder('')}>
          <span className="archive-folder-art all"><FolderOpen size={24} /></span><span className="archive-folder-label"><strong>Tous les dossiers</strong><small>{roleDocuments.length} documents visibles</small></span>
        </button>
        {folders.map((folder) => {
          const folderDocuments = roleDocuments.filter((document) => document.folderName === folder);
          const creator = folderDocuments[0]?.folderOwner;
          return <button className={`archive-folder-card ${selectedFolder === folder ? 'selected' : ''}`} key={folder} onClick={() => setSelectedFolder(selectedFolder === folder ? '' : folder)}><span className="archive-folder-art"><Folder size={24} /></span><span className="archive-folder-label"><strong>{folder}</strong><small>{folderDocuments.length} document(s) · dossier créé par {creator}</small></span></button>;
        })}
      </div>
      <div className="archive-filters"><label className="search"><Search size={14} /><input aria-label="Rechercher dans les archives" placeholder="Titre, apprenant, catégorie…" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <select className="filter-select" aria-label="Filtrer par catégorie" value={category} onChange={(event) => setCategory(event.target.value)}><option>Toutes les catégories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <select className="filter-select" aria-label="Filtrer par année académique" value={academicYear} onChange={(event) => setAcademicYear(event.target.value)}><option>Toutes les années</option>{years.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      {filteredDocuments.length ? <div className="archive-list">{filteredDocuments.map((document) => <article className="archive-row" key={document.id}><div className="archive-file-icon"><FileText size={17} /></div><div className="archive-file-copy"><div className="archive-file-meta"><span>{document.folderName}</span><span>{document.academicYear}</span></div><strong>{document.title}</strong><small>{document.summary}</small><small>{document.category} · classé le {document.createdAt} par {document.owner} · {document.format}</small></div><div className="archive-actions"><button className="button secondary small" onClick={() => setPreviewId(previewId === document.id ? '' : document.id)}><Search size={13} />{previewId === document.id ? 'Fermer' : 'Aperçu'}</button><button className="button secondary small" onClick={() => downloadDocumentSheet(document)}><Download size={13} />Fiche .txt</button></div></article>)}</div> : <div className="empty-state"><strong>Aucun document trouvé</strong>Modifiez les filtres ou choisissez une autre période.</div>}
      {preview && <div className="archive-preview"><div className="panel-head"><div><h3 className="panel-title">Aperçu de la pièce</h3><div className="panel-caption">Fiche descriptive · format original annoncé : {preview.format}</div></div><button className="text-link" onClick={() => setPreviewId('')}>Fermer</button></div><h4>{preview.title}</h4><p>{preview.summary}</p><div className="archive-preview-meta"><span>{preview.category}</span><span>{preview.academicYear}</span><span>Déposé par {preview.owner}</span></div><div className="role-note">L’aperçu présente les métadonnées et le résumé de la pièce. Le document original n’est pas stocké dans cette démo.</div></div>}
    </section>
    {canManageArchive && <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Classer un document</h2><div className="panel-caption">Ajoutez une pièce de démonstration avec sa catégorie, son année et son format de référence.</div></div><Plus size={17} /></div>
      <form className="archive-create-form" onSubmit={createArchiveRecord}><div className="field"><label htmlFor="archive-title">Nom du document</label><input id="archive-title" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Ex. Résultats du semestre 1" required /></div>
        <div className="field"><label htmlFor="archive-folder">Dossier de classement</label><input id="archive-folder" list="archive-folder-suggestions" value={newFolderName} onChange={(event) => setNewFolderName(event.target.value)} placeholder={archiveFolderForCategory(newCategory || 'Documents')} /><datalist id="archive-folder-suggestions">{folders.map((folder) => <option key={folder} value={folder} />)}</datalist><small>Nommez un nouveau dossier ou choisissez un dossier existant.</small></div>
        <div className="field"><label htmlFor="archive-category">Catégorie</label><select id="archive-category" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} required><option value="">Choisir une catégorie</option>{(archivableCategories.length ? archivableCategories : categories).map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="field"><label htmlFor="archive-format">Format de référence</label><select id="archive-format" value={newFormat} onChange={(event) => setNewFormat(event.target.value as ArchivedDocument['format'])}><option>PDF</option><option>DOCX</option><option>XLSX</option></select></div>
        <button className="button" type="submit" disabled={!newTitle.trim() || !newCategory}><Archive size={14} />Classer dans l’archive</button>
      </form>
      {feedback && <div className="role-note archive-feedback"><Check size={14} />{feedback}</div>}
    </section>}
    <div className="role-note"><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Les pièces, les filtres et les droits d’accès sont simulés en mémoire. Chaque espace ne présente que les archives de l’établissement choisi et accessibles à la fonction de démonstration.</div>
  </div>;
}

function CardStudio({ learners, selectedLearnerId, onSelect, school, onPrintOne, onPrintAll }: { learners: Learner[]; selectedLearnerId: number; onSelect: (id: number) => void; school: School; onPrintOne: (id: number) => void; onPrintAll: () => void }) {
  const learner = learners.find((item) => item.id === selectedLearnerId) ?? learners[0];
  if (!learner) return <div className="empty-state"><strong>Aucun dossier disponible</strong>Ajoutez un apprenant avant de créer une carte de démonstration.</div>;

  return <div className="card-studio">
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Créer une carte scolaire</h2><div className="panel-caption">Les informations sont reprises automatiquement du dossier apprenant.</div></div><IdCard size={18} /></div>
      <div className="card-studio-controls"><div className="field"><label htmlFor="card-learner">Choisir un apprenant</label><select id="card-learner" value={learner.id} onChange={(event) => onSelect(Number(event.target.value))}>{learners.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.grade}</option>)}</select></div>
        <div className="card-studio-actions"><button className="button secondary" onClick={() => onPrintOne(learner.id)}><Printer size={14} />Imprimer cette carte</button><button className="button" onClick={onPrintAll}><Printer size={14} />Imprimer toutes les cartes ({learners.length})</button></div>
      </div>
    </section>
    <section className="panel card-preview-panel"><div className="panel-head"><div><h2 className="panel-title">Aperçu avant impression</h2><div className="panel-caption">Format paysage · les coordonnées du responsable ne sont jamais imprimées.</div></div><span className="status warn">Démo · non officielle</span></div>
      <StudentIdentityCard learner={learner} school={school} />
    </section>
    <div className="role-note"><ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Identifiant de démonstration uniquement. Cette carte n’est pas un justificatif officiel et ne comporte ni QR code d’authentification ni contrôle d’accès.</div>
  </div>;
}

function StudentIdentityCard({ learner, school, printCard = false }: { learner: Learner; school: School; printCard?: boolean }) {
  return <article className={`student-identity-card${printCard ? ' print-card' : ''}`} data-testid={`identity-card-${learner.id}`}>
    <div className="identity-card-top"><div className="identity-card-brand"><span className="identity-card-mark"><GraduationCap size={17} /></span><span>{school.name}</span></div><span className="identity-card-label">CARTE SCOLAIRE · DÉMO</span></div>
    <div className="identity-card-main"><div className="identity-card-portrait" aria-hidden="true">{learner.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="identity-card-details"><span className="identity-card-caption">APPRENANT</span><strong className="identity-card-name">{learner.name}</strong><span className="identity-card-grade">{learner.grade}</span>{learner.birthDate && <span className="identity-card-birth">Né(e) le {formatDate(learner.birthDate)}</span>}</div></div>
    <div className="identity-card-footer"><div><span>IDENTIFIANT DÉMO</span><strong>{schoolCardIdentifier(school, learner)}</strong></div><div><span>ANNÉE SCOLAIRE</span><strong>{school.schoolYear}</strong></div></div>
    <span className="identity-card-watermark">DÉMONSTRATION</span>
  </article>;
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('fr-FR').format(date);
}

function schoolCardIdentifier(school: School, learner: Learner) {
  return `EDU-${school.id.toUpperCase()}-${String(learner.id).padStart(6, '0')}`;
}

function downloadLearnerCsv(learners: Learner[], school: School) {
  downloadCsv(`apprenants-${school.id}.csv`, [
    ['Identifiant démo', 'Nom', 'Classe', 'Date de naissance', 'Présence'],
    ...learners.map((learner) => [schoolCardIdentifier(school, learner), learner.name, learner.grade, learner.birthDate ? formatDate(learner.birthDate) : '', learner.attendanceState]),
  ]);
}

function downloadAttendanceCsv(learners: Learner[], school: School) {
  downloadCsv(`presences-${school.id}.csv`, [
    ['Nom', 'Classe', 'Pointage du jour'],
    ...learners.map((learner) => [learner.name, learner.grade, learner.attendanceState]),
  ]);
}

function downloadCsv(filename: string, rows: string[][]) {
  const escapeCell = (value: string) => {
    const safeValue = /^[\u0000-\u0020]*[=+\-@]/.test(value) ? `'${value}` : value;
    return `"${safeValue.replace(/"/g, '""')}"`;
  };
  const csv = `\uFEFF${rows.map((row) => row.map(escapeCell).join(';')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
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
   </div><div className="two-col wide-panel">
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Cours, leçons & devoirs</h2><div className="panel-caption">Espace LMS · séquences et activités de démonstration</div></div><BookOpen size={16} color="#34745e" /></div>{[['Mathématiques · Fractions', 'Leçon publiée · ressources et exercices intégrés', 'Publié'], ['Français · Lecture suivie', 'Devoir individuel · échéance vendredi', 'À rendre'], ['Sciences · Le vivant', 'Correction et commentaire enseignant', 'En cours']].map(([title, detail, status]) => <div className="list-row" key={title}><div><strong>{title}</strong><small>{detail}</small></div><StatusBadge value={status} /></div>)}</section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Examens & certifications</h2><div className="panel-caption">Calendrier, candidats et publication · aperçu fictif</div></div><FileBarChart2 size={16} color="#34745e" /></div>{[['25 nov. · 09:00', 'Composition de mathématiques', 'Salle B12 · Surveillant affecté'], ['03 déc. · 08:30', 'Évaluation de fin de période', 'Saisie des résultats à venir'], ['18 déc.', 'Conseil & délibération', 'Validation avant publication']].map(([date, title, detail]) => <div className="day-step" key={title}><span>{date}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}<div className="role-note">Toute correction d’un résultat validé doit être autorisée, justifiée et auditée dans une version réelle.</div></section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Emploi du temps & ressources</h2><div className="panel-caption">Affectations et disponibilités · aperçu de planning</div></div><CalendarDays size={16} color="#34745e" /></div>{[['08:00', 'Français · CM2 A', 'Salle 4 · I. Kane'], ['10:15', 'Mathématiques · CM2 A', 'Salle 4 · I. Kane'], ['14:00', 'Sciences · laboratoire', 'Espace réservé · capacité vérifiée']].map(([time, title, detail]) => <div className="day-step" key={time}><span>{time}</span><div><strong>{title}</strong><small>{detail}</small></div><StatusBadge value="Planifié" /></div>)}</section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Bibliothèque pédagogique</h2><div className="panel-caption">Ressources partagées et droits d’utilisation</div></div><Library size={16} color="#34745e" /></div>{[['Référentiel de compétences', 'Établissement · équipe pédagogique'], ['Fiches de lecture · cycle 3', 'Mutualisé · réutilisation autorisée'], ['Support sciences · le vivant', 'Personnel · accès enseignant']].map(([title, detail]) => <div className="list-row" key={title}><div><strong>{title}</strong><small>{detail}</small></div><FileText size={14} color="#34745e" /></div>)}</section>
   </div><section className="panel wide-panel"><div className="panel-head"><div><h2 className="panel-title">Calendrier pédagogique</h2><div className="panel-caption">Jalons de l’année {school.schoolYear} · données de présentation</div></div><button className="button secondary small" onClick={() => setPreviewOpen((open) => !open)}><Download size={13} />Aperçu du bulletin</button></div><div className="two-col">{[['24 nov.', 'Évaluations de mi-trimestre'], ['04 déc.', 'Conseils de classe / échanges familles'], ['18 déc.', 'Fin du premier trimestre']].map(([date, label]) => <div className="list-row" key={date}><div><strong>{label}</strong><small>Calendrier de démonstration</small></div><span className="status warn">{date}</span></div>)}</div>{previewOpen && <div className="role-note" style={{ marginTop: 12 }}>Aperçu de bulletin fictif · les résultats sont des exemples et ne constituent pas un document scolaire.</div>}</section></>;
}

function FinanceView({ school, learners, onArchive }: { school: School; learners: Learner[]; onArchive: (category: string, title: string, summary: string, format?: ArchivedDocument['format']) => void }) {
  const [transactions, setTransactions] = useState<{ id: number; learner: string; amount: number; method: string; status: string }[]>([]);
  const [selectedLearner, setSelectedLearner] = useState(learners[0]?.name ?? '');
  const [amount, setAmount] = useState('25000');
  const [method, setMethod] = useState('Mobile Money');
  const [notice, setNotice] = useState('');
  const displayAmount = school.currency === 'EUR' ? '€ 8 450' : school.currency === 'MAD' ? 'د.م. 84 500' : '1 240 000 XOF';
  const exportPreview = () => {
    onArchive('Finance & comptabilité', `Situation des frais · ${school.schoolYear}`, `État fictif des échéances et paiements de ${learners.length} apprenants.`, 'XLSX');
  };
  const sendReminder = (learner: Learner) => onArchive('Communication & vie scolaire', `Rappel de frais · ${learner.name}`, `Brouillon de rappel non envoyé pour le dossier de ${learner.name}.`, 'PDF');
  const simulatePayment = () => {
    const numericAmount = Math.max(0, Number(amount) || 0);
    if (!numericAmount || !selectedLearner) return;
    setTransactions((items) => [{ id: Date.now(), learner: selectedLearner, amount: numericAmount, method, status: 'Confirmé' }, ...items]);
    setNotice(`Paiement simulé confirmé pour ${selectedLearner} · ${numericAmount.toLocaleString('fr-FR')} ${school.currency} · ${method}`);
  };
  return <><div className="metrics"><Metric icon={Coins} label="Montant à recevoir" value={displayAmount} change="Échéances fictives de la période" /><Metric icon={CreditCard} label="Encaissements simulés" value={school.currency === 'EUR' ? '€ 24 680' : '3 860 000'} change="Échantillon de données de démo" /><Metric icon={FileText} label="Factures ouvertes" value={String(18 + transactions.length)} change="Aucune transaction réelle" /><Metric icon={ArrowDownRight} label="Taux de suivi" value="76,4%" change="Indicateur illustratif" /></div>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Encaissement simulé</h2><div className="panel-caption">Aucun argent réel n’est utilisé</div></div><CreditCard size={18} /></div><div className="toolbar" style={{ flexWrap: 'wrap' }}>
      <select className="select-control" value={selectedLearner} onChange={(event) => setSelectedLearner(event.target.value)} aria-label="Apprenant facturé">{learners.map((learner) => <option key={learner.id}>{learner.name}</option>)}</select>
      <input className="select-control" type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} aria-label="Montant du paiement" />
      <select className="select-control" value={method} onChange={(event) => setMethod(event.target.value)}><option>Espèces</option><option>Virement</option><option>Carte</option><option>Mobile Money</option></select>
      <button className="button" onClick={simulatePayment}><Check size={13} />Confirmer le paiement simulé</button>
    </div>{notice && <div className="service-action-notice" role="status"><Check size={13} />{notice}</div>}
      {transactions.length > 0 && <div className="table-wrap" style={{ marginTop: 12 }}><table><thead><tr><th>Apprenant</th><th>Montant</th><th>Mode</th><th>Statut</th></tr></thead><tbody>{transactions.map((item) => <tr key={item.id}><td>{item.learner}</td><td>{item.amount.toLocaleString('fr-FR')} {school.currency}</td><td>{item.method}</td><td><StatusBadge value={item.status} /></td></tr>)}</tbody></table></div>}
    </section>
     <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Suivi des frais scolaires</h2><div className="panel-caption">Montants et statuts fictifs · devise {school.currency}</div></div><button className="button secondary small" onClick={exportPreview}><Download size={13} />Archiver l’aperçu</button></div><div className="table-wrap"><table><thead><tr><th>Élève</th><th>Classe</th><th>Échéance</th><th>Montant</th><th>Statut</th><th>Action</th></tr></thead><tbody>{learners.slice(0, 5).map((learner, index) => <tr key={learner.id}><td><div className="student-cell"><div className="avatar">{learner.name.slice(0, 1)}</div><strong>{learner.name}</strong></div></td><td>{learner.grade}</td><td>{['25 nov. 2026', '30 nov. 2026', '05 déc. 2026'][index % 3]}</td><td>{school.currency === 'EUR' ? '€ ' : ''}{(85000 + index * 12500).toLocaleString('fr-FR')} {school.currency !== 'EUR' ? school.currency : ''}</td><td><StatusBadge value={learner.feeStatus} /></td><td><button className="text-link" onClick={() => sendReminder(learner)}><MessageCircle size={12} /> Préparer un rappel</button></td></tr>)}</tbody></table></div></section>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Dépenses & validations</h2><div className="panel-caption">Fournisseurs, justificatifs et demandes fictifs</div></div><FileText size={16} color="#34745e" /></div>{[['Fournitures pédagogiques', 'Facture vérifiée · validation direction'], ['Maintenance des locaux', 'Justificatif en attente'], ['Transport scolaire', 'Budget de service · novembre']].map(([title, detail]) => <div className="list-row" key={title}><div><strong>{title}</strong><small>{detail}</small></div><StatusBadge value={title === 'Maintenance des locaux' ? 'À vérifier' : 'Aperçu'} /></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Budgets & comptabilité</h2><div className="panel-caption">Périmètre annuel et exports de démonstration</div></div><FileBarChart2 size={16} color="#34745e" /></div>{[['Budget annuel', 'Prévision et réalisé par établissement'], ['Journaux & écritures', 'Comptabilité générale et analytique'], ['Clôture & rapports', 'Balance · grand livre · états financiers']].map(([title, detail]) => <div className="list-row" key={title}><div><strong>{title}</strong><small>{detail}</small></div><StatusBadge value="Aperçu" /></div>)}</section></div>
    <div className="role-note" style={{ marginTop: 14 }}><CircleHelp size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Aucun moyen de paiement réel n’est connecté. Les montants ne sont ni facturés ni encaissés.</div>
  </>;
}

function CashierView({ school, learners, onArchive }: { school: School; learners: Learner[]; onArchive: (category: string, title: string, summary: string, format?: ArchivedDocument['format']) => void }) {
  const [recordedIds, setRecordedIds] = useState<number[]>([]);
  const pending = learners.filter((learner) => learner.feeStatus !== 'À jour' && !recordedIds.includes(learner.id));
  return <div className="role-dashboard">
    <div className="metrics"><Metric icon={Banknote} label="Caisse du jour" value={school.currency === 'EUR' ? '€ 1 240' : `1 240 000 ${school.currency}`} change="Montant fictif, aucune transaction réelle" /><Metric icon={Clock3} label="Paiements à rapprocher" value={String(pending.length)} change="Dossiers de démonstration" /><Metric icon={FileText} label="Reçus de démonstration" value={String(recordedIds.length)} change="Créés uniquement dans cette session" /></div>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Journal de caisse</h2><div className="panel-caption">Accès caissier limité · pas de dépenses, paie ou écritures comptables</div></div><span className="status warn">Simulation</span></div>
      {pending.length ? <div className="table-wrap"><table><thead><tr><th>Apprenant</th><th>Classe</th><th>Statut</th><th>Opération autorisée</th></tr></thead><tbody>{pending.map((learner) => <tr key={learner.id}><td>{learner.name}</td><td>{learner.grade}</td><td><StatusBadge value={learner.feeStatus} /></td><td><button className="state-toggle" onClick={() => { setRecordedIds((ids) => [...ids, learner.id]); onArchive('Finance & comptabilité', `Reçu de caisse · ${learner.name}`, `Reçu fictif préparé pour le dossier ${learner.name}. Aucun paiement réel reçu.`, 'PDF'); }}>{'Simuler un reçu'}</button></td></tr>)}</tbody></table></div> : <div className="empty-state"><strong>Aucun dossier à traiter</strong>Les reçus de la session sont archivés dans le journal de caisse.</div>}
    </section>
    <div className="role-note"><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Les opérations de caisse sont fictives. Aucun paiement, reçu réglementaire ou mouvement comptable n’est créé.</div>
  </div>;
}

function HrView({ onArchive }: { onArchive: (category: string, title: string, summary: string, format?: ArchivedDocument['format']) => void }) {
  const archiveStaff = () => onArchive('Paie & ressources humaines', 'Dossiers du personnel · export de démonstration', 'Liste synthétique des affectations et présences fictives.', 'XLSX');
  const archivePayroll = (title: string) => onArchive('Paie & ressources humaines', title, 'Document de paie de démonstration, sans valeur légale ni versement réel.', 'PDF');
  return <><div className="metrics"><Metric icon={Users} label="Effectif présenté" value="38" change="Échantillon fictif" /><Metric icon={CalendarCheck} label="Présences équipe" value="34" change="Mise à jour du jour" /><Metric icon={Wallet} label="Paie à préparer" value="38 fiches" change="Simulation uniquement" /><Metric icon={FileBarChart2} label="Dossiers à relire" value="4" change="Aucune donnée RH réelle" /></div>
    <div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Équipe de l’établissement</h2><div className="panel-caption">Présence indicative · données fictives</div></div><button className="button secondary small" onClick={archiveStaff}><Download size={13} />Archiver l’export</button></div>{staff.map((member) => <div className="list-row" key={member.name}><div className="student-cell"><div className="avatar">{member.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</div><div><strong>{member.name}</strong><small>{member.role} · {member.dept}</small></div></div><StatusBadge value={member.presence} /></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Repères de paie</h2><div className="panel-caption">Cycle mensuel · parcours démonstratif</div></div><Banknote size={17} color="#34745e" /></div><div className="list-row"><div><strong>Éléments variables à valider</strong><small>Heures supplémentaires · exemple</small></div><span className="status warn">3 éléments</span></div><div className="list-row"><div><strong>Bulletins de paie</strong><small>Prévisualisation sans valeur légale</small></div><button className="text-link" onClick={() => archivePayroll('Bulletin de salaire · aperçu du mois')}>Prévisualiser & archiver</button></div><div className="list-row"><div><strong>Exports de démonstration</strong><small>Aucun versement réel déclenché</small></div><button className="text-link" onClick={() => archivePayroll('État préparatoire de paie · mois courant')}>Préparer et archiver</button></div></section></div>
  </>;
}

function FamilyView({ children, school, guardianName, onAction }: { children: Learner[]; school: School; guardianName: string; onAction: (type: string) => void }) {
  const [feedback, setFeedback] = useState('');
  const [bulletinOpen, setBulletinOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id ?? 0);
  const [consentRequestOpen, setConsentRequestOpen] = useState(false);
  const child = children.find((item) => item.id === selectedChildId) ?? children[0];
  const adultLearner = school.educationType === 'Université';
  if (!child) return <div className="empty-state"><strong>Aucun enfant rattaché à ce compte</strong>Contactez l’établissement pour vérifier le rattachement familial.</div>;
  const request = (title: string, summary: string) => {
    setFeedback(`${title} : ${summary} Votre demande a été transmise dans cette démonstration.`);
    onAction(`Demande famille · ${title}`);
  };
  return <div className="family-dashboard">
    <section className="family-welcome"><div><span>PORTAIL FAMILLE · {school.name}</span><h2>Bonjour, {guardianName.split(' ')[0]}.</h2><p>Les informations utiles sur votre enfant, réunies au même endroit.</p></div><span className="family-shield"><ShieldCheck size={19} /> Accès famille</span></section>
    <section className="family-child-card"><div className="avatar">{child.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><span>{children.length > 1 ? `${children.length} enfants rattachés · profil consulté` : 'Mon enfant'}</span><strong>{child.name}</strong><small>{child.grade} · année {school.schoolYear}</small></div>{children.length > 1 && <label className="family-child-select"><span>Changer d’enfant</span><select aria-label="Choisir l’enfant à consulter" value={child.id} onChange={(event) => { setSelectedChildId(Number(event.target.value)); setBulletinOpen(false); setFeedback(''); }}>{children.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.grade}</option>)}</select></label>}<span className={`status ${child.attendanceState === 'Présent' ? 'good' : 'warn'}`}>{child.attendanceState} aujourd’hui</span></section>
    <div className="metrics"><Metric icon={GraduationCap} label={adultLearner ? 'Suivi académique' : 'Dernière appréciation'} value={adultLearner ? 'Accès sur autorisation' : child.academicSummary} change={adultLearner ? 'Consentement étudiant requis' : `${child.grade} · dernière période`} /><Metric icon={CalendarCheck} label="Assiduité" value={child.attendanceState} change="Pointage de la journée" /><Metric icon={CircleDollarSign} label={school.educationType === 'Université' ? 'Frais universitaires' : 'Frais de scolarité'} value={child.feeStatus} change="Situation indicative · démo" /></div>
    <div className="family-dashboard-grid">
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">{adultLearner ? 'Calendrier universitaire' : `Semaine de ${child.name.split(' ')[0]}`}</h2><div className="panel-caption">{adultLearner ? 'Horaires détaillés soumis au consentement de l’étudiant' : 'Cours et activités à venir'}</div></div><CalendarDays size={16} /></div>{adultLearner ? <div className="restricted-info"><LockKeyhole size={17} /><div><strong>Emploi du temps non partagé</strong><span>Le titulaire majeur doit autoriser l’accès aux informations académiques.</span><button className="text-link" onClick={() => { setConsentRequestOpen(true); request('Autorisation de suivi étudiant', 'Demande transmise à l’étudiant pour accord explicite.'); }}>Demander l’autorisation</button></div></div> : [['Lun. · 08:00', 'Accueil & lecture', child.grade], ['Mar. · 10:30', 'Mathématiques', 'Salle de classe'], ['Mer. · 14:00', 'Activité scolaire', 'Cour / bibliothèque'], ['Ven. · 16:00', 'Fin des cours', school.name]].map(([time, title, detail]) => <div className="day-step" key={time}><span>{time}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">{adultLearner ? 'Services étudiants' : 'Informations scolaires'}</h2><div className="panel-caption">{adultLearner ? `Informations administratives pour ${child.name}` : `Données concernant uniquement ${child.name}`}</div></div><BookOpen size={16} /></div><div className="list-row"><div><strong>{adultLearner ? 'Relevé de notes' : 'Bulletin de la période'}</strong><small>{adultLearner ? 'Résultats et crédits · accès restreint' : 'Résultats et appréciations · aperçu'}</small></div><button className="text-link" onClick={() => adultLearner ? request('Autorisation de consultation académique', 'Demande adressée à l’étudiant majeur.') : setBulletinOpen((open) => !open)}>{adultLearner ? 'Demander l’accès' : bulletinOpen ? 'Masquer' : 'Consulter'}</button></div>{bulletinOpen && !adultLearner && <div className="family-bulletin-preview"><strong>{child.grade} · appréciation générale</strong><p>{child.academicSummary}. Continuez à encourager la régularité et la participation en classe.</p><span>Document de démonstration · {school.schoolYear}</span></div>}<div className="list-row"><div><strong>{adultLearner ? 'Rendez-vous avec la faculté' : 'Prochaine rencontre familles'}</strong><small>Échange avec l’équipe pédagogique</small></div><button className="text-link" onClick={() => request('Rendez-vous', 'Demande transmise au service concerné.')}>Choisir un créneau</button></div><div className="list-row"><div><strong>Contact de l’établissement</strong><small>{adultLearner ? 'Scolarité / faculté' : 'Secrétariat · réponse pendant les heures ouvrables'}</small></div><button className="text-link" onClick={() => request('Message à l’établissement', 'Message destiné au service concerné.')}>Écrire</button></div><div className="family-request-actions"><button className="button secondary small" onClick={() => request('Justification d’absence', 'Une justification a été transmise pour examen.')}>Justifier une absence</button><button className="button secondary small" onClick={() => request('Autorisation de sortie', 'Demande d’autorisation soumise pour validation.')}>Demander une autorisation</button></div></section>
    </div>
    {feedback && <div className="role-note" role="status">{feedback}</div>}
    <section className="learner-privacy-note"><LockKeyhole size={15} /><span><strong>Accès limité à l’espace famille.</strong> {adultLearner ? 'Les notes, relevés et emplois du temps de l’étudiant majeur restent masqués tant qu’un consentement explicite n’est pas enregistré.' : 'Les données affichées sont limitées aux informations autorisées de cet enfant.'}</span></section>
    {consentRequestOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConsentRequestOpen(false); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="consent-title"><div className="modal-head"><div><div className="eyebrow">Autorisation familiale</div><h2 id="consent-title">Demande envoyée</h2></div><button className="icon-button" aria-label="Fermer" onClick={() => setConsentRequestOpen(false)}>×</button></div><p>Une demande d’accès aux informations académiques de {child.name} a été préparée. Dans un système réel, l’étudiant majeur devrait donner son accord explicite et révocable.</p><div className="modal-actions"><button className="button" onClick={() => setConsentRequestOpen(false)}>Compris</button></div></section></div>}
  </div>;
}

function LearnerPortal({ school, learner, onAction }: { school: School; learner: Learner; onAction: (type: string) => void }) {
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [bulletinOpen, setBulletinOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const submitWork = (title: string) => {
    if (submitted.includes(title)) return;
    setSubmitted((items) => [...items, title]);
    setFeedback(`Soumission enregistrée pour « ${title} » · ${learner.name}.`);
    onAction(`Soumission apprenant · ${title}`);
  };
  return <div className="learner-dashboard">
    <section className="learner-welcome"><div className="learner-avatar"><GraduationCap size={27} /></div><div><span>MON ESPACE APPRENANT · {school.name}</span><h2>Bonjour, {learner.name.split(' ')[0]} !</h2><p>{learner.grade} · année {school.schoolYear}</p></div><div className="learner-attendance"><Check size={15} />{learner.attendanceState === 'Présent' ? 'Présence confirmée' : learner.attendanceState}</div></section>
    <div className="learner-dashboard-grid"><section className="panel learner-panel"><div className="panel-head"><div><h2 className="panel-title">Mes apprentissages</h2><div className="panel-caption">Mes progrès · aperçu personnel</div></div><GraduationCap size={18} /></div>{[['Français', learner.academicSummary, 'Expression écrite · prochaine étape : lecture'], ['Mathématiques', learner.academicSummary === 'Très bien' ? 'Bien' : 'En progrès', 'Fractions · atelier de révision'], ['Sciences', 'En progrès', 'Le vivant · observation de la semaine']].map(([subject, result, detail]) => <div className="learning-card" key={subject}><div><strong>{subject}</strong><small>{detail}</small></div><span>{result}</span></div>)}
      <div className="learner-assignment"><div><strong>Devoir · Lecture suivie</strong><small>À remettre vendredi · réponse écrite</small></div><button className="button small" disabled={submitted.includes('Lecture suivie')} onClick={() => submitWork('Lecture suivie')}>{submitted.includes('Lecture suivie') ? 'Devoir remis' : 'Remettre'}</button></div>
      <div className="learner-assignment"><div><strong>Exercice · Fractions</strong><small>Entraînement individuel · 10 questions</small></div><button className="button secondary small" disabled={submitted.includes('Exercice Fractions')} onClick={() => submitWork('Exercice Fractions')}>{submitted.includes('Exercice Fractions') ? 'Exercice terminé' : 'Commencer'}</button></div>
    </section>
      <section className="panel learner-agenda"><div className="panel-head"><div><h2 className="panel-title">Mon emploi du temps · année en cours</h2><div className="panel-caption">{school.schoolYear} · {learner.grade}</div></div><CalendarDays size={18} /></div>{[
        ['Lundi · 08:00', 'Français', 'Salle 4 · Mme Cissé'],
        ['Lundi · 10:15', 'Mathématiques', 'Salle 4 · I. Kane'],
        ['Mardi · 08:30', 'Sciences', 'Laboratoire · Mme Sow'],
        ['Mercredi · 10:30', 'Lecture suivie', 'Bibliothèque'],
        ['Jeudi · 14:00', 'Arts & expression', 'Atelier créatif'],
        ['Vendredi · 08:30', 'Éducation civique', 'Salle 4'],
      ].map(([time, title, place]) => <div className="agenda-card" key={`${time}-${title}`}><span>{time}</span><strong>{title}</strong><small>{place}</small></div>)}</section></div>
    <div className="two-col">
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Mes documents</h2><div className="panel-caption">Bulletins, certificats et carte d’accès</div></div><FileText size={18} /></div>
        <div className="list-row"><div><strong>Bulletin · période 1</strong><small>{learner.academicSummary} · novembre 2026</small></div><button className="button secondary small" onClick={() => setBulletinOpen((open) => !open)}>{bulletinOpen ? 'Masquer' : 'Consulter'}</button></div>
        {bulletinOpen && <div className="family-bulletin-preview"><strong>{school.name}</strong><p><b>{learner.name}</b> · {learner.grade}<br />Français : 15/20 · Mathématiques : 14/20 · Sciences : 16/20<br />Appréciation : {learner.academicSummary}. Bonne participation et travail régulier.</p><span>Document de démonstration · année {school.schoolYear}</span></div>}
        <div className="list-row"><div><strong>Certificat de scolarité</strong><small>Année {school.schoolYear}</small></div><button className="button secondary small" onClick={() => setCertificateOpen((open) => !open)}>{certificateOpen ? 'Masquer' : 'Prévisualiser'}</button></div>
        {certificateOpen && <div className="family-bulletin-preview"><strong>CERTIFICAT DE SCOLARITÉ · DÉMONSTRATION</strong><p>Il est certifié que <b>{learner.name}</b> est régulièrement inscrit(e) en <b>{learner.grade}</b> à {school.name} pour l’année {school.schoolYear}. Ce document est fictif.</p></div>}
        <div className="list-row"><div><strong>Carte d’accès apprenant</strong><small>Identifiant fictif #{learner.id}</small></div><button className="button secondary small" onClick={() => setCardOpen((open) => !open)}>{cardOpen ? 'Masquer' : 'Afficher'}</button></div>
        {cardOpen && <div className="student-identity-card" style={{ marginTop: 12 }}><strong>{learner.name}</strong><p>{learner.grade}<br />#{learner.id} · {school.name}<br />Année {school.schoolYear}</p><span className="status warn">DÉMO · Non valide</span></div>}
      </section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Résultats de la période</h2><div className="panel-caption">Synthèse scolaire consultable</div></div><ChartNoAxesCombined size={18} /></div>{[
        ['Français', '15/20', 'Bien'], ['Mathématiques', '14/20', learner.academicSummary], ['Sciences', '16/20', 'Très bien'], ['Éducation civique', '14/20', 'Bien'],
      ].map(([subject, mark, result]) => <div className="list-row" key={subject}><div><strong>{subject}</strong><small>Évaluation du trimestre 1</small></div><div style={{ textAlign: 'right' }}><strong>{mark}</strong><br /><StatusBadge value={result} /></div></div>)}</section>
    </div>
    {feedback && <div className="role-note" role="status">{feedback}</div>}
    <section className="learner-privacy-note"><LockKeyhole size={15} /><span><strong>Votre espace personnel.</strong> Il présente vos cours, résultats, devoirs et activités.</span></section>
  </div>;
}

function ServicesView({ modules: available, onAction, onArchive, canArchive }: { modules: typeof modules; onAction: (type: string) => void; onArchive: (category: string, title: string, summary: string, format?: ArchivedDocument['format'], folderName?: string) => void; canArchive: boolean }) {
  return <><div className="panel" style={{ marginBottom: 14 }}><div className="panel-head" style={{ marginBottom: 0 }}><div><h2 className="panel-title">Un quotidien coordonné</h2><div className="panel-caption">Modules affichés selon le profil d’établissement sélectionné.</div></div><span className="status good">{available.length} services activés</span></div></div>
    {available.length ? <div className="service-workspace-grid">{available.map((module) => <ServiceModuleWorkspace key={module.name} module={module} onAction={onAction} onArchive={onArchive} canArchive={canArchive} />)}</div> : <div className="empty-state"><strong>Aucun service activé pour ce profil</strong>Choisissez un autre environnement de démonstration.</div>}
  </>;
}

function ServiceModuleWorkspace({ module, onAction, onArchive, canArchive }: { module: (typeof modules)[number]; onAction: (type: string) => void; onArchive: (category: string, title: string, summary: string, format?: ArchivedDocument['format'], folderName?: string) => void; canArchive: boolean }) {
  const [activityCount, setActivityCount] = useState(0);
  const [notice, setNotice] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const examples: Record<string, { heading: string; detail: string; action: string; category: string; archivedTitle: string; format: ArchivedDocument['format'] }[]> = {
    Bibliothèque: [
      { heading: 'Retour attendu · L. Koné', detail: 'Le Petit Prince · retour à enregistrer', action: 'Enregistrer le retour', category: 'Services scolaires', archivedTitle: 'Registre des prêts bibliothèque · mise à jour', format: 'XLSX' },
      { heading: 'Réservation · Sciences', detail: 'Atlas de biologie · retrait en attente', action: 'Confirmer la réservation', category: 'Services scolaires', archivedTitle: 'Réservations bibliothèque · mise à jour', format: 'XLSX' },
    ],
    Cantine: [
      { heading: 'Menu du jour', detail: 'Repas équilibré · 126 réservations sur 150', action: 'Valider les réservations', category: 'Services scolaires', archivedTitle: 'Registre de cantine · mise à jour', format: 'XLSX' },
      { heading: 'Approvisionnement', detail: 'Fruits de saison · contrôle des stocks', action: 'Confirmer le stock', category: 'Services scolaires', archivedTitle: 'Stocks cantine · contrôle de période', format: 'XLSX' },
    ],
    Transport: [
      { heading: 'Circuit Nord · départ 07:30', detail: 'Bus 02 · capacité respectée · 24 élèves affectés', action: 'Confirmer le départ', category: 'Services scolaires', archivedTitle: 'Circuits de transport · pointage du jour', format: 'PDF' },
      { heading: 'Circuit Centre · retour 16:00', detail: 'Conducteur affecté · 3 arrêts au programme', action: 'Valider le circuit', category: 'Services scolaires', archivedTitle: 'Registre transport · validation de circuit', format: 'PDF' },
    ],
    Santé: [
      { heading: 'Accueil infirmerie', detail: 'Passage fictif · identité et motif non affichés', action: 'Consigner le passage', category: 'Santé & vie scolaire', archivedTitle: 'Registre santé · ajout d’un passage non nominatif', format: 'PDF' },
      { heading: 'Vérification du protocole', detail: 'Accès réservé au personnel habilité', action: 'Confirmer la vérification', category: 'Santé & vie scolaire', archivedTitle: 'Contrôle protocole santé · journal de service', format: 'PDF' },
    ],
    Internat: [
      { heading: 'Résidence A · affectations', detail: 'Capacité et occupation des chambres à contrôler', action: 'Valider les affectations', category: 'Services scolaires', archivedTitle: 'Registre internat · affectations mises à jour', format: 'XLSX' },
      { heading: 'Mouvement du soir', detail: 'Présences de résidence · suivi de démonstration', action: 'Clôturer le pointage', category: 'Services scolaires', archivedTitle: 'Registre internat · pointage de résidence', format: 'XLSX' },
    ],
    Équipement: [
      { heading: 'Prêt de vidéoprojecteur', detail: 'Salle B12 · retour prévu en fin de journée', action: 'Enregistrer le prêt', category: 'Services scolaires', archivedTitle: 'Inventaire équipement · prêt enregistré', format: 'XLSX' },
      { heading: 'Maintenance laboratoire', detail: 'Contrôle périodique · intervention à planifier', action: 'Planifier la maintenance', category: 'Services scolaires', archivedTitle: 'Maintenance équipements · intervention planifiée', format: 'XLSX' },
    ],
    Discipline: [
      { heading: 'Retards à accompagner', detail: 'Suivi éducatif · échange avec l’équipe pédagogique', action: 'Enregistrer le suivi', category: 'Santé & vie scolaire', archivedTitle: 'Suivi de vie scolaire · note de démonstration', format: 'PDF' },
      { heading: 'Observation de classe', detail: 'Fait éducatif · accès restreint aux personnes habilitées', action: 'Consigner l’observation', category: 'Santé & vie scolaire', archivedTitle: 'Journal de vie scolaire · observation', format: 'PDF' },
    ],
    Activités: [
      { heading: 'Club sciences · mercredi', detail: 'Encadrement et liste de participants à confirmer', action: 'Valider les inscriptions', category: 'Communication & vie scolaire', archivedTitle: 'Inscriptions club sciences · période 1', format: 'XLSX' },
      { heading: 'Sortie pédagogique', detail: 'Autorisations et encadrement à vérifier', action: 'Vérifier les autorisations', category: 'Communication & vie scolaire', archivedTitle: 'Autorisations de sortie · contrôle', format: 'PDF' },
    ],
    Communication: [
      { heading: 'Message aux familles', detail: 'Réunion de classe · brouillon non envoyé', action: 'Enregistrer le brouillon', category: 'Communication & vie scolaire', archivedTitle: 'Communication aux familles · brouillon', format: 'PDF' },
      { heading: 'Rendez-vous famille', detail: 'Créneaux et demandes · agenda de démonstration', action: 'Confirmer un créneau', category: 'Communication & vie scolaire', archivedTitle: 'Agenda des rendez-vous familles · mise à jour', format: 'XLSX' },
    ],
    Visiteurs: [
      { heading: 'Accueil visiteur', detail: 'Enregistrement fictif · aucune identité réelle', action: 'Enregistrer la visite', category: 'Communication & vie scolaire', archivedTitle: 'Registre visiteurs · entrée de démonstration', format: 'XLSX' },
      { heading: 'Clôture des accès', detail: 'Contrôle des sorties en fin de journée', action: 'Clôturer le registre', category: 'Communication & vie scolaire', archivedTitle: 'Registre visiteurs · clôture journalière', format: 'XLSX' },
    ],
    Événements: [
      { heading: 'Conseil de classe', detail: 'Salle, participants et ordre du jour', action: 'Confirmer l’événement', category: 'Communication & vie scolaire', archivedTitle: 'Calendrier événements · conseil de classe', format: 'PDF' },
      { heading: 'Calendrier académique', detail: 'Examens, périodes et vacances', action: 'Publier le calendrier', category: 'Configuration & calendriers', archivedTitle: 'Calendrier académique · publication', format: 'PDF' },
    ],
  };
  const activities = examples[module.name] ?? [
    { heading: `Suivi ${module.name.toLocaleLowerCase('fr')}`, detail: module.desc, action: 'Enregistrer l’activité', category: 'Services scolaires', archivedTitle: `${module.name} · activité enregistrée`, format: 'PDF' as const },
  ];
  const Icon = module.icon;
  const completeActivity = (activity: (typeof activities)[number]) => {
    setActivityCount((count) => count + 1);
    setNotice(`${activity.action} · action enregistrée`);
    onAction(`${module.name} · ${activity.action}`);
    if (canArchive) onArchive(activity.category, activity.archivedTitle, `${activity.detail}. Action réalisée dans le module ${module.name}.`, activity.format);
  };
  if (module.name === 'Bibliothèque') return <LibraryWorkspace onAction={onAction} onArchive={onArchive} canArchive={canArchive} />;
  return <section className="panel service-workspace-card"><div className="panel-head"><div className="service-card-top"><Icon size={17} /><span className="status good">{module.name}</span></div><span className="service-activity-count">{activityCount} action(s) cette session</span></div>
    {module.name === 'Communication' && <div className="field"><label htmlFor="service-message-title">Titre du brouillon</label><input id="service-message-title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="Ex. Réunion parents–enseignants" /></div>}
    {activities.map((activity) => <div className="service-task-row" key={activity.heading}><div><strong>{module.name === 'Communication' && draftTitle.trim() ? draftTitle.trim() : activity.heading}</strong><small>{activity.detail}</small></div><button className="button secondary small" disabled={module.name === 'Communication' && !draftTitle.trim()} onClick={() => completeActivity(activity)}>{activity.action}</button></div>)}
    {notice && <div className="service-action-notice"><Check size={13} />{notice}</div>}
  </section>;
}

function LibraryWorkspace({ onAction, onArchive, canArchive }: { onAction: (type: string) => void; onArchive: (category: string, title: string, summary: string, format?: ArchivedDocument['format'], folderName?: string) => void; canArchive: boolean }) {
  type BookRecord = { id: string; title: string; author: string; category: string; shelf: string; available: boolean; reserved: boolean };
  const [books, setBooks] = useState<BookRecord[]>([
    { id: 'B-1042', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', category: 'Roman jeunesse', shelf: 'A · 12', available: false, reserved: false },
    { id: 'B-1188', title: 'Une si longue lettre', author: 'Mariama Bâ', category: 'Littérature africaine', shelf: 'A · 08', available: true, reserved: true },
    { id: 'B-2031', title: 'Atlas de biologie', author: 'Collectif scolaire', category: 'Sciences', shelf: 'B · 04', available: true, reserved: false },
    { id: 'B-2407', title: 'Mathématiques · 3e', author: 'Éditions scolaires', category: 'Manuel', shelf: 'C · 03', available: true, reserved: false },
    { id: 'B-3106', title: 'Contes d’Afrique de l’Ouest', author: 'Collectif', category: 'Littérature africaine', shelf: 'A · 15', available: true, reserved: false },
  ]);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [activityCount, setActivityCount] = useState(0);
  const filteredBooks = books.filter((book) => `${book.title} ${book.author} ${book.category} ${book.id}`.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')));
  const performAction = (book: BookRecord, action: 'emprunt' | 'retour' | 'réservation') => {
    setBooks((items) => items.map((item) => item.id !== book.id ? item : {
      ...item,
      available: action === 'emprunt' ? false : action === 'retour' ? true : item.available,
      reserved: action === 'réservation' ? false : item.reserved,
    }));
    setActivityCount((count) => count + 1);
    const actionLabel = action === 'emprunt' ? 'Emprunt enregistré' : action === 'retour' ? 'Retour enregistré' : 'Réservation remise';
    setNotice(`${actionLabel} · ${book.title}`);
    onAction(`Bibliothèque · ${actionLabel} · ${book.title}`);
    if (canArchive) onArchive('Services scolaires', `${actionLabel} · ${book.title}`, `Mouvement de catalogue du livre ${book.id}, rayonnage ${book.shelf}.`, 'XLSX', 'Bibliothèque & prêts');
  };
  return <section className="panel library-workspace">
    <div className="panel-head"><div><div className="service-card-top"><Library size={18} /><span className="status good">Poste de bibliothécaire</span></div><div className="panel-caption">Catalogue, circulation, réservations et inventaire</div></div><span className="service-activity-count">{activityCount} mouvement(s) aujourd’hui</span></div>
    <div className="metrics"><Metric icon={BookOpen} label="Références au catalogue" value="1 284" change="Fonds documentaire de démonstration" /><Metric icon={Library} label="Exemplaires disponibles" value={String(books.filter((book) => book.available).length)} change="Mise à jour à chaque prêt ou retour" /><Metric icon={Clock3} label="Retours attendus" value={String(books.filter((book) => !book.available).length)} change="Échéances de circulation simulées" /></div>
    <div className="library-toolbar"><label className="search"><Search size={14} /><input aria-label="Rechercher au catalogue" placeholder="Titre, auteur, catégorie ou cote…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><span className="status warn">{books.filter((book) => book.reserved).length} réservation(s) à remettre</span></div>
    <div className="table-wrap"><table><thead><tr><th>Référence / ouvrage</th><th>Catégorie</th><th>Rayon</th><th>Disponibilité</th><th>Circulation</th></tr></thead><tbody>{filteredBooks.map((book) => <tr key={book.id}><td><div className="library-book-title"><strong>{book.title}</strong><small>{book.id} · {book.author}</small></div></td><td>{book.category}</td><td>{book.shelf}</td><td><StatusBadge value={book.available ? 'Disponible' : 'Emprunté'} /></td><td>{book.reserved ? <button className="state-toggle" onClick={() => performAction(book, 'réservation')}>Remettre la réservation</button> : book.available ? <button className="state-toggle" onClick={() => performAction(book, 'emprunt')}>Enregistrer un prêt</button> : <button className="state-toggle" onClick={() => performAction(book, 'retour')}>Enregistrer le retour</button>}</td></tr>)}</tbody></table></div>
    {!filteredBooks.length && <div className="empty-state"><strong>Aucun ouvrage trouvé</strong>Essayez un autre titre, auteur ou numéro de cote.</div>}
    {notice && <div className="service-action-notice" role="status"><Check size={13} />{notice}</div>}
    <div className="role-note"><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Les mouvements du catalogue sont enregistrés dans cette session de démonstration ; aucun système de prêt réel n’est connecté.</div>
  </section>;
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

const rolePermissionOptions: { view: ViewKey; label: string }[] = [
  { view: 'overview', label: 'Tableau de bord' },
  { view: 'learners', label: 'Dossiers apprenants' },
  { view: 'cards', label: 'Cartes scolaires' },
  { view: 'attendance', label: 'Présences' },
  { view: 'academics', label: 'Pédagogie & résultats' },
  { view: 'operations', label: 'Registres & validations' },
  { view: 'finance', label: 'Finances' },
  { view: 'hr', label: 'Ressources humaines' },
  { view: 'services', label: 'Services activés' },
  { view: 'assistant', label: 'Assistant pédagogique' },
  { view: 'settings', label: 'Configuration' },
  { view: 'team', label: 'Équipe & habilitations' },
  { view: 'family', label: 'Portail familles' },
  { view: 'learnerPortal', label: 'Portail apprenant' },
];

const operationActions: { capability: Capability; type: string; label: string; category: string }[] = [
  { capability: 'grade.write', type: 'Note saisie', label: 'Saisir une note', category: 'Bulletins & relevés' },
  { capability: 'bulletin.draft', type: 'Bulletin préparé', label: 'Préparer un bulletin', category: 'Bulletins & relevés' },
  { capability: 'bulletin.validate', type: 'Bulletin validé', label: 'Valider / publier un bulletin', category: 'Bulletins & relevés' },
  { capability: 'attendance.write', type: 'Présence / absence', label: 'Saisir présence ou absence', category: 'Présences & vie scolaire' },
  { capability: 'conduct.write', type: 'Conduite consignée', label: 'Consigner un fait de conduite', category: 'Présences & vie scolaire' },
  { capability: 'staff.leave.manage', type: 'Permission / congé', label: 'Traiter une permission ou un congé', category: 'Paie & ressources humaines' },
  { capability: 'staff.illness.manage', type: 'Absence maladie', label: 'Enregistrer une absence maladie', category: 'Paie & ressources humaines' },
  { capability: 'staff.resignation.manage', type: 'Départ / démission', label: 'Traiter un départ / démission', category: 'Paie & ressources humaines' },
];

function OperationsView({ school, role, capabilities, learners, records, onRecord, onApprove }: { school: School; role: string; capabilities: Capability[]; learners: Learner[]; records: OperationRecord[]; onRecord: (operation: Omit<OperationRecord, 'id' | 'schoolId' | 'actor' | 'createdAt'>) => void; onApprove: (id: string) => void }) {
  const [activeAction, setActiveAction] = useState<(typeof operationActions)[number] | null>(null);
  const [person, setPerson] = useState(learners[0]?.name ?? 'Personnel démo');
  const [subject, setSubject] = useState(school.educationType === 'Université' ? 'Unité d’enseignement · S1' : 'Mathématiques');
  const [detail, setDetail] = useState('');
  const [score, setScore] = useState('14');
  const [attendanceState, setAttendanceState] = useState<Learner['attendanceState']>('Présent');
  const permittedActions = operationActions.filter((item) => capabilities.includes(item.capability));
  const visibleRecords = records.filter((item) => {
    if (item.actor === role) return true;
    const academicRecord = item.type.includes('Note') || item.type.includes('Bulletin');
    const studentLifeRecord = item.type.includes('Présence') || item.type.includes('Conduite');
    const staffRecord = item.type.includes('Permission') || item.type.includes('Maladie') || item.type.includes('Départ');
    return (academicRecord && capabilities.includes('bulletin.validate')) ||
      (studentLifeRecord && (capabilities.includes('conduct.view') || capabilities.includes('attendance.write'))) ||
      (staffRecord && (capabilities.includes('staff.leave.manage') || capabilities.includes('staff.illness.manage') || capabilities.includes('staff.resignation.manage')));
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeAction || !detail.trim()) return;
    const personnelAction = activeAction.capability.startsWith('staff.');
    const targetName = personnelAction ? person.trim() || 'Personnel démo' : person;
    const value = activeAction.capability === 'grade.write' ? ` · ${score}/${school.educationType === 'Université' ? '20' : '20'}` : '';
    onRecord({
      learnerName: targetName,
      grade: personnelAction ? 'Personnel' : learners.find((item) => item.name === targetName)?.grade ?? 'Groupe démo',
      subject: personnelAction ? 'Ressources humaines' : subject,
      type: activeAction.type,
      detail: `${detail.trim()}${value}${activeAction.capability === 'attendance.write' ? ` · ${attendanceState}` : ''}`,
      status: activeAction.capability === 'bulletin.validate' ? 'Validé · démo' : activeAction.capability === 'grade.write' || activeAction.capability === 'bulletin.draft' ? 'À valider' : 'Enregistré · démo',
      attendanceState: activeAction.capability === 'attendance.write' ? attendanceState : undefined,
    });
    setActiveAction(null);
    setDetail('');
  };
  return <div className={`operations-workbench workbench-${themeForEducationType(school.educationType)}`}>
    <section className="panel operations-intro"><div><div className="eyebrow">{school.educationType} · circuit de travail</div><h2 className="panel-title">Les actes suivent une chaîne de responsabilité</h2><p className="panel-caption">Chaque action est disponible selon le rôle connecté. Les règles ci-dessous sont des exemples à valider et paramétrer selon le pays et le règlement de l’établissement.</p></div><div className="workflow-steps"><span>1 · Saisie</span><ChevronRight size={14} /><span>2 · Vérification</span><ChevronRight size={14} /><span>3 · Validation direction</span></div></section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Mes opérations autorisées</h2><div className="panel-caption">{permittedActions.length ? `Connecté comme ${role} · ${permittedActions.length} action(s) déléguée(s)` : `Le rôle ${role} est en consultation seule pour ces registres.`}</div></div><ShieldCheck size={17} color="#34745e" /></div>
      {permittedActions.length ? <div className="operation-action-grid">{permittedActions.map((action) => <button className="operation-action" key={action.capability} onClick={() => { setActiveAction(action); setPerson(action.capability.startsWith('staff.') ? '' : learners[0]?.name ?? ''); }}><span className="operation-action-icon"><Activity size={17} /></span><span><strong>{action.label}</strong><small>{action.capability === 'bulletin.validate' ? 'Réservé au valideur désigné' : action.category}</small></span><ChevronRight size={15} /></button>)}</div> : <div className="empty-state"><LockKeyhole size={20} /><strong>Aucune délégation de saisie</strong>Demandez à la direction de configurer votre rôle dans « Équipe & habilitations ».</div>}
    </section>
    <div className="operation-chart-grid"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Circuit d’approbation</h2><div className="panel-caption">Progression des actes créés dans cette session</div></div><FileBarChart2 size={16} color="#34745e" /></div><div className="approval-bars"><div><span>À valider</span><i><b style={{ width: `${Math.min(100, 12 + visibleRecords.filter((item) => item.status === 'À valider').length * 20)}%` }} /></i><strong>{visibleRecords.filter((item) => item.status === 'À valider').length}</strong></div><div><span>Enregistrés</span><i><b className="bar-blue" style={{ width: `${Math.min(100, 18 + visibleRecords.filter((item) => item.status.includes('Enregistré')).length * 18)}%` }} /></i><strong>{visibleRecords.filter((item) => item.status.includes('Enregistré')).length}</strong></div><div><span>Validés</span><i><b className="bar-gold" style={{ width: `${Math.min(100, 8 + visibleRecords.filter((item) => item.status.includes('Validé')).length * 22)}%` }} /></i><strong>{visibleRecords.filter((item) => item.status.includes('Validé')).length}</strong></div></div></section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Qui fait quoi ?</h2><div className="panel-caption">Matrice de responsabilité indicative</div></div><Users size={16} color="#34745e" /></div><div className="responsibility-list"><p><strong>Enseignant</strong><span>Notes, présences de classe, préparation des bulletins.</span></p><p><strong>Censeur / responsable pédagogique</strong><span>Contrôle de cohérence et transmission des résultats.</span></p><p><strong>Proviseur / direction pédagogique</strong><span>Validation finale et publication selon délégation.</span></p><p><strong>Surveillant</strong><span>Pointage, retards et suivi éducatif; pas de publication de notes.</span></p><p><strong>Responsable RH</strong><span>Congés, permissions, maladie et départs du personnel.</span></p></div></section></div>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Registre des actions de la session</h2><div className="panel-caption">Les modifications de résultats validés devraient exiger motif, autorisation et audit serveur.</div></div><span className="status warn">{visibleRecords.length} acte(s)</span></div>{visibleRecords.length ? <div className="table-wrap"><table><thead><tr><th>Acte</th><th>Personne / apprenant</th><th>Classe / matière</th><th>Responsable</th><th>État</th><th>Action</th></tr></thead><tbody>{visibleRecords.map((item) => <tr key={item.id}><td><strong>{item.type}</strong><small className="operation-detail">{item.detail}</small></td><td>{item.learnerName}</td><td>{item.grade} · {item.subject}</td><td>{item.actor}<small>{item.createdAt}</small></td><td><StatusBadge value={item.status} /></td><td>{item.status === 'À valider' && capabilities.includes('bulletin.validate') ? <button className="button secondary small" onClick={() => onApprove(item.id)}><Check size={13} />Valider</button> : <span className="muted">—</span>}</td></tr>)}</tbody></table></div> : <div className="empty-state">Aucun acte saisi. Lancez une action autorisée pour voir le circuit de validation.</div>}</section>
    {activeAction && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveAction(null); }}><section className="modal-card operation-modal" role="dialog" aria-modal="true" aria-labelledby="operation-modal-title"><div className="modal-head"><div><div className="eyebrow">Action · {role}</div><h2 id="operation-modal-title">{activeAction.label}</h2></div><button className="icon-button" aria-label="Fermer" onClick={() => setActiveAction(null)}>×</button></div><form onSubmit={submit}><div className="field"><label htmlFor="operation-person">{activeAction.capability.startsWith('staff.') ? 'Personnel concerné' : 'Apprenant'}</label>{activeAction.capability.startsWith('staff.') ? <input id="operation-person" required value={person} onChange={(event) => setPerson(event.target.value)} placeholder="Nom du membre du personnel" /> : <select id="operation-person" value={person} onChange={(event) => setPerson(event.target.value)}>{learners.map((item) => <option key={item.id}>{item.name}</option>)}</select>}</div>    {!activeAction.capability.startsWith('staff.') && <div className="field"><label htmlFor="operation-subject">Matière / unité / groupe</label><input id="operation-subject" value={subject} onChange={(event) => setSubject(event.target.value)} required /></div>}{activeAction.capability === 'grade.write' && <div className="field"><label htmlFor="operation-score">Note sur 20</label><input id="operation-score" type="number" min="0" max="20" step="0.25" value={score} onChange={(event) => setScore(event.target.value)} required /></div>}{activeAction.capability === 'attendance.write' && <div className="field"><label htmlFor="operation-attendance-state">Statut de présence</label><select id="operation-attendance-state" value={attendanceState} onChange={(event) => setAttendanceState(event.target.value as Learner['attendanceState'])}><option>Présent</option><option>Absent</option><option>En retard</option></select></div>}<div className="field"><label htmlFor="operation-detail">{activeAction.capability.startsWith('staff.') ? 'Motif / décision' : 'Commentaire / période / justification'}</label><textarea id="operation-detail" rows={3} value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="Saisir les informations fictives utiles au suivi…" required /></div><div className="modal-actions"><button type="button" className="button secondary" onClick={() => setActiveAction(null)}>Annuler</button><button type="submit" className="button"><Check size={14} />Enregistrer dans la démo</button></div><div className="role-note">Une validation affichée ici n’est pas une signature ni un acte officiel.</div></form></section></div>}
  </div>;
}

function TeamManagementView({ school, role, customRoles, onCreateRole, onPreviewRole }: { school: School; role: string; customRoles: CustomRole[]; onCreateRole: (item: CustomRole) => void; onPreviewRole: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [members, setMembers] = useState('');
  const [level, setLevel] = useState<EduType>(school.educationType);
  const [selected, setSelected] = useState<Capability[]>([]);
  const [error, setError] = useState('');
  const canManage = (roleCapabilities[role] ?? []).includes('roles.manage');
  const toggle = (capability: Capability) => setSelected((current) => current.includes(capability) ? current.filter((item) => item !== capability) : [...current, capability]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !responsibility.trim()) return;
    if (customRoles.some((item) => item.name.toLocaleLowerCase('fr') === trimmedName.toLocaleLowerCase('fr')) || roleNavigation[trimmedName]) {
      setError('Ce rôle existe déjà dans cette démonstration.');
      return;
    }
    onCreateRole({ name: trimmedName, level, responsibility: responsibility.trim(), capabilities: selected, memberNames: members.split(',').map((item) => item.trim()).filter(Boolean) });
    setOpen(false);
    setName('');
    setResponsibility('');
    setMembers('');
    setSelected([]);
    setError('');
  };
  return <div className="team-management"><section className="panel team-hero"><div><div className="eyebrow">{school.educationType} · gouvernance locale</div><h2 className="panel-title">L’organigramme suit votre établissement</h2><p className="panel-caption">Le responsable habilité crée les profils, précise les missions et délègue uniquement les actions nécessaires. Les intitulés et validations sont configurables selon le pays, le statut et le règlement intérieur.</p></div>{canManage && <button className="button" onClick={() => setOpen(true)}><Plus size={14} />Créer un rôle / compte</button>}</section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Rôles personnalisés de cet établissement</h2><div className="panel-caption">{customRoles.length} profil(s) créé(s) dans cette session · niveau {school.educationType}</div></div><ShieldCheck size={17} color="#34745e" /></div>{customRoles.length ? <div className="custom-role-grid">{customRoles.map((item) => <article className="custom-role-card" key={item.name}><div className="custom-role-head"><span className="operation-action-icon"><Users size={16} /></span><div><h3>{item.name}</h3><span>{item.level} · {item.memberNames.length} membre(s) affecté(s)</span></div></div><p>{item.responsibility}</p><div className="custom-role-capabilities"><strong>Délégations autorisées</strong>{item.capabilities.length ? item.capabilities.map((cap) => <span key={cap}><Check size={12} />{capabilityLabels[cap]}</span>) : <span className="muted">Aucune action métier déléguée</span>}<strong>Non déléguées</strong>{(Object.keys(capabilityLabels) as Capability[]).filter((cap) => !item.capabilities.includes(cap)).slice(0, 3).map((cap) => <span className="capability-denied" key={cap}><LockKeyhole size={11} />{capabilityLabels[cap]}</span>)}</div>{item.memberNames.length > 0 && <div className="member-list"><strong>Titulaires :</strong> {item.memberNames.join(', ')}</div>}<button className="button secondary small" onClick={() => onPreviewRole(item.name)}>Prévisualiser ce rôle</button></article>)}</div> : <div className="empty-state"><Users size={22} /><strong>Aucun rôle personnalisé</strong>Créez un poste adapté à votre organigramme, par exemple un responsable de cycle, un chef de département ou un gestionnaire d’internat.</div>}</section>
    <div className="role-note"><LockKeyhole size={13} />La création ci-dessus est un scénario de démonstration. En production, la création de comptes, les limites de délégation et la séparation des données doivent être validées côté serveur.</div>
    {open && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section className="modal-card team-modal" role="dialog" aria-modal="true" aria-labelledby="team-modal-title"><div className="modal-head"><div><div className="eyebrow">Création contrôlée · {role}</div><h2 id="team-modal-title">Nouveau poste et ses délégations</h2></div><button className="icon-button" aria-label="Fermer" onClick={() => setOpen(false)}>×</button></div><form onSubmit={submit}><div className="field"><label htmlFor="custom-role-name">Intitulé du rôle</label><input id="custom-role-name" required value={name} onChange={(event) => { setName(event.target.value); setError(''); }} placeholder="Ex. Responsable de cycle" /></div><div className="field"><label htmlFor="custom-role-level">Niveau / type d’établissement</label><select id="custom-role-level" value={level} onChange={(event) => setLevel(event.target.value as EduType)}>{(['Maternelle', 'Primaire', 'Collège', 'Lycée', 'Université', 'Multi-cycles'] as EduType[]).map((item) => <option key={item}>{item}</option>)}</select></div><div className="field"><label htmlFor="custom-role-responsibility">Responsabilités et limites</label><textarea id="custom-role-responsibility" required rows={3} value={responsibility} onChange={(event) => setResponsibility(event.target.value)} placeholder="Décrire les tâches, le périmètre et les actes nécessitant validation…" /></div><div className="field"><label htmlFor="custom-role-members">Titulaires fictifs (séparés par des virgules)</label><input id="custom-role-members" value={members} onChange={(event) => setMembers(event.target.value)} placeholder="Nom Prénom, Nom Prénom" /></div><fieldset className="capability-fieldset"><legend>Autorisations explicites — tout le reste est refusé</legend><div className="capability-picker">{(Object.keys(capabilityLabels) as Capability[]).filter((cap) => cap !== 'roles.manage').map((cap) => <label key={cap}><input type="checkbox" checked={selected.includes(cap)} onChange={() => toggle(cap)} /><span>{capabilityLabels[cap]}</span></label>)}</div></fieldset>{error && <p className="login-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button secondary" onClick={() => setOpen(false)}>Annuler</button><button type="submit" className="button"><Plus size={14} />Créer le profil</button></div><div className="role-note">Le cumul de droits sensibles doit rester limité et être audité par la direction.</div></form></section></div>}
  </div>;
}

function SettingsView({ school, groupMode, setGroupMode, language, setLanguage, currency, setCurrency, settings, setSettings, syncs, onSync, rolePermissions, onRolePermissionsChange, onCreateRole, onPreviewRole }: { school: School; groupMode: boolean; setGroupMode: (value: boolean) => void; language: string; setLanguage: (value: string) => void; currency: string; setCurrency: (value: string) => void; settings: { digest: boolean; minorProtection: boolean; audit: boolean }; setSettings: (value: { digest: boolean; minorProtection: boolean; audit: boolean }) => void; syncs: SyncOperation[]; onSync: (type: string) => void; rolePermissions: Record<string, ViewKey[]>; onRolePermissionsChange: (role: string, views: ViewKey[]) => void; onCreateRole: (role: string) => void; onPreviewRole: (role: string) => void }) {
  const changeSetting = (key: keyof typeof settings) => setSettings({ ...settings, [key]: !settings[key] });
  const [selectedRole, setSelectedRole] = useState(Object.keys(rolePermissions)[0] ?? '');
  const [newRoleName, setNewRoleName] = useState('');
  const [roleError, setRoleError] = useState('');
  const selectedViews = rolePermissions[selectedRole] ?? [];
  const toggleRoleView = (view: ViewKey) => {
    const nextViews = selectedViews.includes(view) ? selectedViews.filter((item) => item !== view) : [...selectedViews, view];
    onRolePermissionsChange(selectedRole, nextViews);
  };
  const createRole = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newRoleName.trim();
    if (!name) return;
    if (rolePermissions[name]) {
      setRoleError('Ce rôle existe déjà.');
      return;
    }
    onCreateRole(name);
    setSelectedRole(name);
    setNewRoleName('');
    setRoleError('');
  };
  return <><div className="two-col"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Cadre de l’établissement</h2><div className="panel-caption">Préférences de démonstration modifiables</div></div><Languages size={16} color="#34745e" /></div>
    <div className="settings-row"><div className="settings-label"><strong>Expérience multi-établissements</strong><span>Afficher la sélection d’environnements du groupe</span></div><button className={`switch ${groupMode ? 'on' : ''}`} aria-label="Basculer le mode groupe" onClick={() => setGroupMode(!groupMode)} data-testid="toggle-group-mode" /></div>
    <div className="settings-row"><div className="settings-label"><strong>Langue d’affichage</strong><span>Préférence de l’espace de démonstration</span></div><select className="select-control" value={language} onChange={(e) => setLanguage(e.target.value)}><option>Français</option><option>English</option><option>العربية</option></select></div>
    <div className="settings-row"><div className="settings-label"><strong>Devise d’affichage</strong><span>Préférence de lecture, sans transaction</span></div><select className="select-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>{['XOF', 'EUR', 'MAD', 'USD'].map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="settings-row"><div className="settings-label"><strong>Année scolaire</strong><span>{school.country} · exemple de calendrier</span></div><select className="select-control" defaultValue={school.schoolYear}><option>2026–2027</option><option>2027–2028</option><option>Janvier–Décembre</option></select></div>
    <div className="settings-row"><div className="settings-label"><strong>Référentiel de notation</strong><span>Configuration indicative par niveau</span></div><select className="select-control" defaultValue={school.educationType === 'Université' ? 'ECTS · crédits' : 'Sur 20 · compétences'}><option>Sur 20 · compétences</option><option>ECTS · crédits</option><option>Acquis · en cours · à renforcer</option></select></div>
    <div className="settings-row"><div className="settings-label"><strong>Fuseau horaire</strong><span>Calendrier et notifications de l’établissement</span></div><select className="select-control" defaultValue={school.country === 'France' ? 'Europe/Paris' : school.country === 'Maroc' ? 'Africa/Casablanca' : 'Africa/Dakar'}><option>Africa/Dakar</option><option>Africa/Abidjan</option><option>Africa/Casablanca</option><option>Europe/Paris</option></select></div>
    <div className="settings-row"><div className="settings-label"><strong>Format de date</strong><span>Documents et exports scolaires</span></div><select className="select-control" defaultValue="JJ/MM/AAAA"><option>JJ/MM/AAAA</option><option>AAAA-MM-JJ</option><option>MM/JJ/AAAA</option></select></div>
    <div className="settings-row"><div className="settings-label"><strong>Programme de référence</strong><span>{school.country} · paramétrage illustratif</span></div><select className="select-control" defaultValue={school.country === 'France' ? 'Programme français' : school.country === 'Maroc' ? 'Programme marocain' : 'Programme national'}><option>Programme national</option><option>Programme français</option><option>Programme marocain</option><option>Programme interne</option></select></div>
    <div className="settings-row"><div className="settings-label"><strong>Modèles de documents</strong><span>Bulletins, attestations et certificats</span></div><select className="select-control" defaultValue="Modèle établissement"><option>Modèle établissement</option><option>Modèle universitaire</option><option>Modèle groupe scolaire</option></select></div>
    </section>
    <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Principes de confiance</h2><div className="panel-caption">États et intentions de conception — pas une garantie backend</div></div><ShieldCheck size={16} color="#34745e" /></div>
      <div className="settings-row"><div className="settings-label"><strong>Protection des mineurs</strong><span>Étiquette de vigilance pour cet environnement démo</span></div><button className={`switch ${settings.minorProtection ? 'on' : ''}`} aria-label="Protection des mineurs démo" onClick={() => changeSetting('minorProtection')} /></div>
      <div className="settings-row"><div className="settings-label"><strong>Journal d’activité local</strong><span>{syncs.length} action(s) conservée(s) dans le navigateur</span></div><button className={`switch ${settings.audit ? 'on' : ''}`} aria-label="Journal d’activité local" onClick={() => changeSetting('audit')} /></div>
      <div className="settings-row"><div className="settings-label"><strong>Résumé quotidien</strong><span>Préférence d’affichage dans le prototype</span></div><button className={`switch ${settings.digest ? 'on' : ''}`} aria-label="Résumé quotidien" onClick={() => changeSetting('digest')} /></div>
      <div className="role-note"><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />Séparation des espaces, permissions fines, auditabilité et protection des données mineurs sont des objectifs de produit. Aucun contrôle serveur n’est implémenté dans cette démo.</div>
    </section></div>
    <section className="panel wide-panel role-permissions-panel"><div className="panel-head"><div><h2 className="panel-title">Rôles et autorisations</h2><div className="panel-caption">Adaptez les menus accessibles à chaque fonction et créez des profils personnalisés.</div></div><ShieldCheck size={16} color="#34745e" /></div>
      <div className="role-editor-toolbar"><div className="field"><label htmlFor="role-editor-select">Rôle à configurer</label><select id="role-editor-select" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>{Object.keys(rolePermissions).map((name) => <option key={name}>{name}</option>)}</select></div>
        <form className="create-role-form" onSubmit={createRole}><div className="field"><label htmlFor="new-role-name">Créer un rôle personnalisé</label><input id="new-role-name" value={newRoleName} onChange={(event) => { setNewRoleName(event.target.value); setRoleError(''); }} placeholder="Ex. Coordinateur de cycle" /></div><button className="button secondary" type="submit" disabled={!newRoleName.trim()}><Plus size={13} />Créer</button></form>
      </div>
      {roleError && <p className="login-error" role="alert">{roleError}</p>}
      <div className="role-permission-grid">{rolePermissionOptions.map(({ view, label }) => <label className="role-permission-option" key={view}><input type="checkbox" checked={selectedViews.includes(view)} onChange={() => toggleRoleView(view)} /><span>{label}</span></label>)}</div>
      <div className="role-editor-footer"><div className="role-note"><LockKeyhole size={13} style={{ verticalAlign: 'middle', marginRight: 6 }} />La configuration est conservée dans cette session de démonstration. Dans une version réelle, les autorisations doivent être vérifiées sur le serveur et chaque accès sensible doit être journalisé.</div><button className="button secondary" onClick={() => onPreviewRole(selectedRole)}><Eye size={14} />Tester ce rôle</button></div>
    </section>
    <div className="two-col institution-configuration"><section className="panel"><div className="panel-head"><div><h2 className="panel-title">Organisation de l’établissement</h2><div className="panel-caption">Structure de référence à configurer par établissement</div></div><Building2 size={16} color="#34745e" /></div>{[['Identité & direction', `${school.name} · direction et coordonnées`], ['Sites & espaces', 'Campus · bâtiments · blocs · salles · laboratoires'], ['Structure éducative', 'Cycles · niveaux · classes · sections · facultés'], ['Programmes', 'Disciplines · unités d’enseignement · objectifs']].map(([title, detail]) => <div className="list-row" key={title}><div><strong>{title}</strong><small>{detail}</small></div><StatusBadge value="À configurer" /></div>)}</section>
      <section className="panel"><div className="panel-head"><div><h2 className="panel-title">Année académique & référentiels</h2><div className="panel-caption">Calendrier configurable selon le pays et le profil</div></div><CalendarDays size={16} color="#34745e" /></div>{[['Périodes', 'Trimestres · semestres · vacances'], ['Examens', 'Calendrier · saisie · délibérations'], ['Clôture', 'Validation · archivage · historique'], ['Référentiel local', `${school.country} · ${language} · ${currency}`]].map(([title, detail]) => <div className="list-row" key={title}><div><strong>{title}</strong><small>{detail}</small></div><StatusBadge value="Aperçu" /></div>)}</section></div>
    <section className="panel wide-panel"><div className="panel-head"><div><h2 className="panel-title">File de synchronisation locale</h2><div className="panel-caption">Démonstration d’un parcours hors ligne — sans connexion ni sync réelle</div></div><button className="button secondary small" onClick={() => onSync('Opération de test hors ligne')}><Plus size={13} />Ajouter une opération de test</button></div>
      {syncs.length ? syncs.slice(0, 6).map((item) => <div className="list-row" key={item.id}><div><strong>{item.type}</strong><small>Opération #{item.id} · créée à {item.createdAt}</small></div><StatusBadge value={item.status} /></div>) : <div className="empty-state"><strong>Aucune opération locale</strong>Essayez le mode hors ligne puis modifiez une présence.</div>}
    </section>
  </>;
}

export default App;
