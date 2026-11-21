import { db, pool, organizations, establishments, users, learners, invoices, transactions } from "@workspace/db";
import { eq } from "drizzle-orm";

async function seed() {
  await db.delete(transactions);
  await db.delete(invoices);
  await db.delete(learners);
  await db.delete(users);
  await db.delete(establishments);
  await db.delete(organizations);

  const [horizons] = await db.insert(organizations).values({
    name: "Groupe Scolaire Les Horizons",
    slug: "horizons",
    country: "Senegal",
    currency: "XOF",
  }).returning();
  const [uib] = await db.insert(organizations).values({
    name: "Université Internationale",
    slug: "uib",
    country: "Maroc",
    currency: "MAD",
  }).returning();
  const [academy] = await db.insert(organizations).values({
    name: "Académie Nouvelle Génération",
    slug: "ang",
    country: "Cote d'Ivoire",
    currency: "XOF",
  }).returning();

  await db.insert(establishments).values([
    { organizationId: horizons.id, name: "Les Horizons Maternelle", type: "Maternelle", country: "Senegal", enabledModules: ["Cantine", "Transport", "Communication"] },
    { organizationId: horizons.id, name: "Les Horizons Primaire", type: "Primaire", country: "Senegal", enabledModules: ["Cantine", "Transport", "Bibliothèque"] },
    { organizationId: horizons.id, name: "Les Horizons Secondaire", type: "Lycee", country: "Senegal", enabledModules: ["Cantine", "Transport", "Bibliothèque", "Internat"] },
    { organizationId: uib.id, name: "Campus Central", type: "Universite", country: "Maroc", currency: "MAD", enabledModules: ["Bibliothèque", "Facultés", "Exams", "Délibérations"] },
    { organizationId: uib.id, name: "Campus Sciences et Technologies", type: "Universite", country: "Maroc", currency: "MAD", enabledModules: ["Bibliothèque", "Laboratoires", "Examens"] },
    { organizationId: academy.id, name: "Académie Nouvelle Génération", type: "College", country: "Cote d'Ivoire", enabledModules: ["Cantine", "Bibliothèque", "Communication"] },
  ]);

  await db.insert(users).values([
    { organizationId: horizons.id, email: "direction@horizons.demo", passwordHash: "$2b$10$demo-only-not-a-real-password", name: "Aminata Ndiaye", role: "Directeur" },
    { organizationId: horizons.id, email: "enseignant@horizons.demo", passwordHash: "$2b$10$demo-only-not-a-real-password", name: "Ibrahima Kane", role: "Enseignant" },
    { organizationId: horizons.id, email: "comptable@horizons.demo", passwordHash: "$2b$10$demo-only-not-a-real-password", name: "Ousmane Diallo", role: "Comptable" },
    { organizationId: horizons.id, email: "parent@horizons.demo", passwordHash: "$2b$10$demo-only-not-a-real-password", name: "Mame Ndiaye", role: "Parent" },
    { organizationId: horizons.id, email: "eleve@horizons.demo", passwordHash: "$2b$10$demo-only-not-a-real-password", name: "Aïssatou Ndiaye", role: "Eleve" },
    { organizationId: uib.id, email: "admin@uib.demo", passwordHash: "$2b$10$demo-only-not-a-real-password", name: "Youssef Benali", role: "Administrateur" },
  ]);

  const [primary] = await db.select({ id: establishments.id }).from(establishments).where(eq(establishments.name, "Les Horizons Primaire"));
  const [central] = await db.select({ id: establishments.id }).from(establishments).where(eq(establishments.name, "Campus Central"));

  const seedFirstNames = ["Aïssatou","Moussa","Inès","Amadou","Léa","Yacine","Mamadou","Fatou","Ibrahima","Ndeye","Khadija","Seydou","Awa","Ousmane","Mariama","Cheikh","Ramatou","Jean","Claire","Paul","Salma","Mehdi","Yasmin","Adam","Hana","Louis","Amel","Maya","Éden","Lila","Noa","Inès","Léna","Nora","Malick","Sophie","David","Amina","Rayane","Nathalie","Mariam","Issa","Bintou","Daouda","Noura","Moustapha","Sira","Thierno","Nafissatou","Pape","Khadim","Baba","Mame","Astou","Serigne","Diarra","Khady","Alioune","Samba","Fanta","Boubacar","Bineta","Abdou","Rokhaya","Mouhamed","Safiatou","Ivy","Kenzo","Anita","Dieynaba","Babacar","Ndèye","Saliou","Zeyna","Kadiatou"];
  const seedLastNames = ["Ndiaye","Diop","Fall","Sarr","Diouf","Ba","Ndiaye","Cissé","Kane","Sarr","Traoré","Ba","Diouf","Diallo","Sène","Sy","Konaté","Morel","Martin","Bernard","El Idrissi","Amrani","Benali","Laurent","Diallo","Morel","Benali","Coulibaly","Traoré","Koné","Martin","Bernard","Petit","Diallo","Fall","Gomis","Camara","Sow","Ndour","Mbaye","Touré","Koffi","Dia","Thiam","Mendy","Demba","Seck","Wade","Faye","Barry","Gueye","Niang","Mbengue","Samb","Lô","Ciss","Boye","Doucouré","Camar","Kane","Diagne","Sagna","Badji","Dieng","Coly","Mané","Sadio","Toure","Tall","Ndao","Sow","Sene","Ndoye","Gaye","Camara","Sy"];
  const seedClasses = ["CP · A","CE1 · A","CE1 · B","CE2 · A","CE2 · B","CM1 · A","CM1 · B","CM2 · A","CM2 · B"];
  const seedLearners = seedFirstNames.map((firstName, index) => ({
    organizationId: horizons.id,
    establishmentId: primary.id,
    matricule: `HOR-2026-${101 + index}`,
    firstName,
    lastName: seedLastNames[index],
    className: seedClasses[Math.floor(index / 8)],
    guardianName: index % 3 === 0 ? `M. & Mme ${seedLastNames[index]}` : `Mme ${seedLastNames[index]}`,
  }));
  const [learner1, learner2] = await db.insert(learners).values(seedLearners).returning();

  await db.insert(invoices).values([
    { organizationId: horizons.id, establishmentId: primary.id, learnerId: learner1.id, reference: "FAC-2026-001", description: "Scolarité - 2026/2027", amount: 245000, paidAmount: 245000, status: "paid" },
    { organizationId: horizons.id, establishmentId: primary.id, learnerId: learner2.id, reference: "FAC-2026-002", description: "Scolarité - 2026/2027", amount: 220000, paidAmount: 80000, status: "partial" },
  ]);

  await db.insert(transactions).values([
    { organizationId: horizons.id, establishmentId: primary.id, reference: "TX-DEMO-001", method: "mobile", amount: 245000, status: "confirmed", metadata: { demo: true } },
  ]);

  console.log("EduCore demo seed completed.");
  await pool.end();
}

seed().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
