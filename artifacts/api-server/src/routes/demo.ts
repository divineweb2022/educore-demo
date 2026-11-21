import { Router, type IRouter } from "express";

type Learner = { id: number; name: string; grade: string; guardian: string; establishmentId: string };
type Invoice = { id: number; learnerId: number; reference: string; amount: number; paidAmount: number; status: "pending" | "partial" | "paid" };
type Transaction = { id: number; invoiceId: number; reference: string; amount: number; method: "cash" | "transfer" | "card" | "mobile"; status: "confirmed" | "pending" | "failed" | "refunded" };

const demoFirstNames = ["Aïssatou","Moussa","Inès","Amadou","Léa","Yacine","Mamadou","Fatou","Ibrahima","Ndeye","Khadija","Seydou","Awa","Ousmane","Mariama","Cheikh","Ramatou","Jean","Claire","Paul","Salma","Mehdi","Yasmin","Adam","Hana","Louis","Amel","Maya","Éden","Lila","Noa","Inès","Léna","Nora","Malick","Sophie","David","Amina","Rayane","Nathalie","Mariam","Issa","Bintou","Daouda","Noura","Moustapha","Sira","Thierno","Nafissatou","Pape","Khadim","Baba","Mame","Astou","Serigne","Diarra","Khady","Alioune","Samba","Fanta","Boubacar","Bineta","Abdou","Rokhaya","Mouhamed","Safiatou","Ivy","Kenzo","Anita","Dieynaba","Babacar","Ndèye","Saliou","Zeyna","Kadiatou"];
const demoLastNames = ["Ndiaye","Diop","Fall","Sarr","Diouf","Ba","Ndiaye","Cissé","Kane","Sarr","Traoré","Ba","Diouf","Diallo","Sène","Sy","Konaté","Morel","Martin","Bernard","El Idrissi","Amrani","Benali","Laurent","Diallo","Morel","Benali","Coulibaly","Traoré","Koné","Martin","Bernard","Petit","Diallo","Fall","Gomis","Camara","Sow","Ndour","Mbaye","Touré","Koffi","Dia","Thiam","Mendy","Demba","Seck","Wade","Faye","Barry","Gueye","Niang","Mbengue","Samb","Lô","Ciss","Boye","Doucouré","Camar","Kane","Diagne","Sagna","Badji","Dieng","Coly","Mané","Sadio","Toure","Tall","Ndao","Sow","Sene","Ndoye","Gaye","Camara","Sy"];
const demoClasses = ["CP · A","CE1 · A","CE1 · B","CE2 · A","CE2 · B","CM1 · A","CM1 · B","CM2 · A","CM2 · B"];
const initialLearners: Learner[] = demoFirstNames.map((name, index) => ({
  id: 101 + index,
  name: `${name} ${demoLastNames[index]}`,
  grade: demoClasses[Math.floor(index / 8)],
  guardian: index % 3 === 0 ? `M. & Mme ${demoLastNames[index]}` : `Mme ${demoLastNames[index]}`,
  establishmentId: index >= 72 ? "uib-campus-central" : "horizons-primaire",
}));
const initialInvoices: Invoice[] = [
  { id: 1, learnerId: 101, reference: "FAC-2026-001", amount: 245000, paidAmount: 245000, status: "paid" },
  { id: 2, learnerId: 102, reference: "FAC-2026-002", amount: 220000, paidAmount: 80000, status: "partial" },
  { id: 3, learnerId: 501, reference: "FAC-2026-501", amount: 310000, paidAmount: 0, status: "pending" },
];
const initialTransactions: Transaction[] = [
  { id: 1, invoiceId: 1, reference: "TX-2026-001", amount: 245000, method: "mobile", status: "confirmed" },
];

let learners = initialLearners.map((item) => ({ ...item }));
let invoices = initialInvoices.map((item) => ({ ...item }));
let transactions = initialTransactions.map((item) => ({ ...item }));

const router: IRouter = Router();

router.get("/demo/learners", (req, res) => {
  const establishmentId = typeof req.query.establishmentId === "string" ? req.query.establishmentId : undefined;
  res.json(establishmentId ? learners.filter((item) => item.establishmentId === establishmentId) : learners);
});

router.post("/demo/learners", (req, res) => {
  const { name, grade, guardian, establishmentId } = req.body ?? {};
  if (typeof name !== "string" || !name.trim() || typeof grade !== "string" || !grade.trim()) {
    res.status(400).json({ error: "name and grade are required" });
    return;
  }
  const learner: Learner = {
    id: Math.max(100, ...learners.map((item) => item.id)) + 1,
    name: name.trim(),
    grade: grade.trim(),
    guardian: typeof guardian === "string" && guardian.trim() ? guardian.trim() : "Non renseigné",
    establishmentId: typeof establishmentId === "string" ? establishmentId : "horizons-primaire",
  };
  learners = [learner, ...learners];
  res.status(201).json(learner);
});

router.get("/demo/invoices", (_req, res) => res.json(invoices));

router.post("/demo/payments", (req, res) => {
  const invoiceId = Number(req.body?.invoiceId);
  const amount = Number(req.body?.amount);
  const method = req.body?.method;
  const invoice = invoices.find((item) => item.id === invoiceId);
  if (!invoice || !Number.isFinite(amount) || amount <= 0 || !["cash", "transfer", "card", "mobile"].includes(method)) {
    res.status(400).json({ error: "invalid invoice, amount or payment method" });
    return;
  }
  const remaining = invoice.amount - invoice.paidAmount;
  if (amount > remaining) {
    res.status(400).json({ error: "amount exceeds outstanding balance" });
    return;
  }
  const paidAmount = invoice.paidAmount + amount;
  const status: Invoice["status"] = paidAmount >= invoice.amount ? "paid" : "partial";
  invoices = invoices.map((item) => item.id === invoiceId ? { ...item, paidAmount, status } : item);
  const transaction: Transaction = {
    id: Math.max(0, ...transactions.map((item) => item.id)) + 1,
    invoiceId,
    reference: `TX-DEMO-${Date.now()}`,
    amount,
    method,
    status: "confirmed",
  };
  transactions = [transaction, ...transactions];
  res.status(201).json(transaction);
});

router.get("/demo/transactions", (_req, res) => res.json(transactions));

router.post("/demo/reset", (_req, res) => {
  learners = initialLearners.map((item) => ({ ...item }));
  invoices = initialInvoices.map((item) => ({ ...item }));
  transactions = initialTransactions.map((item) => ({ ...item }));
  res.json({ status: "reset", demo: true });
});

export default router;
