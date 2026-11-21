# EduCore Demo

Client-facing, French-first education SaaS demo built with Next.js App Router. The app exports static files and is intended to be deployed on Vercel.

## Lancer en local

Prerequisites: Node.js 20.9 or newer and pnpm 10.

Depuis la racine du dépôt, installez les dépendances une fois puis démarrez le serveur :

```powershell
pnpm install
pnpm dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000). Le serveur Next.js démarre sur le port 3000.

Le site public commercial est disponible sur `http://localhost:3000/`.
La page de connexion client est disponible sur `http://localhost:3000/login`.
Après authentification fictive, l’application s’ouvre sur `http://localhost:3000/demo`.

Pour vérifier la compilation de production :

```sh
pnpm --filter @workspace/edusuite-demo run build
```

## Backend PostgreSQL

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
$env:DATABASE_URL="postgresql://educore:educore@localhost:5432/educore"
$env:PORT="5000"
pnpm --filter @workspace/db run push
pnpm --filter @workspace/scripts run seed
pnpm --filter @workspace/api-server run dev
```

L’API démarre sur `http://localhost:5000/api`. Les endpoints de démonstration couvrent apprenants, factures, paiements simulés, transactions et réinitialisation.

## Déployer sur Vercel

### Option recommandée : monorepo à la racine

Importez le dépôt dans Vercel sans définir `Root Directory` sur un dossier vide. Le fichier `vercel.json` à la racine lance automatiquement :

```text
pnpm --filter @workspace/edusuite-demo run build
```

La sortie statique est attendue dans `artifacts/edusuite-demo/out`.

### Option alternative : application seule

Dans les paramètres Vercel, choisissez `artifacts/edusuite-demo` comme **Root Directory**. Vercel détectera alors directement Next.js et utilisera `pnpm run build`.

Aucune variable d’environnement n’est nécessaire pour cette démo statique.

## Fonctions de présentation

- Les profils d’apprenants peuvent inclure une date de naissance et un responsable, puis générer un identifiant scolaire de démonstration.
- L’espace **Cartes scolaires** permet de prévisualiser une carte, d’en imprimer une ou d’imprimer le lot de l’établissement. Les cartes portent une mention de démonstration et ne constituent pas des justificatifs officiels.
- Les listes d’apprenants et les pointages peuvent être téléchargés au format CSV (séparateur `;`, adapté à Excel en français).
- La page de connexion propose des comptes fictifs par fonction : administration, direction, pédagogie, secrétariat, comptabilité, caisse, RH, enseignement, familles, apprenants et responsables de services. Les profils **Administrateur SaaS** et **Propriétaire du SaaS** ont été retirés.
- Le choix du type d’établissement filtre les rôles proposés. Les cartes de connexion affichent le poste et la description, et non le nom des personnes.
- Les menus illustrent des périmètres différents selon le rôle. Les profils secondaires incluent notamment proviseur, proviseur adjoint, principal, censeur, surveillant général, conseiller d’orientation, économe et chef de travaux. Le profil universitaire comprend recteur, doyen et fondateur/PDG d’université privée. Ces intitulés et responsabilités sont des exemples adaptables aux pays, statuts et organisations des établissements.
- Le compte **Promoteur / PDG · décideur acheteur** ouvre un parcours d’évaluation commerciale : visite des modules, simulateur d’hypothèses de valeur, checklist de sécurité et de déploiement, et préparation locale d’un pilote. L’estimation est indicative, modifiable et ne vaut ni devis, ni garantie d’économie, ni prise de contact réelle.
- Les responsables de services ont un poste de travail métier ; la bibliothèque gère un catalogue, les prêts, les retours et les réservations. Le caissier dispose d’un aperçu distinct de la comptabilité. L’espace famille permet de passer entre les enfants rattachés au compte ; l’espace apprenant présente uniquement le suivi personnel, sans menu générique d’archives.
- Le poste **Registres & validations** montre le circuit de saisie et de validation : les enseignants peuvent saisir notes et présences et préparer un bulletin ; les rôles pédagogiques et la direction autorisés peuvent valider les résultats ; la surveillance consigne présences et faits de conduite ; les RH traitent les permissions, congés, absences maladie et départs. Chaque action ouvre un formulaire modal, met à jour le registre de la session et crée une trace d’archive. Les responsabilités affichées sont un modèle adaptable, pas une règle légale universelle.
- Les directions et administrateurs habilités disposent de **Équipe & habilitations** pour créer dans la session des rôles personnalisés, décrire leurs responsabilités, désigner des titulaires fictifs et sélectionner explicitement les opérations déléguées. Les permissions non sélectionnées restent refusées dans ce parcours de démonstration ; un rôle peut être prévisualisé.
- Le compte Parent / responsable légal est disponible pour tous les types d’établissement, y compris les groupes et l’université. Les informations familiales changent selon le niveau ; pour l’université, le suivi académique d’un étudiant majeur reste masqué et l’interface simule une demande d’autorisation au lieu d’exposer notes et emploi du temps.
- L’écran de connexion a été retravaillé et conserve le filtrage des rôles par type d’établissement, la sélection des comptes démo et l’affichage du poste plutôt que du nom sur les cartes de compte.
- Les actions métier de présentation (pointage, demandes famille, reçus de caisse, suivi RH et exports) modifient l’état de la session et ajoutent une trace au journal de démonstration.
- L’espace **Archives**, réservé aux fonctions qui classent ou consultent des pièces, organise les documents fictifs en dossiers par métier. Une personne habilitée peut nommer le dossier au classement ; son rôle de création, la catégorie et l’année sont indiqués. La recherche porte sur le titre, la catégorie, le résumé et le déposant ; les filtres couvrent bulletins, résultats, diplômes, emplois du temps, paiements et documents RH. Le téléchargement produit une fiche descriptive, pas le fichier source annoncé.
- La configuration présente l’organisation d’un établissement, les sites et espaces, les structures éducatives, les années académiques et les référentiels locaux. Elle inclut un éditeur de rôles personnalisés et de menus dans la session de démonstration.

## Limites de la démo

Les profils d’établissement, les apprenants, le personnel, les archives, les paiements, les réponses de l’assistant et les activités sont fictifs. Les rôles illustrent des parcours et menus différents. Les changements métier en mémoire sont réinitialisés à chaque connexion ou déconnexion de démonstration.

Cette application statique n’a ni authentification réelle, ni permissions côté serveur, ni isolation multi-tenant. Les rôles et restrictions de l’interface sont uniquement visuels : ils ne protègent pas des données confidentielles. Les rôles personnalisés, titulaires et opérations existent uniquement dans la session de démonstration ; ils ne créent pas de vrais comptes connectables. La validation affichée n’est ni une signature ni un acte officiel. Une production nécessiterait notamment des politiques serveur, une piste d’audit inaltérable, des validations et motifs obligatoires pour corriger des résultats publiés, ainsi que des règles de confidentialité et de conservation adaptées aux pays concernés. Ne connectez aucune donnée scolaire réelle. Les dossiers d’archives et leur visibilité sont simulés en mémoire ; aucune pièce jointe n’est réellement stockée et une fiche téléchargeable ne remplace pas un document officiel. Les paiements, la comptabilité réglementaire, la paie, l’IA et la synchronisation hors ligne ne sont pas connectés ; les autres domaines sont des aperçus fonctionnels destinés à présenter les parcours.
